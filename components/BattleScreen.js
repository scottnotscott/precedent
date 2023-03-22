import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Image from "next/image";
import { Countdown, Alert } from 'react-daisyui';
import useMonsters from './../useMonsters';



const BattleScreen = ({ monsterId, baseHP, session, onBattleEnd }) => {
  const [battleOutcome, setBattleOutcome] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [monsterStats, setMonsterStats] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [selectedMove, setSelectedMove] = useState('str');
  const [isUpdatingHealth, setIsUpdatingHealth] = useState(false);
  const [userAction, setUserAction] = useState(null);
  const [monsterAction, setMonsterAction] = useState(null);
  const [rewardedItem, setRewardedItem] = useState(null);
  const router = useRouter();
  let battleEnd = false;

  const countdownRef = useRef(countdown);

  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);

  const { data: userData, mutate } = useSWR(`/api/stats?userId=${session.user.id}`);
  useEffect(() => {
    if (userData) {
      setUserStats(userData);
    }
  }, [userData]);

  const { data: monsterData } = useMonsters(monsterId);
  useEffect(() => {
    if (monsterData) {
      console.log(monsterData)
      setMonsterStats({ ...monsterData, hp: monsterData.base_hp });
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

  useEffect(() => {
    if(battleOutcome) {
      onBattleEnd();
      mutate();
    }
  }, [battleOutcome])

  const runBattle = async () => {
    const response = await axios.post('/api/battle', {
      userStats,
      monsterStats,
      selectedMove,
    });

    const { outcome, updatedUserStats, updatedMonsterStats, userDamage, monsterDamage, item } = response.data;
    setUserStats(updatedUserStats);
    setMonsterStats(updatedMonsterStats);

    setUserAction({ move: selectedMove, damage: userDamage });
    setMonsterAction({ move: "base_str", damage: monsterDamage });

    if (outcome) {
      setBattleOutcome(outcome);
      if(outcome === "user") {
        setRewardedItem(item);
      }
      battleEnd = true;
    } else {
      setIsUpdatingHealth(false);
      setCountdown(5);
    }
  };
  const handleMoveChange = (e) => {
    setSelectedMove(e.target.value);
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center mr-72 ml-24">
      <h1 className="text-2xl font-bold mb-6">BattleScreen - This is in alpha! Can you cheat the system?</h1>
      <div className="w-full flex flex-col md:flex-row justify-between">
        <div className="md:w-1/3 flex flex-col items-center">

          {userStats && (
            <>
              <h2 className="text-xl font-semibold mb-4">{session?.user?.name}</h2>
              <Image src={session?.user?.image} alt={session?.user?.name} width={150} height={150} />
              <p>Health: {userStats.hp}/{baseHP}</p>
              <progress className="progress progress-error w-46" value={userStats.hp} max={baseHP}></progress>
              <div>
                <p className="pt-3">Attack Options</p>
                <input
                  type="radio"
                  id="str"
                  name="move"
                  value="str"
                  checked={selectedMove === 'str'}
                  onChange={handleMoveChange}
                />
                <label htmlFor="str">Use Strength: {(userStats.str * 3) * 2}</label>
                <br />
                <input
                  type="radio"
                  id="mag"
                  name="move"
                  value="mag"
                  checked={selectedMove === 'mag'}
                  onChange={handleMoveChange}
                />
                <label htmlFor="mag">Use Magic: {(userStats.mag * 3) * 2}</label>
                <br />
                <input
                  type="radio"
                  id="rng"
                  name="move"
                  value="rng"
                  checked={selectedMove === 'rng'}
                  onChange={handleMoveChange}
                />
                <label htmlFor="rng">Use Ranged: {(userStats.rng * 3) * 2}</label>
              </div>
            </>
          )}
        </div>
        <div className="md:w-1/3 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Turn Timer</h2>
          {countdown && !battleEnd && (
            <>
              <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <Countdown className="font-mono text-2xl" value={countdown} />
              </div>
            </>
          )}
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
              <Image src={monsterStats.image} alt={monsterStats?.name} width={150} height={150} />
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
          {battleOutcome === "user" && rewardedItem && (
            <Alert status={'success'}>You have received {rewardedItem.name} x1 as a reward.</Alert>
          )}
          <p>Returning to dashboard...</p>
        </div>
      )}
    </div>
  );

};

export default BattleScreen;
