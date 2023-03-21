import { useState } from "react";
import MonsterCard from "./MonsterCard";
import BattleScreen from "./BattleScreen";
import useMonsters from "./../useMonsters";

export default function Monsters({ userStats, session }) {
  const [currentMonster, setCurrentMonster] = useState(null);
  const { data, error, isLoading } = useMonsters(currentMonster);

  const handleEngageClick = (monsterId) => {
    setCurrentMonster(monsterId);
  };
  
  if (currentMonster && data && userStats) {
    return <BattleScreen monsterId={currentMonster} baseHP={userStats.hp} session={session} />;
  }
  
  return (
    <>
      <div className="flex flex-col space-y-3 items-center container pt-28">
        <div className="flex flex-row ml-3 space-x-6">
    {console.log("Monsters userStats:", userStats)}
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
