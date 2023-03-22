import useGameVersion from '../useGameVersion'

export default function Footer() {
  const { data, error, isLoading } = useGameVersion()
  return (
    <footer className="fixed bottom-0 flex flex-row bg-gray-900 w-screen justify-center text-pink-300 pl-4 space-x-4 text-sm">
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
      {data && (
        <>
          <p>game version: {data[0].version}</p><p>Changelog: {data[0].changelog['0.03'][0]}, {data[0].changelog['0.03'][1]} any issues please email: bugs@feudal.world</p>
        </>
      )}
    </footer>
  )
}