import { create } from 'zustand'
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Layout from "./layout";

export default function Dashboard({userId}) {
  const { data: session, status } = useSession();
  
    return (
      
<main className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gray-100 p-4"><button class="bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-md px-4 py-2 hover:bg-opacity-75">
  <span className="mr-2"><i class="fas fa-sword"></i></span>
  Attack
</button>
</div>
        <div className="bg-gray-100 p-4"><p>get user stats call originally</p></div>
        <div className="bg-gray-100 p-4">Content 3</div>
      </main>
      
      );
}