import { Home, Cherry, Beer, Eye, Facebook, Globe2, Sword, Swords, Lock } from "lucide-react"
import { useState } from "react";
import { Tooltip } from 'react-daisyui';
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link"

//TODO:: add breakpoints for mobile devices so sidebar doesn't break on smaller screens
export default function Sidebar() {
    const { data: session, status } = useSession();
    const [isShown, setIsShown] = useState(false);

    function trigger(e) {
        setIsShown("open")
    }


    return (
        <div className="h-screen w-24
        flex flex-col
        bg-gray-900 text-white shadow-lg
        p-3 items-center">
            <Link href="/">
            <Tooltip message="Game logo. Returns to home." position="right" onMouseEnter={trigger} >
                <Image src="https://i.imgur.com/RUCEyc5.png" alt="feudal logo" width="50" height="50" />
            </Tooltip>
            </Link>
            <div className="mt-12"></div>
            <Link href="/">
            <Tooltip message="Return home" position="right" onMouseEnter={trigger} >
                <i><Home color="pink" size={28} /></i>
            </Tooltip>
            </Link>
            <div className="mt-2"></div>
            <Tooltip message="Visit town" position="right" onMouseEnter={trigger} >
                <i><Lock color="pink" size={28} /></i>
            </Tooltip>
            <div className="mt-2"></div>
            <Tooltip message="Scout for players" position="right" onMouseEnter={trigger} >
                <i><Lock color="pink" size={28} /></i>
            </Tooltip>

            <div className="mt-12"></div>

            <Tooltip message="Happenings around the world" position="right" onMouseEnter={trigger} >
                <i><Lock color="pink" size={28} /></i>
            </Tooltip>
            <div className="mt-2"></div>

            <Link href="/colosseum">

                <Tooltip message="Enter the Colosseum" position="right" onMouseEnter={trigger}>
                    <i>
                        <Sword color="pink" size={28} />
                    </i>
                </Tooltip>
            </Link>
            <div className="mt-2"></div>

            <Tooltip message="Enter the PVP Colosseum" position="right" onMouseEnter={trigger} >
                <i><Lock color="pink" size={28} /></i>
            </Tooltip>
            <div className="mt-2"></div>
            <div className="fixed bottom-0 text-center items-center pt-2 flex flex-col pr-6">

                {session &&
                    <>
                        <div className="flex flex-col items-center mb-10">
                            <Image src={session?.user?.image} alt={session?.user?.name} width="30" height="30" />
                            <p onClick={() => signOut({ redirect: false })}>Sign Out</p>
                        </div>
                    </>

                }
            </div>
        </div>
    )
};
