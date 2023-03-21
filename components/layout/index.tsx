import { useSession, } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Dashboard from "../dashboard";
import Sidebar from "../sidebar";
import Footer from "../footer";
import { ArrowDownLeft } from "lucide-react"
import { Tooltip } from 'react-daisyui';
import CharPanel from "../charpanel";
import useStats from "./../../useStats"

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const userAuthenticatedAndLoaded = session && status !== "loading";
  const { data: userStats } = useStats(
    userAuthenticatedAndLoaded ? session.user.id : null
  );
  return (
    <>
      <Sidebar />
      <div className='flex top-10 left-0 h-screen w-screen flex-col bg-gray-700'>
        {
          userAuthenticatedAndLoaded &&
          <>
            <CharPanel userStats={userStats} session={session} />
            <div className="flex flex-row pl-20 pr-72">
              <Dashboard userId={session.user.id} userStats={userStats} session={session} />
            </div>
          </>
        }
        {
          !userAuthenticatedAndLoaded &&
          <>
          <div class="flex-grow ml-24">

          
            {children}
            </div>
          </>
        }
        {
          status == "loading" && <><p>Logging in to gameserver...</p></>
        }
        <p>{userAuthenticatedAndLoaded}</p>
        <Footer />
      </div>
    </>
  );
}
