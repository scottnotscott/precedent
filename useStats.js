import useSWR from 'swr';

export default function useUsers (id) {
    const fetcher = (...args) => fetch(...args).then(res => res.json())
    const { data, error } = useSWR(id ? `/api/stats?userId=${id}` : null, fetcher);

  return {
        data,
        isLoading: !data && !error,
        error,
    }
}