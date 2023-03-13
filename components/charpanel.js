import { Home, Cherry, Beer, Eye, Facebook, Globe2, Sword, Swords } from "lucide-react"
import { useState } from "react";
import { Tooltip } from 'react-daisyui';
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import useSWR from 'swr'
import { Avatar } from 'react-daisyui';
import ActivityHeartbeat from "./activityheartbeat";


export default function CharPanel({userId}) {
    const { data: session, status } = useSession();
    const fetcher = (...args) => fetch(...args).then(res => res.json())
    console.log(session.user.id)
    const { data, error, isLoading } = useSWR(`/api/stats?userId=${session.user.id}`, fetcher)

    if(isLoading) { return (<p>loading content...</p>)}
    return (

<div className="fixed top-0 right-0 h-screen w-64 m-0 
                flex flex-col
              bg-gray-900 text-white shadow-lg
                px-3 px-2 inline-flex items-center pt-2">
<div className="flex flex-col items-center bg-gray-900 text-pink-300 rounded-md">
        <div className="flex flex-row items-center  text-white-900 mb-2"> <h3 className="text-white">Character Sheet</h3> </div>
        <div className="flex flex-row items-center"> <Avatar  size="lg" src={session.user.image} /> </div>
            <p>Name: {session.user.name}</p>
            <p>XP: {data.exp}</p>
            <p>Level: {data.level}</p>
            <p>Rank: {data.rank}</p>
            <p>Village: {data.village}</p>
            <p>Health: {data.hp}</p>
            <div className="mt-2"></div>
            <div className="flex flex-row items-center text-white mb-2"> <p>Melee Stats</p> </div>
            <p>str: {data.str}</p>
            <p>def: {data.def}</p>
            <div className="mt-2"></div>
            <div className="flex flex-row items-center text-white mb-2"> <p>Magic Stats</p> </div>
            <p>mag: {data.mag}</p>
            <p>res: {data.res}</p>
            <div className="mt-2"></div>
            <div className="flex flex-row items-center text-white mb-2"> <p>Ranged Stats</p> </div>
            <p>rng: {data.rng}</p>
            <p>eva: {data.eva}</p>
            </div>
            <div className="mt-2"></div>
            <div className="flex flex-row items-center text-white mb-2"> <p>Current Activity </p> </div>
            <div className="mt-2"></div>
            <ActivityHeartbeat />










                   

           
            <div className="fixed bottom-0 text-center items-center pt-2 flex flex-col px-2 px-2">
                {!session && 
                <a href="http://localhost:3000/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F">Log in</a>
                }

                {session && 
                <>
                <div className="flex flex-col items-center">
                 <Image src={session?.user?.image} alt={session?.user?.name} width="30" height="30" />
                 <p>a</p>
                 </div>
                </>
               
                }
            </div>
        </div>
    )
};
