/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n.ts');
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
            config.resolve.fallback = {
                fs: false,
                net: false,
                tls: false
            }
        }

        return config;
    },
    experimental:{ serverActions:true, }
}

module.exports = withNextIntl(nextConfig)
// module.exports = nextConfig
// module.exports = withNextIntl({
//     webpack: (config, { isServer }) => {
//         if (!isServer) {
//             // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
//             config.resolve.fallback = {
//                 fs: false,
//                 net: false,
//                 tls: false
//             }
//         }

//         return config;
//     },
// })
