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
    <div className={`flex min-h-screen bg-gray-700 ${!session ? "justify-center" : ""}`}>
      {session && <Sidebar session={session} />}
      <div className={`flex-grow flex flex-col ${session ? "w-full" : "w-screen"}`}>{renderChildren()}</div>
      {session && <CharPanel userStats={userStats} session={session} />}
      <Footer />
    </div>
  );
}
