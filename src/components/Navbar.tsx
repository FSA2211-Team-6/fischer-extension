// import Link from "next/link";
import { LoginButton } from "src/components/LoginButton";

export const Navbar = () => {
  return (
    <div className="w-80">
      <div className="w-full text-xl text-center text-white">Fischer</div>
      <div className="p-2 hover:underline border-b-2 underline-offset-4">
        <LoginButton />
      </div>
      {/* <div className="flex justify-between rounded-sm border-b-2">
        <div className="py-2 px-8 text-xl text-white hover:underline border-r-2 underline-offset-8">
          <Link href="/airesponse">OpenAI</Link>
        </div>
        <div className="py-2 px-8 text-xl text-white hover:underline underline-offset-8">
          <Link href="/comment">Comments</Link>
        </div>
      </div> */}
    </div>
  );
};
