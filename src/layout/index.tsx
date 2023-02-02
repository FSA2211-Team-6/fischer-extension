import type { NextPage } from "next";
import { Navbar } from "src/components/Navbar";

import { LayoutErrorBoundary } from "./LayoutErrorBoundary";

export const Layout = (page: NextPage) => {
  return (
    <main className="py-2 px-8">
      <Navbar />
      <LayoutErrorBoundary>{page}</LayoutErrorBoundary>

      {/* Loading Chrome scripts */}
      <script defer src="../content.js"></script>
      <script defer src="../background.js"></script>
    </main>
  );
};
