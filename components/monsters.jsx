import { useState } from "react";
import useSWR from "swr";
import MonsterCard from "./MonsterCard";
import BattleScreen from "./BattleScreen";
import useMonsters from "./../useMonsters";

export default function Monsters({ userStats, session }) {
  const [currentMonster, setCurrentMonster] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Konoki range");
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
    if(area === "Konoki range") {monsterIds = [1,2,3,4,5,6]}
    if(area === 'Shine peaks') {monsterIds = [7,8,9,10,11,12]}
    if(area === 'Shroud forest') {monsterIds = [2,1,4,3,6,5]}
    if(area === 'Current') {monsterIds = [5,6,3,4,1,2]}
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

  const getBackgroundURL = () => {
    switch (selectedTab) {
      case "Konoki range":
        return "bg-[url('https://i.imgur.com/eCIIjFR.png')]";
      case "Shine peaks":
        return "bg-[url('https://i.imgur.com/CblojUl.png')]";
      case "Shroud forest":
        return "bg-[url('https://i.imgur.com/hcKgnAQ.png')]";
      case "Current":
        return "bg-[url('https://i.imgur.com/HtmHxaE.png')]";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-3 items-center h-screen">
        <div className="flex w-full h-screen">
          <div className="flex flex-col space-y-2 bg-gray-800 ">
            {renderTabButton("Konoki range")}
            {renderTabButton("Shine peaks")}
            {renderTabButton("Shroud forest")}
            {renderTabButton("Current")}
          </div>
          <div className="flex-grow">
          <div
            className={`${getBackgroundURL()} bg-cover border-purple-400 pt-32 h-screen`}
          >
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
