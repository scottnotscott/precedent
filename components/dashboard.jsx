import { create } from 'zustand'
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Dashboard({userId}) {
  const { data: session, status } = useSession();
  const useStore = create((set, get) => ({
    userStats: {},
    fetch: async (userId) => {
      const response = await fetch(`/api/stats?userId=${userId}`);
      console.log(response)
      set({ userStats: await response.json() });
      console.log(state.userStats)
    }
  }))
  



function GetUserStats(userId) {
  if (userId) {
    const { userStats, getUserStats } = useStore();
    fetch(userId);

    return (
      <span>{userStats[0]}</span>
    )
  }
}
 


    return (
      
<main className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gray-100 p-4"><button class="bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-md px-4 py-2 hover:bg-opacity-75">
  <span className="mr-2"><i class="fas fa-sword"></i></span>
  Attack
</button>
</div>
        <div className="bg-gray-100 p-4"><GetUserStats userId={session.user.id} /></div>
        <div className="bg-gray-100 p-4">Content 3</div>
      </main>
      );
}