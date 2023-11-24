// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Monsters from "@/components/monsters";

// export default function Colosseum({ userStats, session }) {
//   const router = useRouter();

//   useEffect(() => {
//     if (!userStats || !session) {
//       router.push('/');
//     }
//   }, [userStats, session]);

//   return (
//     userStats && session && <Monsters userStats={userStats} session={session} />
//   );
// }
