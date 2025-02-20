'use strict'
let config = {
  origin: 'http://example.jp',
  session: true,
  xfo: true,
  xcto: true,
  staticFiles: [ '/static' ],
  evalTemplate: false,
  protectCsrf: true,
  defaultHeaders: undefined,
  basic: undefined,
  sessionIdGenerator: defaultIdGenerator,
  httponly: true
}

const http = require('http')
const fs = require('fs')
const crypto = require('crypto')
const qs = require('querystring')
const url = require('url')

function defaultIdGenerator () {
  let sha1 = crypto.createHash('sha1')
  sha1.update('salt-string' + crypto.randomBytes(16).toString('hex'))
  return sha1.digest('hex')
}

// eslint-disable-next-line no-unused-vars
function dumpBuf (buf) {
  let i, c, s1, s2
  s1 = ''
  s2 = ''
  let h = v => /(..)$/.exec('0' + v.toString(16))[ 1 ] + ' '
  for (i = 0; i < Buffer.byteLength(buf); i++) {
    c = buf[ i ]
    s1 += h(c)
    if (c <= 0x20 && c <= 0x7e) {
      s2 += String.fromCharCode(c)
    } else {
      s2 += '.'
    }
    if (i % 16 === 15) {
      console.log(s1, s2)
      s1 = ''
      s2 = ''
    }
  }
}

// eslint-disable-next-line no-unused-vars
let counter = (function (initial) {
  let val = initial
  return function () {
    return val++
  }
})(0)

http.ServerResponse.prototype.redirect = function (status, targetUrl) {
  if (targetUrl === undefined) {
    if (typeof status === 'string') {
      targetUrl = status
    } else {
      targetUrl = '/'
    }
    status = 302
  }
  targetUrl = targetUrl.replace(/[\r\n]/g, ' ')
  this.writeHead(status, { 'Location': targetUrl })
  this.end()
}

http.ServerResponse.prototype.respondJson = function (json) {
  this.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
  this.end(JSON.stringify(json))
}

http.ServerResponse.prototype.respondJsonp = function (json, callback) {
  if (callback === undefined) callback = 'callback'

  callback = callback.replace(/([^\w])/g, (s, p) => { return '\\u' + /([0-9a-fA-F]{4})$/.exec('0000' + p.charCodeAt(0).toString(16))[ 0 ] })
  this.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' })
  this.end(callback + '(' + JSON.stringify(json) + ')')
}

http.ServerResponse.prototype.respondStatic = (function () {
  let lastModified = {}
  return function (conn, filename) {
    if (filename === undefined) {
      filename = `.${conn.location.pathname}`
      if (filename.indexOf('../') !== -1) return conn.res.respondError(404)
      if (filename.indexOf('..\\') !== -1) return conn.res.respondError(404)
      if (filename.indexOf('\0') !== -1) return conn.res.respondError(404)
    }
    if (lastModified[ filename ] === undefined) {
      fs.stat(filename, function (error, stats) {
        if (!error) {
          lastModified[ filename ] = stats.mtime
        }
      })
    }
    fs.readFile(filename, function (err, data) {
      if (err) {
        console.warn(err, filename)
        return conn.res.respondError(404)
      }
      let ct = 'text/html'
      let m = /\.([^.]+)$/.exec(filename)
      if (m !== null && m[ 1 ]) {
        ct = mimetype(m[ 1 ])
      }
      if (lastModified[ filename ]) {
        conn.res.setHeader('Last-Modified', lastModified[ filename ].toGMTString())
      }
      conn.res.removeHeader('Cache-Control')
      conn.res.setHeader('Cache-Control', 'max-age=' + 60 * 60) // cache 1h
      conn.res.writeHead(200, { 'Content-Type': ct })
      conn.res.end(data)
    })
  }
})()

http.ServerResponse.prototype.respondDirIndex = function (dirname) {
  let template = `<html>\n<head><title>Index of /contact/log</title></head>\n<body bgcolor="white">\n<h1>Index of /contact/log</h1><hr>\n<pre><@ raw:text @>\n</pre>\n<hr></body></html>\n`
  let text = `<a href="../">../\n`
  let t = `<a href="<@ filename @>"><@ filename @></a><@ space @><@ time @> <@ size @>\n`
  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      console.error(err)
      return this.respondError(500)
    }
    let n = filenames.length
    let files = {}
    let dirs = {}
    if (n === 0) {
      this.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      this.end(render(template, { text: text }))
      return;
    }
    filenames.forEach(filename => {
      fs.lstat(`${dirname}/${filename}`, (err, stats) => {
        n--
        if (err) {
          files[filename] = { date: (new Date(0)).toLocaleString(), size: '0' }
        } else if (stats.isDirectory()) {
          dirs[filename + '/'] = { date: (new Date(stats.mtimeMs)).toLocaleString(), size: '-' }
        } else {
          files[filename] = { date: (new Date(stats.mtimeMs)).toLocaleString(), size: stats.size.toString() }
        }
        if (n === 0) {
          Object.keys(dirs).sort().forEach(filename => {
            let space = ' '
            if (filename.length < 50) space = space.padEnd(50 - filename.length, ' ')
            text += render(t, { filename: filename, space: space, time: dirs[filename].date, size: (dirs[filename].size).padStart(8, ' ') })
          })

          Object.keys(files).sort().forEach(filename => {
            let space = ' '
            if (filename.length < 50) space = space.padEnd(50 - filename.length, ' ')
            text += render(t, { filename: filename, space: space, time: files[filename].date, size: (files[filename].size).padStart(8, ' ') })
          })
          this.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
          this.end(render(template, { text: text }))
        }
      })
    })
  })
}

function htmlEscape (s) {
  s = s + ''
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;')
}
exports.htmlEscape = htmlEscape

// TODO: session_start, garbage collection
function SessionManager () {
  let _sessions = {}

  function newSessionObj (sessionId, res) {
    let _sid = sessionId
    let _store = {}
    function SessionObj (sessionId, res) {
      _sessions[ sessionId ] = this
      this.res = res
      return this
    }
    SessionObj.prototype.renew = function () {
      let old = _sid
      _sid = config.sessionIdGenerator()
      _sessions[ _sid ] = _sessions[ old ]
      delete _sessions[ old ]
      if (this.res !== undefined /* && !this.res.headersSent */) {
        this.res.setHeader('Set-Cookie', `session=${this.sessionId()}; path=/; ${config.httponly ? 'httponly' : ''}`)
      }
    }
    SessionObj.prototype.sessionId = function () {
      return _sid
    }
    SessionObj.prototype.get = function (name) {
      return _store[ name ]
    }
    SessionObj.prototype.set = function (name, value) {
      _store[ name ] = value
      return value
    }
    SessionObj.prototype.remove = function (name) {
      let value = _store[ name ]
      delete _store[ name ]
      return value
    }
    SessionObj.prototype.expire = function () {
      delete _sessions[ _sid ]
      if (this.res !== undefined) {
        this.res.setHeader('Set-Cookie', 'session=0; expires=Sat, 01 Jan 2000 00:00:00 GMT; path=/')
      }
    }
    let r = new SessionObj(sessionId, res)
    if (res !== undefined) {
      res.setHeader('Set-Cookie', `session=${r.sessionId()}; path=/; ${config.httponly ? 'httponly' : ''}`)
    }
    r.set('csrf_token', defaultIdGenerator())
    return r
  }

  return function (sessionId, res) {
    let sessionObj
    if (_sessions.hasOwnProperty(sessionId)) {
      sessionObj = _sessions[ sessionId ]
    } else {
      sessionObj = newSessionObj(config.sessionIdGenerator(), res)
    }
    sessionObj.res = res
    return sessionObj
  }
}

const parseCookie = function (cookie) {
  const safeDecode = function (s) {
    try {
      return decodeURIComponent(s)
    } catch (e) {
      return s
    }
  }
  let r = {}
  cookie = cookie.replace(/^Cookie:\s*/, '')
  let pairs = cookie.split(/; */g)
  for (let i = 0; i < pairs.length; i++) {
    let kv = pairs[ i ].split('=')
    r[ safeDecode(kv[ 0 ]) ] = safeDecode(kv[ 1 ])
  }
  return r
}

function mimetype (extension) {
  const types = {
    'txt': 'text/plain',
    'htm': 'text/html',
    'html': 'text/html',
    'js': 'text/javascript',
    'css': 'text/css',
    'json': 'application/json',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'xml': 'text/xml'
  }
  extension = extension.replace(/^\./, '')
  return types[ extension ] || 'applicaion/octet-stream'
}

/*
 * <@ value @> - escaped
 * <@ raw:value @>
 */
function render (template, param, conn) {
  if (typeof template !== 'string') template = ''
  if (typeof param !== 'object') param = {}
  let s
  s = template.replace(/<@\s*(raw:)?\s*([\w]+)\s*@>/g, (str, p1, p2) => {
    if (config.protectCsrf && p2 === 'csrf_token' && param[p2] === undefined) {
      return htmlEscape(conn.session.get('csrf_token'))
    } else {
      let s = param[ p2 ] === undefined ? '' : param[ p2 ]
      if (p1) {
        return s
      } else {
        return htmlEscape(s)
      }
    }
  })
  return s
}
exports.render = render

let defaultHandler = [
  {
    'pattern': ':401',
    'method': [ '*' ],
    'callback': 'Unauthorized'
  },
  {
    'pattern': ':403',
    'method': [ '*' ],
    'callback': 'Forbidden'
  },
  {
    'pattern': ':404',
    'method': [ '*' ],
    'callback': 'Not Found'
  },
  {
    'pattern': ':405',
    'method': [ '*' ],
    'callback': 'Method Not Allowed'
  },
  {
    'pattern': ':500',
    'method': [ '*' ],
    'callback': 'Internal Server Error'
  }
]

exports.createServer = function (_config, _handlers) {
  let server = http.createServer()
  let sessions = SessionManager()

  let handlers = []

  if (_handlers === undefined) _handlers = []
  _handlers.forEach((handler) => {
    let f = (_pattern, _method, _callback) => {
      handlers.push({
        pattern: _pattern,
        method: typeof _method === 'string' ? [ _method.toLowerCase() ] : _method.map(s => s.toLowerCase()),
        callback: _callback
      })
    }
    if (handler.pattern instanceof Array) {
      handler.pattern.forEach(pattern => {
        f(pattern, handler.method, handler.callback)
      })
    } else {
      f(handler.pattern, handler.method, handler.callback)
    }
  })

  if (_config !== undefined) {
    Object.keys(_config).forEach(function (key) {
      config[ key ] = _config[ key ]
    })
    // if( _config.origin ) config.origin = _config.origin
  }
  if (config.origin) {
    config.host = config.origin.replace(/^https?:\/\//, '')
  } else {
    config.origin = ''
  }
  if (config.basic === '') {
    delete config.basic
  }
  if (handlers === undefined) handlers = {}
  const errorHandler = function (status, conn) {
    let callback
    if (conn.res.headersSent) {
      return conn.res.end('Stauts ' + status)
    }
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[ i ].pattern === ':' + status) {
        callback = handlers[ i ].callback
        break
      }
    }
    if (!callback) {
      for (let i = 0; i < defaultHandler.length; i++) {
        if (defaultHandler[ i ].pattern === ':' + status) {
          callback = defaultHandler[ i ].callback
          break
        }
      }
    }
    if (!callback) {
      status = '500'
      callback = 'Internal Server Error'
    }
    console.log((conn.location ? conn.location : '').href + ' - ' + status)
    if (typeof callback === 'function') {
      callback(conn, status)
    } else {
      conn.res.writeHead(status, { 'Content-Type': 'text/plain;charset=utf-8' })
      conn.res.end(callback)
    }
  }

  http.ServerResponse.prototype.respondError = function (status) {
    let _this = this
    return errorHandler(status, { 'res': _this })
  }

  server.on('request', function (req, res) {
    let location
    let session
    let sid

    res.request = req
    const fireCallback = function (conn) {
      conn.res.error = function (status) {
        errorHandler(status, conn)
      }
      let i, h, m, callback
      try {
        let method = req.method.toLowerCase()
        for (i = 0; i < handlers.length; i++) {
          m = null
          h = handlers[ i ]
          let patternMatched = false
          if (h.pattern instanceof RegExp) {
            m = h.pattern.exec(conn.location.pathname)
            if (m !== null) {
              callback = h.callback
              patternMatched = true
            }
          } else {
            if (h.pattern === conn.location.pathname) {
              callback = h.callback
              patternMatched = true
            }
          }
          if (callback) {
            if (patternMatched && (h.method.indexOf('*') !== -1 || h.method.indexOf(method) !== -1)) {
              if (m !== null) {
                return callback(conn, m)
              } else {
                return callback(conn)
              }
            }
          }
        }
        if (callback) {
          return errorHandler(405, conn)
        } else {
          return errorHandler(404, conn)
        }
      } catch (e) {
        console.error((new Date()).toLocaleString(), e.stack)
        return errorHandler(500, conn)
      }
    }

    {
      let remote = req.headers[ 'x-real-ip' ]
      if (remote === undefined) remote = req.connection.remoteAddress
      console.log(`${(new Date()).toLocaleString()}: ${req.method} ${req.url} from ${remote}`)
    }
    res.setHeader('Server', 'nodejs')
    res.setHeader('Cache-Control', 'no-store')
    if (config.session) {
      sid = parseCookie(req.headers[ 'cookie' ] || '')[ 'session' ] || ''
      session = sessions(sid, res)
    }
    if (config.xfo) {
      res.setHeader('X-Frame-Options', 'DENY')
    }
    if (config.xcto) {
      res.setHeader('X-Content-Type-Options', 'nosniff')
    }
    try {
      location = url.parse(config.origin + req.url, true)
    } catch (e) {
      console.error((new Date()).toLocaleString(), e.stack)
      location = url.parse(config.origin, true)
      return errorHandler(500, { req, res, location, session })
    }
    if (typeof config.defaultHeaders === 'object') {
      for (let n in config.defaultHeaders) {
        res.setHeader(n, config.defaultHeaders[ n ])
      }
    } else if (typeof config.defaultHeaders === 'function') {
      let headers = config.defaultHeaders({ req, location, session })
      if (typeof headers === 'object') {
        for (let n in headers) {
          res.setHeader(n, headers[ n ])
        }
      }
    }
    if (config.host && req.headers[ 'host' ] && req.headers[ 'host' ] !== config.host) {
      console.log('Unmatched host:', 'req.headers[ host ]=', req.headers[ 'host' ], 'config.host=', config.host)
      return errorHandler(500, { req, res, location, session })
    }
    if (config.basic !== undefined) {
      let auth = req.headers['authorization']
      res.setHeader('WWW-Authenticate', 'Basic realm="enter username/password"')
      if (auth === undefined || (Buffer.from('' + config.basic).toString('base64') !== auth.replace(/^basic\s+/i, ''))) {
        return errorHandler(401, { req, res, location, session })
      }
    }
    if (!config.staticFiles.every(dirname => { return location.pathname.substring(0, dirname.length) !== dirname })) {
      return res.respondStatic({ req, res, location, session })
    } else if (req.method === 'POST' && (req.headers[ 'content-type' ] || '').match(/^application\/x-www-form-urlencoded[ ;]?/i)) {
      let body = ''
      req.on('data', data => {
        body += data
      })
      req.on('end', function (data) {
        let params = {}
        try {
          params = qs.parse(body)
        } catch (e) {
          console.error(e.stack)
        }

        if (config.protectCsrf && params.token !== session.get('csrf_token')) {
          return errorHandler(403, { req, res, location, session, 'body': params })
        }
        return fireCallback({ req, res, location, session, body: params })
      })
    } else if (req.method === 'POST' && (req.headers[ 'content-type' ] || '').match(/^text\/plain[ ;]?/i)) {
      let body = ''
      let token = session.get('csrf_token') // TODO: token should be specified by http request header
      req.on('data', data => {
        body += data
      })
      req.on('end', function (data) {
        if (config.protectCsrf && token !== session.get('csrf_token')) {
          return errorHandler(403, { req, res, location, session, body })
        }
        return fireCallback({ req, res, location, session, body })
      })
    } else if (req.method === 'POST' && (req.headers[ 'content-type' ] || '').match(/^multipart\/form-data[ ;]?/i)) {
      let m = /;\s*boundary=(.+)$/.exec(req.headers[ 'content-type' ]) || ['', '']
      let boundary = m[ 1 ]
      let data = ''
      // TODO:
      req.on('data', chunk => {
        // dumpBuf(chunk)
        data += chunk
        if (boundary) {
        }
      })
      req.on('end', () => {
        return fireCallback({ req, res, location, session, body: data })
      })
    } else {
      return fireCallback({ req, res, location, session })
    }
  })
  return server
}
