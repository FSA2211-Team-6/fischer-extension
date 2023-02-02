import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="flex justify-between">
      <div className="py-8 px-8 text-white hover:underline underline-offset-8">
        <Link href="/index">AI Response</Link>
      </div>
      <div className="py-8 px-8 text-white hover:underline underline-offset-8">
        <Link href="/expert">Expert</Link>
      </div>
      <div className="py-8 px-8 text-white hover:underline underline-offset-8">
        <Link href="/sample">Comments</Link>
      </div>
    </div>
  );
};
