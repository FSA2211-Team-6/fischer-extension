// eslint-disable-next-line no-console
console.log("background script");

window.onload = () => {
  getExistingAssertions();
};

const getActiveTabURL = async () => {
  const tabs: Array<any> = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });
  const tabUrl = new URL(tabs[0].url);
  return tabUrl;
};

const getExistingAssertions = async () => {
  const url = await getActiveTabURL();
  const urlObj: any = { url: url.href };
  const assertions: any = await fetch("http://localhost:3000/api/postURL", {
    method: "POST",
    body: urlObj,
  });
  //eslint-disable-next-line no-console
  console.log(assertions);
};

const getSelectedText = async (info: chrome.contextMenus.OnClickData) => {
  const selectedText: any = info.selectionText;

  const url = await getActiveTabURL();
  const urlHost = url.host;
  const urlPath = url.href;

  await chrome.storage.session.set({ selectedText: selectedText });

  postAssertion(selectedText, urlHost, urlPath);
  return selectedText;
};

//QUERIES ChatGPT API AND ADDS NEW POST TO DATABASE
const postAssertion = async (assertion: string, urlHost: string, urlArticle: string) => {
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
  // eslint-disable-next-line no-console
  console.log("AI DATA:", aiData);
  // eslint-disable-next-line no-console
  console.log("AI DATA JSON", aiDataJSON);

  const dbUpdate = await fetch("http://localhost:3000/api/post", {
    method: "POST",
    body: aiDataJSON,
  });
  //eslint-disable-next-line no-console
  console.log(dbUpdate);
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

export {};
