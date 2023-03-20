import Image from "next/image";
import { Avatar } from 'react-daisyui';
import ActivityHeartbeat from "./activityheartbeat";

export default function CharPanel({ userStats, session }) {
    if (!userStats) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading stats...</p>
            </div>
        )
    }
    return (

        <div className="fixed top-0 right-0 h-screen w-64 m-0 
                flex flex-col
              bg-gray-900 text-white shadow-lg
                px-3 px-2 inline-flex items-center pt-2">
            <div className="flex flex-col items-center bg-gray-900 text-pink-300 rounded-md">
                <div className="flex flex-row items-center  text-white-900 mb-2"> <h3 className="text-white">Character Sheet</h3> </div>
                <div className="flex flex-row items-center"> <Avatar size="lg" src={session.user.image} /> </div>
                <p>Name:<div className="bg-[url('https://media1.giphy.com/media/3ohhwBrZCQBtmVA91K/giphy.gif')]">{session.user.name}</div></p>
                <p>XP: {userStats.exp}</p>
                <p>Level: {userStats.level}</p>
                <p>Rank: {userStats.rank}</p>
                <p>Village: {userStats.village}</p>
                <p>Health: {userStats.hp}</p>
                <div className="mt-2"></div>
                <div className="flex flex-row items-center text-white mb-2"> <p>Melee Stats</p> </div>
                <p>str: {userStats.str}</p>
                <p>def: {userStats.def}</p>
                <div className="mt-2"></div>
                <div className="flex flex-row items-center text-white mb-2"> <p>Magic Stats</p> </div>
                <p>mag: {userStats.mag}</p>
                <p>res: {userStats.res}</p>
                <div className="mt-2"></div>
                <div className="flex flex-row items-center text-white mb-2"> <p>Ranged Stats</p> </div>
                <p>rng: {userStats.rng}</p>
                <p>eva: {userStats.eva}</p>
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
