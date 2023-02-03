import type { CustomNextPage } from "next";
import { Layout } from "src/layout";

export const ExpertPage: CustomNextPage = () => {
  return (
    <div className="flex gap-4 justify-between py-4">
      <div className="w-1/2 bg-gray-700 rounded-lg">
        <h1 className="px-2 text-xs text-white whitespace-nowrap text-bold">Assertion: </h1>
        <p className="px-2 text-xs text-white">
          In biology, a phylum (/ˈfaɪləm/; plural: phyla) is a level of classification or taxonomic
          rank below kingdom and above class.
        </p>
      </div>
    </div>
  );
};

export default ExpertPage;
ExpertPage.getLayout = Layout;
