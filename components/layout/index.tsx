import { useSession, } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Dashboard from "../dashboard";
import Sidebar from "../sidebar";
import Footer from "../footer";
import { ArrowDownLeft } from "lucide-react"
import { Tooltip } from 'react-daisyui';
import CharPanel from "../charpanel";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const userAuthenticatedAndLoaded = session && status !== "loading";
  return (
    <>
      <Sidebar />
      <div className='flex top-10 left-0 h-screen w-screen flex-col bg-gray-700'>
        {
          userAuthenticatedAndLoaded &&
          <>
            <CharPanel />
            <div className="flex flex-row pl-20">
              <Dashboard userId={session.user.id} />
            </div>
          </>
        }
        {
          !userAuthenticatedAndLoaded &&
          <>
            {children}
            <div className="fixed left-[54px] bottom-[16px]">
              <ArrowDownLeft color="red" size={42} className="animate-bounce" />
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
