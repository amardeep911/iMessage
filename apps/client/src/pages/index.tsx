import { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';

const Home: NextPage = () => {
  const { data } = useSession();
  console.log(data);

  return (
    <div>
      <button onClick={() => signIn('google')}>Sign in </button>
    </div>
  );
};

export default Home;
