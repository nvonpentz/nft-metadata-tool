import Head from 'next/head'
import Header from '../components/Header';
import Content from '../components/Content';

const Home = () => {
  return (
    <div>
      <Head>
        <title>NFT Metadata Tool</title>
        <meta name="description" content="A tool to fetch NFT Metadata" />
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
