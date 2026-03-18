import LoginForm from "@/components/auth/LoginForm";
import Navbar from "@/components/layout/navbar/Navbar";

export default function SignIn() {
  return (
    <div>
      <Navbar className="fixed top-0 w-full z-1000 bg-chinese-black" isLoggedIn={false}/>
      <div className="flex mt-40 mx-auto max-w-110">
        <LoginForm/>
      </div>
    </div>
  )
}
