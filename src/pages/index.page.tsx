import type { CustomNextPage } from "next";
import { Selection } from "src/components/Selection";
//import dynamic from "next/dynamic";
// import Link from "next/link";
import { Layout } from "src/layout";
// chrome APIを使用するためdynamic importし、browser側でのみ読み込まれるようにする
// const Button = dynamic(
//   async () => {
//     const module = await import("src/components/Button");
//     return module.Button;
//   },
//   {
//     ssr: false,
//     loading: () => {
//       return <div className="w-10 h-4 bg-gray-100 rounded border animate-pulse"></div>;
//     },
//   },
// );

// const Selection = dynamic(
//   async () => {
//     const module = await import("src/components/Selection");
//     return module.Selection;
//   },
//   {
//     ssr: false,
//     loading: () => {
//       return <div className="w-10 h-4 bg-gray-100 rounded border animate-pulse"></div>;
//     },
//   },
// );

const IndexPage: CustomNextPage = () => {
  return (
    <div className="flex gap-4 justify-between py-4">
      <div className="w-1/2 bg-gray-700 rounded-lg shadow-lg">
        <h1 className="px-2 text-xs text-white whitespace-nowrap text-bold">Assertion: </h1>
        <Selection />
      </div>
      <div className="w-1/2 bg-gray-700 rounded-lg">
        <h1 className="px-2 text-xs text-white whitespace-nowrap text-bold">AI Response: </h1>
        <p className="px-2 text-xs text-white">
          False, Objective, Phylum is a level of classification or taxonomic rank below class and
          above order.
        </p>
      </div>
    </div>
  );
};

export default IndexPage;

IndexPage.getLayout = Layout;
