import Head from 'next/head'
import Header from '../components/Header';
import Content from '../components/Content';

const Home = () => {
  return (
    <div>
      <Head>
        <title>NFT Metadata</title>
        <meta name="description" content="NFT Metadata fetcher" />
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
