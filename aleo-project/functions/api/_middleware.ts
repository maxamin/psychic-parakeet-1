export const onRequest: PagesFunction = async (context) => {
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
    next, // used for middleware or to fetch assets
    data, // arbitrary space for passing data between middlewares
  } = context
  const url = new URL(request.url);

  url.protocol = 'https:'
  url.hostname = 'api.lilnouns.dev';
  url.pathname = url.pathname.slice(4);
  url.port = '443';

  return fetch(url.toString(), request);
};
