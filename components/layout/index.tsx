import { FADE_IN_ANIMATION_SETTINGS } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import useScroll from "@/lib/hooks/use-scroll";

import { useEffect } from 'react'
import io from 'Socket.IO-client'
let socket

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session, status } = useSession();
  const scrolled = useScroll(50);

  useEffect(() => {
    async function socketInitialiser() {
        await fetch('api/socket')
        socket = io()

        socket.on('connect', () => {
            console.log('Connected')
        })
    }
    socketInitialiser();
 }, [])
  return (
    <>
      <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div
        className={`fixed top-0 w-full ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <Link href="/" className="flex items-center font-display text-2xl">
            <Image
              src="/logo.png"
              alt="Feudal logo"
              width="60"
              height="30"
              className="mr-2 rounded-sm"
            ></Image>
            <p>Feud.al</p>
          </Link>
          <div>
            <AnimatePresence>
              {!session && status !== "loading" ? (
                <motion.button
                  className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                  {...FADE_IN_ANIMATION_SETTINGS}
                >
                  <a href="http://localhost:3000/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F">Log in</a>
                </motion.button>
              ) : 
              <Image
              src={session?.user?.image}
              alt={session?.user?.name}
              width="30"
              height="30"
              onClick={() => signOut({redirect: false})}
              />
              }
            </AnimatePresence>
          </div>
        </div>
      </div>
      <main className="flex w-full flex-col items-center justify-center py-32">
      {children}
      </main>
      <div className="absolute w-full border-t border-gray-200 bg-white py-5 text-center">
        <p className="text-gray-500">
          Developed by @ 
          <a
            className="font-medium text-gray-800 underline transition-colors"
            href="https://twitter.com/smtmssctsmtmsnt"
            target="_blank"
            rel="noopener noreferrer"
          >
             smtmssctsmtmsnt
          </a>
        </p>
      </div>
      </div>
    </>
  );
}
