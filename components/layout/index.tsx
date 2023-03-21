import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Monsters from "../monsters";
import Sidebar from "../sidebar";
import Footer from "../footer";
import { ArrowDownLeft } from "lucide-react";
import { Tooltip } from "react-daisyui";
import CharPanel from "../charpanel";
import useStats from "./../../useStats";
import React from "react";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const userAuthenticatedAndLoaded = session && status !== "loading";
  const { data: userStats } = useStats(userAuthenticatedAndLoaded ? session.user.id : null);
  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      return React.cloneElement(child, { userStats, session });
    });
  };
  return (
    <>
      {session && <Sidebar session={session} />}
      <div
        className="flex top-10 left-0 h-screen w-screen flex-col bg-gray-700"
        style={!session ? { width: '100%', left: 0 } : {}}
      >
        {session ? (
          <>
            <CharPanel userStats={userStats} session={session} />
            {renderChildren()}
          </>
        ) : (
          children
        )}
        <Footer />
      </div>
    </>
  );
}
