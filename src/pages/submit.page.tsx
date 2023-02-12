import type { CustomNextPage } from "next";
import { useEffect, useState } from "react";
import { Layout } from "src/layout";
import type { Session } from "src/types";

export const SubmitPage: CustomNextPage = () => {
  const [selection, setSelection] = useState<string | undefined>(undefined);
  const [session, setSession] = useState<Session>();
  const [urlHost, setUrlHost] = useState("");
  const [urlPath, setUrlPath] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const userId = session?.user.fischerId;

  const postAssertion = async (
    assertion: any,
    urlHost: string,
    urlArticle: string,
    userId: number | undefined,
  ) => {
    try {
      const aiResponse = await fetch("http://localhost:3000/api/factcheck", {
        method: "POST",
        body: assertion,
      });
      const data = await aiResponse.json();
      const aiData: any = {
        post: {
          assertion: assertion,
          aiResponse: data.choices[0].text,
          userId: userId,
          topic: data.choices[1].text,
        },
        website: {
          host: urlHost,
          article: urlArticle,
        },
      };
      const aiDataJSON = JSON.stringify(aiData);

      console.log("AI DATA:", aiData);

      console.log("AI DATA JSON", aiDataJSON);

      const dbUpdate = await fetch("http://localhost:3000/api/post", {
        method: "POST",
        body: aiDataJSON,
      });
      console.log(dbUpdate);
    } catch (err) {
      console.error(err);
    }
  };
  const getSelectionData = async () => {
    const selectedText = await chrome.storage.session.get(["selectedText"]);
    const urlHost = await chrome.storage.session.get(["urlHost"]);
    const urlPath = await chrome.storage.session.get(["urlPath"]);
    setSelection(selectedText.selectedText);
    setUrlHost(urlHost.urlHost);
    setUrlPath(urlPath.urlPath);
  };
  const getSession = () => {
    chrome.runtime.sendMessage({ action: "AUTH_CHECK" }, (session) => {
      if (session) {
        setSession(session);
      }
    });
  };
  const handleSubmit = () => {
    postAssertion(selection, urlHost, urlPath, userId);
  };

  useEffect(() => {
    getSelectionData();
    getSession();
    const disableButton = () => {
      if (session && selection) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    };
    disableButton();
  }, [selection, session]);

  return (
    <div className="flex gap-4 justify-between py-4">
      <div className="w-1/2 bg-gray-700 rounded-lg">
        <h1 className="p-2 text-xs text-white whitespace-nowrap text-bold">
          {selection ? "You have selected: " : "Select an assertion"}
        </h1>
        <p className="p-2 text-xs text-white">{selection ? selection : null}</p>
      </div>
      <div className="p-2 text-white text-s">
        <h1>{session ? null : "Please Log in to submit assertion."}</h1>
        <button
          className="block p-2 mx-auto rounded border"
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          Submit Assertion?
        </button>
      </div>
    </div>
  );
};

export default SubmitPage;
SubmitPage.getLayout = Layout;
