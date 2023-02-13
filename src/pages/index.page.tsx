import type { CustomNextPage } from "next";
import { useEffect, useState } from "react";
import { SubmitButton } from "src/components/SubmitButton";
import { Layout } from "src/layout";
import type { Session } from "src/types";

export const IndexPage: CustomNextPage = () => {
  const [selection, setSelection] = useState<string | undefined>(undefined);
  const [session, setSession] = useState<Session>();
  const [urlHost, setUrlHost] = useState("");
  const [urlPath, setUrlPath] = useState("");
  const [innerHTML, setInnerHTML] = useState<any>();

  const getSelectionData = async () => {
    const selectedText = await chrome.storage.session.get(["selectedText"]);
    const urlHost = await chrome.storage.session.get(["urlHost"]);
    const urlPath = await chrome.storage.session.get(["urlPath"]);
    const innerHTML = await chrome.storage.session.get(["innerHTML"]);
    setSelection(selectedText.selectedText);
    setUrlHost(urlHost.urlHost);
    setUrlPath(urlPath.urlPath);
    setInnerHTML(innerHTML);
  };
  const getSession = () => {
    chrome.runtime.sendMessage({ action: "AUTH_CHECK" }, (session) => {
      if (session) {
        setSession(session);
      }
    });
  };

  useEffect(() => {
    getSelectionData();
    getSession();
  }, []);

  return (
    <div className="flex-col gap-4 justify-between py-4">
      <div className="w-full bg-gray-700 rounded-lg">
        <h1 className="p-2 text-xs text-white whitespace-nowrap text-bold">
          {selection ? "You have selected: " : "Select an assertion"}
        </h1>
        <p className="p-2 text-xs text-white">{selection ? selection : null}</p>
      </div>
      <div className="flex-col self-center p-2 w-full text-white text-s">
        <h1 className="flex justify-center p-2 align-center">
          {session ? null : "Please Log in to submit assertion."}
        </h1>
        <div className="flex justify-center max-w-1/2 align-center">
          <SubmitButton
            selection={selection}
            session={session}
            urlHost={urlHost}
            urlPath={urlPath}
            innerHTML={innerHTML}
          />
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
IndexPage.getLayout = Layout;
