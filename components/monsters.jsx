import { useState } from "react";
import useSWR from "swr";
import MonsterCard from "./MonsterCard";
import BattleScreen from "./BattleScreen";
import useMonsters from "./../useMonsters";

export default function Monsters({ userStats, session }) {
  const [currentMonster, setCurrentMonster] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Konoki forest");
  const { data, error, isLoading } = useMonsters(currentMonster);
  const { mutate } = useSWR(`/api/inventory?userId=${session.user.id}`);

  const handleEngageClick = (monsterId) => {
    setCurrentMonster(monsterId);
  };
  const handleBattleEnd = () => {
    setTimeout(() => {
      setCurrentMonster(null);
      mutate();
    }, 3000);
  };

  if (currentMonster && data && userStats) {
    return (
      <BattleScreen
        monsterId={currentMonster}
        baseHP={userStats.hp}
        session={session}
        onBattleEnd={handleBattleEnd}
      />
    );
  }

  const renderMonsterCards = (area) => {
    let monsterIds;
    if(area === "Konoki forest") {monsterIds = [1,2,3,4,5,6]}
    if(area === 'Shine dungeon') {monsterIds = [6,5,4,3,2,1]}
    if(area === 'Shroud mountain') {monsterIds = [2,1,4,3,6,5]}
    if(area === 'Syndicate depths') {monsterIds = [5,6,3,4,1,2]}
    return monsterIds.map((id) => (
      <MonsterCard key={id} id={id} onEngageClick={handleEngageClick} />
    ));
  };

  const renderTabButton = (tabName) => {
    const isSelected = selectedTab === tabName;
    return (
      <button
        className={`bg-gray-800 ${
          isSelected ? "text-purple-600 animate-pulse" : "text-purple-400"
        } px-4 py-2 rounded-t-lg border border-purple-400 focus:outline-none`}
        onClick={() => setSelectedTab(tabName)}
      >
        {tabName}
      </button>
    );
  };

  return (
    <>
      <div className="flex flex-col space-y-3 items-center h-screen">
        <div className="flex w-full h-screen">
          <div className="flex flex-col space-y-2 bg-gray-800 ">
            {renderTabButton("Konoki forest")}
            {renderTabButton("Shine dungeon")}
            {renderTabButton("Shroud mountain")}
            {renderTabButton("Syndicate depths")}
          </div>
          <div className="flex-grow ">
            <div className="bg-gray-800 border border-purple-400 pt-16 h-screen">
              <div className="flex flex-wrap justify-center gap-6">
                {renderMonsterCards(selectedTab)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
