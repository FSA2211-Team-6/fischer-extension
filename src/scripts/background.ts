console.log("background script");

let innerHTML: any = "";

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

  await chrome.storage.session.set({
    selectedText: selectedText,
    urlHost: urlHost,
    urlPath: urlPath,
    innerHTML: innerHTML,
  });
  return selectedText;
};

const getSession = async () => {
  try {
    const response = await fetch("https://faction-fischer.vercel.app/api/auth/session", {
      method: "GET",
      mode: "cors",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

//WHEN CONTEXT MENU ITEM IS CLICKED
chrome.contextMenus.onClicked.addListener((evt) => {
  getSelectedText(evt);
  chrome.action.setBadgeBackgroundColor({ color: [0, 255, 0, 230] });
  chrome.action.setBadgeText({ text: "!!!!" });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: <string>"Fact Check with Fischer",
    id: <string>"FischerContextMenu",
    contexts: ["selection"],
  });
});

chrome.runtime.onMessage.addListener((request, sender, onSuccess) => {
  getSession().then((data) => {
    if (Object.keys(data).length > 0) {
      onSuccess(data);
    } else {
      onSuccess(null);
    }
  });

  return true; // Will respond asynchronously
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  innerHTML = request;
  if (request.greeting == "hello") sendResponse({ farewell: "goodbye" });
});

export {};
