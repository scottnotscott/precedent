import { Home, Cherry, Beer, Eye, Facebook, Globe2, Sword, Swords } from "lucide-react"
import { useState } from "react";
import { Tooltip } from 'react-daisyui';
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

//TODO:: add breakpoints for mobile devices so sidebar doesn't break on smaller screens
//TODO:: implement useSWR for data fetching
export default function Sidebar() {
    const { data: session, status } = useSession();
    const [isShown, setIsShown] = useState(false);

    function trigger(e) {
        setIsShown("open")
    }

    
    return (
        <div className="fixed top-0 left-0 h-screen w-16 m-0 
                        flex flex-col
                        bg-gray-900 text-white shadow-lg
                        px-3 px-2 inline-flex items-center pt-2">

                    <Tooltip message="Game logo. Returns to home." position="right" onMouseEnter={trigger} >     
                    <Cherry color="red" size ={48} />
                    </Tooltip>
           
            <div className="mt-12"></div>

            <Tooltip message="Return to your home." position="right" onMouseEnter={trigger} > 
            <i><Home color="pink" size={28} /></i>
            </Tooltip>
            <div className="mt-2"></div>
            <Tooltip message="Visit your town." position="right" onMouseEnter={trigger} > 
            <i><Beer color="pink" size={28} /></i>
            </Tooltip>
            <div className="mt-2"></div>
            <Tooltip message="Scout for players." position="right" onMouseEnter={trigger} > 
            <i><Eye color="pink" size={28} /></i>
            </Tooltip>

            <div className="mt-12"></div>

        <Tooltip message="Happenings around the world." position="right" onMouseEnter={trigger} >
        <i><Globe2 color="pink" size={28} /></i>
        </Tooltip>
        <div className="mt-2"></div>

        <Tooltip message="Enter the Colosseum." position="right" onMouseEnter={trigger} >
        <i><Sword color="pink" size={28} /></i>
        </Tooltip>
        <div className="mt-2"></div>

        <Tooltip message="Enter the PVP Colosseum." position="right" onMouseEnter={trigger} >
        <i><Swords color="pink" size={28} /></i>
        </Tooltip>
        <div className="mt-2"></div>

            <div className="fixed bottom-16 text-center items-center pt-2 inline-flex px-3 px-2">
                <i><Facebook color="pink" size={48} /></i>
            </div>
            <div className="fixed bottom-0 text-center items-center pt-2 inline-flex px-3 px-2">
                {!session && 
                <a href="http://localhost:3000/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F">Log in</a>
                }

                {session && 
                <>
                <div className="flex flex-col items-center">
                 <Image src={session?.user?.image} alt={session?.user?.name} width="30" height="30" />
                 <p onClick={() => signOut({redirect: false})}>Sign Out</p>
                 </div>
                </>
               
                }
            </div>
        </div>
    )
};
