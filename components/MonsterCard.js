import { useSession } from "next-auth/react";
import useSWR from 'swr';
import { Card, Button, Tooltip, Progress } from 'react-daisyui';
import { Sword } from "lucide-react";
import { useState } from "react";

export default function MonsterCard({ id, onEngageClick }) {
  const [isShown, setIsShown] = useState(false);

  function trigger(e) {
    setIsShown("open");
  }

  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const { data: monstersData, error, isLoading, isValidating } = useSWR('/api/monsters', fetcher);
  const monsterData = monstersData && monstersData.find(monster => monster.id === id);

  if (monsterData) {
    let message = `Earn around ${monsterData.xp_reward}xp and ${monsterData.currency_reward}gp per kill. Loot table: ${monsterData.item_loot_table}`;
    return (
      <>
        <Card bordered="true" className="w-96 bg-base-100 shadow-xl ">
        <Tooltip message={monsterData.description} position="top" onMouseEnter={trigger}>
          <Card.Image
            className="animate-pulse"
            src={monsterData.image}
            alt={monsterData.description}
          />
          </Tooltip>
          <Card.Body className="items-center text-center ">
            <Card.Title tag="h2"> {monsterData.name} </Card.Title>
            <div className="badge badge-success">Level: {monsterData.level}</div>
            <div className="badge badge-accent badge-outline">{monsterData.base_hp}/{monsterData.base_hp}HP</div>
            <Tooltip message={message} position="right" onMouseEnter={trigger}>
              <div className="badge badge-accent badge-outline">Rewards XP (HP, combat stat) + items</div>
            </Tooltip>
            <div className="badge badge-error animate-slide-down-fade">☠️Risk of death☠️</div>
            <Card.Actions className="justify-end">
              <Button color="danger" onClick={() => onEngageClick(id)}>Engage <Sword color="red" size={24} className="animate-bounce pl-2" /></Button>
            </Card.Actions>
          </Card.Body>
        </Card>
      </>
    );
  }

  if (isLoading) {
    return (
      <p>loading...</p>
    );
  }

  if (error) {
    console.log('error caught in monster-component: ', error);
  }

  if (isValidating) {
    console.log('isValidating: ', isValidating);
  }
}
