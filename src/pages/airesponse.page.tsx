import type { CustomNextPage } from "next";
import { Selection } from "src/components/Selection";
import { Layout } from "src/layout";

const AIResponse: CustomNextPage = () => {
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

export default AIResponse;

AIResponse.getLayout = Layout;
