import Head from 'next/head'

function HeadComps({ title = 'DAOSwap', desc = 'Web3 Crowndfounds and DEX' }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

export default HeadComps
