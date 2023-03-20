
import Layout from "@/components/layout";


export default function Home() {
  
  return (
    <Layout>
      
      <div className="flex flex-row items-center w-screen text-pink-300 pl-20">
        <h1 className="text-6xl">Welcome to Feudal!</h1>
      </div>
      <div className="mt-8"></div>
      <div className="text-white pl-24">
      <a href="http://localhost:3000/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F">Developer login only. If you are on prod use bottom left sign in link ;)</a>
       </div>
    </Layout>
  );
  
}
