import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BattleScreen = ({ userId, monsterId }) => {
  const [battleOutcome, setBattleOutcome] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [monsterStats, setMonsterStats] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [selectedMove, setSelectedMove] = useState('strength');
  const [isUpdatingHealth, setIsUpdatingHealth] = useState(false);
  let battleEnd = false;

  const countdownRef = useRef(countdown);

  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);

  const { data: userData } = useSWR(`/api/stats?userId=${userId}`);
  useEffect(() => {
    if (userData) {
      const savedBattleState = localStorage.getItem("battleState");
      if (savedBattleState) {
        const { userStats: savedUserStats } = JSON.parse(savedBattleState);
        setUserStats(savedUserStats);
      } else {
        setUserStats(userData);
      }
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
  
    const { outcome, updatedUserStats, updatedMonsterStats } = response.data;
    setUserStats(updatedUserStats);
    setMonsterStats(updatedMonsterStats);
  
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
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Battle Screen</h1>
      <div className="w-full flex flex-col md:flex-row justify-between">
        <div className="md:w-1/3 flex flex-col items-center">
          
          {userStats && (
            <>
            <h2 className="text-xl font-semibold mb-4">User</h2>
            <ul className="mb-4">
              <li>Health: {userStats.hp}</li>
              <li>Selected Move: {selectedMove}</li>
            </ul>
            <div>
            <input
              type="radio"
              id="strength"
              name="move"
              value="strength"
              checked={selectedMove === 'strength'}
              onChange={handleMoveChange}
            />
            <label htmlFor="strength">Strength</label>
            <br />
            <input
              type="radio"
              id="magic"
              name="move"
              value="magic"
              checked={selectedMove === 'magic'}
              onChange={handleMoveChange}
            />
            <label htmlFor="magic">Magic</label>
            <br />
            <input
              type="radio"
              id="ranged"
              name="move"
              value="ranged"
              checked={selectedMove === 'ranged'}
              onChange={handleMoveChange}
            />
            <label htmlFor="ranged">Ranged</label>
          </div>
            </>
          )}
        </div>
        <div className="md:w-1/3 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Turn Timer</h2>
          {countdown && !battleEnd && <h3>{countdown}</h3>}
        </div>
        <div className="md:w-1/3 flex flex-col items-center">
          
          {monsterStats && (
            <>
            <h2 className="text-xl font-semibold mb-4">Monster</h2>
            <ul>
              <li>Health: {monsterStats.hp}</li>
              <li>Preparing Move</li>
            </ul>
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
