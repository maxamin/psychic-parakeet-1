const {join} = require('path');
const {execSync, execFileSync} = require('child_process');

module.exports = {

  indirect: (req, res) => {

    const args = req.query.args;

    const script = join(__dirname, '..', 'bin', 'less.js');

    const cmd = `node ${script} ${args}`;

    res.status(200).send(execSync(cmd).toString());
  },

  environ: (req, res) => {
    const cmd = "ls -la " + join(__dirname, "../public");
    res.status(200).send(execSync(cmd).toString());
    // res.status(200).send(execFileSync('ls', ['-la', join(__dirname, "../public")]).toString());
  },

  // http://localhost:3000/cat?file=readme.md|whoami
  cat: (req, res) => {
    const file = req.query.file;
    res.status(200).send(execSync(`cat ${file}`).toString());
  },

  // http://localhost:3000/cmd?args=whoami
  cmd: (req, res) => {
    const args = req.query.args;
    res.status(200).send(execSync(args).toString());
  }
};
