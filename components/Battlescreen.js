import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState, useEffect, useRef } from 'react';

const BattleScreen = ({ userId, monsterId }) => {
  const [battleOutcome, setBattleOutcome] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [monsterStats, setMonsterStats] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [selectedMove, setSelectedMove] = useState('strength');
  const countdownRef = useRef(countdown);
  countdownRef.current = countdown;
  let battleEnd = false;

  const { data: userData } = useSWR(`/api/stats?userId=${userId}`);
  useEffect(() => {
    if (userData) {
      setUserStats(userData);
    }
  }, [userData]);

  const { data: monsterData } = useSWR(`/api/monsters?id=${monsterId}`);
  useEffect(() => {
    if (monsterData) {
      setMonsterStats(monsterData);
    }
  }, [monsterData]);

  useEffect(() => {
    if (userStats && monsterStats && !battleEnd) {
      const countdownInterval = setInterval(() => {
        if (countdownRef.current > 0) {
          setCountdown(countdownRef.current - 1);
        } else {
          runBattle();
          setCountdown(5);
        }
      }, 1000);

      return () => {
        clearInterval(countdownInterval);
      };
    }
  }, [userStats, monsterStats]);

  const runBattle = () => {
    if (userStats && monsterStats) {
      const calculateDamage = (attacker, defender) => {
        let damage = 0;
        if (attacker.str) {
          if (selectedMove === 'strength') {
            damage = ((attacker.str + 40) * 2);
          } else if (selectedMove === 'magic') {
            damage = ((attacker.mag + 2) * 2);
          } else {
            damage = ((attacker.rng + 2) * 2);
          }
          return damage;
        }
        if (!attacker.str) {
          return ((attacker.base_str + 2) * 2);
        }
      };

      const takeTurn = (attacker, defender) => {
        const damage = calculateDamage(attacker, defender);
        if (defender.base_hp) defender.base_hp -= damage;
        if (defender.hp) defender.hp -= damage;
      };

      const updatedUserStats = { ...userStats };
      const updatedMonsterStats = { ...monsterStats };

      // User's turn
      takeTurn(updatedUserStats, updatedMonsterStats);

      if (updatedMonsterStats.base_hp <= 0) {
        const winner = 'user';
        setBattleOutcome(winner);
        battleEnd = true;
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        return;
      }

      // Monster's turn
      takeTurn(updatedMonsterStats, updatedUserStats);

      if (updatedUserStats.hp <= 0) {
        const winner = 'monster';
        setBattleOutcome(winner);
        battleEnd = true;
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        return;
      }


      // Update the user and monster stats
      console.log(updatedUserStats)
      console.log(updatedMonsterStats)
      setUserStats(updatedUserStats);
      setMonsterStats(updatedMonsterStats);
    
    }
  };

  const handleMoveChange = (e) => {
    setSelectedMove(e.target.value);
  };

  return (
    <div>
      <h1>Battle Screen</h1>
      {countdown && !battleEnd && <h2>Countdown: {countdown}</h2>}
      <div>
        <h2>User</h2>
        {userStats && (
          <ul>
            <li>Health: {userStats.hp}</li>
            <li>Selected Move: {selectedMove}</li>
          </ul>
        )}
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
      </div>
      <div>
        <h2>Monster</h2>
        {monsterStats && (
          <ul>
            <li>Health: {monsterStats.base_hp}</li>
            {monsterStats.toString()}
            <li>Preparing Move</li>
          </ul>
        )}
      </div>
      {battleOutcome && (
        <div>
          <h2>{battleOutcome === 'user' ? 'You won!' : 'You lost!'}</h2>
          <button onClick={() => window.location.reload()}>Return to Dashboard</button>
        </div>
      )}
    </div>
  );
};

export default BattleScreen;