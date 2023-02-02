import type { CustomNextPage } from "next";
import { Layout } from "src/layout";

export const ExpertPage: CustomNextPage = () => {
  return (
    <div>
      <h1>This is the experts page</h1>
    </div>
  );
};

export default ExpertPage;
ExpertPage.getLayout = Layout;
