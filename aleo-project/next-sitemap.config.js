/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://lilnouns.dev',
  generateRobotsTxt: true, // (optional)
  // ...other options
  sitemapSize: 500,
}
