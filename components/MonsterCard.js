import { useSession } from "next-auth/react";
import useSWR from 'swr'
import { Card, Button, Tooltip, Progress } from 'react-daisyui';
import { Sword } from "lucide-react"
import { useState } from "react";


export default function MonsterCard({id}) {
    const [isShown, setIsShown] = useState(false);
    function trigger(e) {
      setIsShown("open")
  }
    const fetcher = (...args) => fetch(...args).then(res => res.json())
    const { data, error, isLoading, isValidating } = useSWR(`/api/monsters?id=${id}`, fetcher)
    
    if(data) {
        console.log(data)
        let message = `Earn around ${data.xp_reward}xp and ${data.currency_reward}gp per kill. Loot table: ${data.item_loot_table}`
        return (
            <>
            <Card bordered="true" className="w-96 bg-base-100 shadow-xl ">
                <Card.Image
                className="animate-pulse"
                  src={data.image}
                  alt="explore to find beasts to slay."
                />
                <Card.Body className="items-center text-center ">
                  <Card.Title tag="h2"> {data.name} </Card.Title>
                  <div className="badge badge-success">Level: {data.level}</div>
                  <div className="badge badge-accent badge-outline">{data.base_hp}/{data.base_hp}HP</div>
                  <Tooltip message={message} position="right" onMouseEnter={trigger} >  
                  <div className="badge badge-accent badge-outline">Rewards XP (HP, combat stat) + items</div>
                  </Tooltip>
                  <div className="badge badge-error animate-slide-down-fade">☠️Risk of death☠️</div>
                  <Card.Actions className="justify-end">
                    <Button color="danger">Engage <Sword color="red" size={24} className="animate-bounce pl-2" /></Button>
                  </Card.Actions>
                </Card.Body>
              </Card>
              </>
        )
    }
    if(isLoading) {
        return (
            <p>loading...</p>
        )
    }

    if(error) {
        console.log('error caught in activityheartbeat-component: ', error)
    }
    if(isValidating) {
        console.log('isValidating: ', isValidating)
    }
    
}