import { useSession } from "next-auth/react";
import useSWR from 'swr'

import { Sword } from "lucide-react"
import { useState } from "react";
import MonsterCard from "./MonsterCard";



export default function Dashboard({ userId }) {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error, isLoading, isValidating } = useSWR(`/api/stats?userId=${userId}`, fetcher)
  if(error) console.log('error in dashboard: ', error)
  
  return (
    <>
        {error && <p>{error.message}</p>}
        {isLoading && <p>Loading gameversion...</p>}
        {data &&
          <>
          <h1 className="text-white">Beasts</h1>
          <div className="flex flex-col space-y-3 items-center container pt-28">
           <div className="flex flex-row ml-2 space-x-6">
            <MonsterCard id={1} />
            <MonsterCard id={2} />
            <MonsterCard id={3} />
           </div>
           <div className="flex flex-row ml-2 space-x-6">
            <MonsterCard id={4} />
            <MonsterCard id={5} />
            <MonsterCard id={1} />
           </div>
           </div>
          </>
        }

    </>
  );
}