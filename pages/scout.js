// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Monsters from "@/components/monsters";
// import Scout from "@/components/Scout";

// export default function Scout({ userStats, session }) {
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
