
import Layout from "@/components/layout";
import Image from "next/image";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react"

export default function Home() {
  const {data: session, status} = useSession();
  const router = useRouter();

  if (session && status == "authenticated") {
    //router.replace('../dashboard');
  }
  
  return (
    <Layout>
       <p>Unauthenticated game dashboard, woo!</p>
    </Layout>
  );
  
}
