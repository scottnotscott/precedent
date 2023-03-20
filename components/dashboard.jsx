import { useSession } from "next-auth/react";
import useSWR from 'swr'
import { Sword } from "lucide-react"
import { useState, useEffect } from "react";
import MonsterCard from "./MonsterCard";
import BattleScreen from './BattleScreen';

export default function Dashboard({ userId }) {
  useEffect(() => {
    const savedBattleState = localStorage.getItem('battleState');
    if (savedBattleState) {
      const { userStats: savedUserStats, monsterStats: savedMonsterStats } = JSON.parse(savedBattleState);
      handleEngageClick(savedMonsterStats.id);
    }
  }, []);
  const [currentMonster, setCurrentMonster] = useState(null);
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error, isLoading, isValidating } = useSWR(`/api/stats?userId=${userId}`, fetcher)

   // Add a function to handle the "Engage" button click
   const handleEngageClick = (monsterId) => {
    setCurrentMonster(monsterId);
  };

  if(error) console.log('error in dashboard: ', error)
  if(currentMonster) return (<BattleScreen userId={userId} monsterId={currentMonster} />)
  if(error) return(<p>{error.message}</p>)
  if(isLoading) return(<p>Loading gameversion...</p>)
  if(data) return(
            <>
            <div className="flex flex-col space-y-3 items-center container pt-28">
            <div className="flex flex-row ml-2 space-x-6">
              <MonsterCard id={1} onEngageClick={handleEngageClick} />
              <MonsterCard id={2} onEngageClick={handleEngageClick} />
              <MonsterCard id={3} onEngageClick={handleEngageClick} />
            </div>
            <div className="flex flex-row ml-2 space-x-6">
              <MonsterCard id={4} onEngageClick={handleEngageClick} />
              <MonsterCard id={5} onEngageClick={handleEngageClick} />
              <MonsterCard id={6} onEngageClick={handleEngageClick} />
            </div>
            </div>
            </>
    );
  }