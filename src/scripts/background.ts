console.log("background script");

const getActiveTabURL = async () => {
  const tabs: Array<any> = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });
  const tabUrl = new URL(tabs[0].url);
  return tabUrl;
};

const getSelectedText = async (info: chrome.contextMenus.OnClickData) => {
  const selectedText: any = info.selectionText;

  const url = await getActiveTabURL();
  const urlHost = url.origin;
  const urlPath = url.href;

  await chrome.storage.session.set({ selectedText: selectedText });

  postAssertion(selectedText, urlHost, urlPath);
  return selectedText;
};

//QUERIES ChatGPT API AND ADDS NEW POST TO DATABASE
const postAssertion = async (assertion: string, urlHost: string, urlArticle: string) => {
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
        userId: 1,
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

const getSession = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/session", {
      method: "GET",
      mode: "cors",
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};
//WHEN CONTEXT MENU ITEM IS CLICKED
chrome.contextMenus.onClicked.addListener((evt) => {
  getSelectedText(evt);
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: <string>"Fact Check with Fischer",
    id: <string>"FischerContextMenu",
    contexts: ["selection"],
  });
});

chrome.runtime.onMessage.addListener((request, sender, onSuccess) => {
  console.log("running check");
  getSession().then((data) => {
    if (Object.keys(data).length > 0) {
      onSuccess(data);
    } else {
      onSuccess(null);
    }
  });

  return true; // Will respond asynchronously
});

export {};
