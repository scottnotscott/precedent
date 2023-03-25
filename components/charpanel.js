import Image from "next/image";
import { Avatar } from 'react-daisyui';

export default function CharPanel({ userStats, session, userInventory }) {


    if (!userStats) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading character...</p>
            </div>
        )
    }
    return (

        <div className="h-screen w-64 md:w-48 sm:w-32
        flex flex-col
      bg-gray-900 text-white shadow-lg
        p-3 sm:p-2 items-center">
            <div className="flex flex-col items-center bg-gray-900 text-pink-300 rounded-md">
                <div className="flex flex-row items-center  text-white-900 mb-2"> <h3 className="text-white">Character Sheet</h3> </div>
                <div className="flex flex-row items-center"> <Avatar size="lg" src={session.user.image} /> </div>
                <p>Name:<div className="bg-[url('https://media1.giphy.com/media/3ohhwBrZCQBtmVA91K/giphy.gif')]">{session.user.name}</div></p>
                <p>
                    {userStats.exp}/
                    {userStats.level !== 1 ? (
                        1000 * (userStats.level - 1) * (userStats.level - 1)
                    ) : (
                        1000 * userStats.level * userStats.level
                    )}
                    xp</p>
                <p>Level: {userStats.level}</p>
                <p>Rank: {userStats.rank}</p>
                <p>Village: {userStats.village}</p>
                <p>Health: {userStats.hp_current}/{userStats.hp}</p>
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
            {userStats.activity == 'COMBAT' && (
                <div className="flex flex-row items-center text-red mb-2"> <p>{userStats.activity}</p></div>
            )}
            {userStats.activity !== 'COMBAT' && (
                <div className="flex flex-row items-center text-green-700 mb-2"> <p>{userStats.activity}</p></div>
            )}
            <div className="mt-2"></div>
            <div className="mt-2"></div>
            <p>Inventory</p>
            {userInventory && (
                <>
                    {Object.entries(userInventory)
                        .filter(([key]) => key.startsWith("slot"))
                        .map(([key, slot]) => {
                            if (slot) {
                                return (
                                    <p key={key}>
                                        {slot.name} x{slot.quantity}
                                    </p>
                                );
                            }
                            return null;
                        })}
                </>
            )}
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
