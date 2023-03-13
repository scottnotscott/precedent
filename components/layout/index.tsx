import { useSession,  } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Dashboard from "../dashboard";
import Sidebar from "../sidebar";
import Footer from "../footer";

import { useEffect } from 'react'
import io from 'socket.io-client'
let socket

export default function Layout({children})
 {

  const { data: session, status } = useSession();
  const userAuthenticatedAndLoaded = session && status !== "loading";
  return (
    <>
    <Sidebar />
    <div className='content-container flex top-1 left-0 pl-20 h-screen w-screen flex-col'>
                  
                
              
              
          
        
        {
          userAuthenticatedAndLoaded && 
          <>
          <div className="flex flex-row">
          <Dashboard userId={session.user.id}/>
          </div>
          </>
        }
        {
          
          !userAuthenticatedAndLoaded && <>{children}</>
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
