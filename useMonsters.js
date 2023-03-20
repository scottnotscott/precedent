import useSWR from 'swr';

export default function useMonsters (id) {
    const fetcher = (...args) => fetch(...args).then(res => res.json())
    const { data: monstersData, error, isLoading } = useSWR(`/api/monsters`, fetcher);
    const monsterData = monstersData && monstersData.find(monster => monster.id === id);
    return {
        monsterData,
        isLoading,
        error
    }
}