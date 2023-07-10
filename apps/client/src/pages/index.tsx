import HelloWorld from '@src/components/HelloWorld';
import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { CoolInterface } from 'server/src/lib/CoolInterface';
import { Button } from 'ui';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const coolKid: CoolInterface = {
  amICool: false,
};

const Home = (props: { content: string; name: string }) => {
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue('Create Next App');
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>{props.content}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        {props.content}
        <HelloWorld />x
        <Button text="this is also button " backgroundColor="black" />
        <div className="bg-yellow-200 h-12 w-12"> {props.name}</div>
      </main>
    </div>
  );
};
export const getStaticProps = async () => {
  const res = await axios.get('http://localhost:8080/post');
  return {
    props: {
      content: 'Create Next App',
      name: res.data.name,
    },
  };
};

export default Home;
