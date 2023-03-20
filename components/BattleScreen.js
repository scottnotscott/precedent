import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Image from "next/image";
import { useSession } from "next-auth/react";

const BattleScreen = ({ userId, monsterId, baseHP }) => {
  const [battleOutcome, setBattleOutcome] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [monsterStats, setMonsterStats] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [selectedMove, setSelectedMove] = useState('strength');
  const [isUpdatingHealth, setIsUpdatingHealth] = useState(false);
  const [userAction, setUserAction] = useState(null);
  const [monsterAction, setMonsterAction] = useState(null);
  const { data: session, status } = useSession();
  let battleEnd = false;

  const countdownRef = useRef(countdown);

  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);

  const { data: userData } = useSWR(`/api/stats?userId=${userId}`);
  useEffect(() => {
    if (userData) {
        setUserStats(userData);
    }
  }, [userData]);

  const { data: monstersData } = useSWR(`/api/monsters`);
  const monsterData = monstersData && monstersData.find(monster => monster.id === monsterId);
  useEffect(() => {
    if (monsterData) {
      const savedBattleState = localStorage.getItem("battleState");
      if (savedBattleState) {
        const { monsterStats: savedMonsterStats } = JSON.parse(savedBattleState);
        savedMonsterStats.hp = savedMonsterStats.base_hp
        setMonsterStats(savedMonsterStats);
      } else {
        setMonsterStats({ ...monsterData, hp: monsterData.base_hp }); // Add this line
      }
    }
  }, [monsterData]);
  

  useEffect(() => {
    if (userStats && monsterStats && !battleEnd) {
      const countdownInterval = setInterval(() => {
        if (!isUpdatingHealth) {
          if (countdownRef.current > 0) {
            setCountdown(countdownRef.current - 1);
          } else {
            setIsUpdatingHealth(true);
            runBattle();
          }
        }
      }, 1000);
      
      return () => {
        clearInterval(countdownInterval);
      };
    }
  }, [userStats, monsterStats, countdown, isUpdatingHealth]);
  


  const runBattle = async () => {
    const response = await axios.post('/api/battle', {
      userStats,
      monsterStats,
      selectedMove,
    });
  
    const { outcome, updatedUserStats, updatedMonsterStats, userDamage, monsterDamage } = response.data;
    setUserStats(updatedUserStats);
    setMonsterStats(updatedMonsterStats);

    setUserAction({ move: selectedMove, damage: userDamage });
    setMonsterAction({ move: "base_str", damage: monsterDamage });
  
    // Save the battle state to local storage
    localStorage.setItem('battleState', JSON.stringify({ userStats: updatedUserStats, monsterStats: updatedMonsterStats }));
  
    if (outcome) {
      setBattleOutcome(outcome);
      battleEnd = true;
      localStorage.removeItem('battleState'); // Remove the battle state from local storage when the battle ends
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      setIsUpdatingHealth(false);
      setCountdown(5);
      localStorage.removeItem('battleState'); // Reset the countdown after updating health
    }
  };
  
  
 


  const handleMoveChange = (e) => {
    setSelectedMove(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Battle Screen</h1>
      <div className="w-full flex flex-col md:flex-row justify-between">
        <div className="md:w-1/3 flex flex-col items-center">
          
          {userStats && (
            <>
            <h2 className="text-xl font-semibold mb-4">{session?.user?.name}</h2>
            <Image src={session?.user?.image} alt={session?.user?.name} width={250} height={250} />
            <p>Health: {userStats.hp}/{baseHP}</p>
            <progress className="progress progress-error w-46" value={userStats.hp} max={baseHP}></progress>
            <div>
              <p className="pt-3">Attack Options</p>
            <input
              type="radio"
              id="strength"
              name="move"
              value="strength"
              checked={selectedMove === 'strength'}
              onChange={handleMoveChange}
            />
            <label htmlFor="strength">Use Strength: {(userStats.str + 2) * 2}</label>
            <br />
            <input
              type="radio"
              id="magic"
              name="move"
              value="magic"
              checked={selectedMove === 'magic'}
              onChange={handleMoveChange}
            />
            <label htmlFor="magic">Use Magic: {(userStats.mag + 2) * 2}</label>
            <br />
            <input
              type="radio"
              id="ranged"
              name="move"
              value="ranged"
              checked={selectedMove === 'ranged'}
              onChange={handleMoveChange}
            />
            <label htmlFor="ranged">Use Ranged: {(userStats.rng + 2) * 2}</label>
          </div>
            </>
          )}
        </div>
        <div className="md:w-1/3 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Turn Timer</h2>
          {countdown && !battleEnd && <h3>{countdown}</h3>}
          {userAction && (
            <div>
              <p>You used {userAction.move} dealing {userAction.damage} dmg!</p>
            </div>
          )}
          {monsterAction && (
            <div>
              <p>{monsterStats.name} attacked for {monsterAction.damage} dmg!</p>
            </div>
          )}
        </div>
        <div className="md:w-1/3 flex flex-col items-center">
          
          {monsterStats && (
            <>
            <h2 className="text-xl font-semibold mb-4">{monsterStats.name}</h2>
            <Image src={monsterStats.image} alt={monsterStats?.name} width={250} height={250} />
            <p>Health: {monsterStats.hp}/{monsterStats.base_hp}</p>
            <progress className="progress progress-error w-46" value={monsterStats.hp} max={monsterStats.base_hp}></progress>
            <p>Pondering next move...</p>
            </>
          )}
        </div>
      </div>
      {battleOutcome && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">{battleOutcome === 'user' ? 'You won!' : 'You lost!'}</h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
  
};

export default BattleScreen;
