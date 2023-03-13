import useSWR from 'swr'

export default function Footer() {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error, isLoading } = useSWR('/api/gameversion', fetcher)
    return (
        <footer className="fixed bottom-0 flex flex-row bg-gray-900 w-screen left-16 text-purple-800 pl-4 space-x-4">
        <p>
          Developed by @ 
          <a
            className=""
            href="https://twitter.com/smtmssctsmtmsnt"
            target="_blank"
            rel="noopener noreferrer"
          >
             smtmssctsmtmsnt
          </a>
        </p>
        {error && <p>{error.message}</p>}
        {isLoading && <p>Loading gameversion...</p>}
        {data && <p>game version: {data[0].version}</p>}
        </footer>
    )
}