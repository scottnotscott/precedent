import useGameVersion from '../useGameVersion'

export default function Footer() {
  const { data, error, isLoading } = useGameVersion()
  return (
    <footer className="fixed bottom-0 md:h-fit flex flex-row bg-gray-900 w-screen justify-center text-pink-300 pl-2 items-center space-x-2 text-sm">
      <p>
        Developed by @
        <a
          className=""
          href="https://github.com/scottnotscott"
          target="_blank"
          rel="noopener noreferrer"
        >
          scottnotscott 
        </a>
      </p>
      {error && <p>{error.message}</p>}
      {isLoading && <p>Loading gameversion...</p>}
      {data && (
        <>
          <p>Version: {data[0].version} - any issues please email: bugs@feudal.world</p>
        </>
      )}
    </footer>
  )
}