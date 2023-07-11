import { signIn, useSession } from 'next-auth/react';

const Home = () => {
  const { data } = useSession();
  console.log(data);
  console.log(process.env.GOOGLE_CLIENT_ID);
  return (
    <div>
      <button onClick={() => signIn('google')}>Sign in </button>
    </div>
  );
};

export default Home;
