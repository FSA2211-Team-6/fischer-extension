// eslint-disable-next-line no-console
console.log("background script");

const getSelectedText = async (info: chrome.contextMenus.OnClickData) => {
  const selectedText: any = info.selectionText;
  await chrome.storage.session.set({ selectedText: selectedText });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: Array<any>) => {
    chrome.tabs.sendMessage(tabs[0].id, { id: "selectedText", text: selectedText });
  });
  postAssertion(selectedText);
  return selectedText;
};

//QUERIES ChatGPT API AND ADDS NEW POST TO DATABASE
const postAssertion = async (assertion: string) => {
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
      host: "http://en.wikipedia.org",
      article: "https://en.wikipedia.org/wiki/Kingdom_(biology)",
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

  //eslint-disable-next-line no-console
  console.log();
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: <string>"Fact Check with Fischer",
    id: <string>"FischerContextMenu",
    contexts: ["selection"],
  });
});

export {};
