import { useSession } from "next-auth/react";
import useSWR from 'swr'
import { Avatar } from 'react-daisyui';
import { Tooltip } from 'react-daisyui';

export default function Dashboard({ userId }) {
  const { data: session, status } = useSession();
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error, isLoading } = useSWR(`/api/stats?userId=${userId}`, fetcher)
  if (data) console.log('data: ', data)
  return (
    <>

      <div className="flex flex-col items-center bg-gray-900 text-pink-300 rounded-md">
        <div className="flex flex-row items-center bg-gray-800 text-white-900 mb-2">
          <h3 className="text-white">Character Information</h3>
        </div>
        {error && <p>{error.message}</p>}
        {isLoading && <p>Loading gameversion...</p>}
        {data &&
          <>
          <div className="flex flex-row items-center">
            <Avatar  size="lg" src={session.user.image} online={data.online_status} />
          </div>
            <p>Name: {session.user.name}</p>
            <p>XP: {data.exp}</p>
            <p>Level: {data.level}</p>
            <p>Rank: {data.rank}</p>
            <p>Village: {data.village}</p>
            <p>Health: {data.health}</p>
            <div className="mt-2"></div>
            <div className="flex flex-row items-center text-white mb-2">
              <p>Melee Stats</p>
            </div>
            <p>str: {data.str}</p>
            <p>def: {data.def}</p>
            <div className="mt-2"></div>
            <div className="flex flex-row items-center text-white mb-2">
              <p>Magic Stats</p>
            </div>
            <p>mag: {data.mag}</p>
            <p>res: {data.res}</p>
            <div className="mt-2"></div>
            <div className="flex flex-row items-center text-white mb-2">
              <p>Ranged Stats</p>
            </div>
            <p>rng: {data.rng}</p>
            <p>eva: {data.eva}</p>
          </>
        }
      </div>
    </>
  );
}