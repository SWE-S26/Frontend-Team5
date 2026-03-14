// this file is created to add navbar to all pages inside /(main) folder to avoid adding navbar manually to each page
import Navbar from "@/components/layout/navbar/Navbar";
import PlayerBar from "@/components/layout/player/PlayerBar";
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar className="fixed top-0 w-full z-1000 bg-chinese-black" isLoggedIn={true}/>
      <main className="mt-18 flex justify-center">
        <div className="w-full max-w-6xl">
          {children}
        </div>
      </main>
      <PlayerBar/>
    </div>
  )
}