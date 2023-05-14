import Head from 'next/head'
import Header from '../components/Header';
import Content from '../components/Content';

const Home = () => {
  return (
    <div>
      <Head>
        <title>NFT Metadata Tool</title>
        <meta name="description" content="A tool to see how NFTs are implemented under the hood" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://metadata.nvp.dev" />
        <meta property="og:title" content="NFT Metadata Tool" />
        <meta property="og:description" content="A tool to see how NFTs are implemented under the hood." />
        <meta property="og:image" content="https://metadata.nvp.dev/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://metadata.nvp.dev" />
        <meta name="twitter:title" content="NFT Metadata Tool" />
        <meta name="twitter:description" content="A tool to see how NFTs are implemented under the hood." />
        <meta name="twitter:image" content="https://metadata.nvp.dev/og-image.png" />

        <link href='https://fonts.googleapis.com/css?family=Bungee' rel='stylesheet'/>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header/>
        <Content/>
      </main>
    </div>
  )
}

export default Home;
