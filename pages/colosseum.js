import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "@/components/layout";
import Monsters from "@/components/monsters";

export default function Colosseum({ userStats, session }) {
  const router = useRouter();

  useEffect(() => {
    if (!userStats || !session) {
      router.push('/');
    }
  }, [userStats, session]);

  return (
    <Layout userStats={userStats} session={session}>
      {userStats && session && <Monsters userStats={userStats} session={session} />}
    </Layout>
  );
}
