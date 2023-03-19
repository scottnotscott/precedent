import useSWR from 'swr'
import { useSession } from "next-auth/react";
export default function ActivityHeartbeat() {
    // const { data: session, status } = useSession();
    // const fetcher = (...args) => fetch(...args).then(res => res.json())
    // const { data, error, isLoading, isValidating } = useSWR(`/api/activityheartbeat?userId=${session.user.id}`, fetcher, { refreshInterval: 1000})
    // if(data) {
    //     return (
    //         <p>{data.activity}</p>
    //     )
    // }
    // if(isLoading) {
    //     return (
    //         <p>Loading...</p>
    //     )
    // }
    // if(error) {
    //     <p>{error.message}</p>
    //     console.log('error caught in activityheartbeat-component: ', error)
    // }
    // if(isValidating) {
    //     console.log('isValidating: ', isValidating)
    // }
}