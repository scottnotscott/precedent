import useSWR from 'swr';

export default function useGameVersion () {
    const fetcher = (...args) => fetch(...args).then(res => res.json())
    const { data, error } = useSWR(`/api/gameversion`, fetcher);

  return {
        data,
        isLoading: !data && !error,
        error,
    }
}