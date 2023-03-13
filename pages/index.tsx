
import Layout from "@/components/layout";
import Image from "next/image";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react"
import { ArrowDownLeft } from "lucide-react"

export default function Home() {
  const {data: session, status} = useSession();
  const router = useRouter();

  if (session && status == "authenticated") {
    //router.replace('../dashboard');
  }
  
  return (
    <Layout>
      
      <div className="flex flex-row items-center w-screen text-pink-300 pl-20">
        <h1 className="text-6xl">Welcome to Feudal!</h1>
      </div>
      <div className="mt-8"></div>
      <div className="text-white">
       <h1 className="pl-20">Wow. Feudal... Where to begin?</h1>
       </div>
       
    </Layout>
  );
  
}
