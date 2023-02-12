import Link from "next/link";
import { LoginButton } from "src/components/LoginButton";

export const Navbar = () => {
  return (
    <>
      <div className="w-full text-center text-white text-l">Fischer</div>
      <LoginButton />
      <div className="flex justify-between rounded-sm border-b-2">
        <div className="py-2 px-8 text-xl text-white hover:underline border-r-2 underline-offset-8">
          <Link href="/airesponse">OpenAI</Link>
        </div>
        <div className="py-2 px-8 text-xl text-white hover:underline underline-offset-8">
          <Link href="/comment">Comments</Link>
        </div>
      </div>
    </>
  );
};
