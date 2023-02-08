import type { Message } from "src/types";

// You may need to use relative path import.
// import { } from "../constants";

// eslint-disable-next-line no-console
console.log("content script");

// const getActiveTabURL = async () => {
//   //eslint-disable-next-line no-console
//   console.log("inside active tab func");
//   const tabs: Array<any> = await chrome.tabs.query({
//     currentWindow: true,
//     active: true,
//   });
//   const tabUrl = new URL(tabs[0].url);
//   //eslint-disable-next-line no-console
//   console.log(tabUrl);
//   return tabUrl;
// };

const getExistingAssertions = async () => {
  const urlOBJ: any = { url: location.href };
  const urlJSON = JSON.stringify(urlOBJ);
  // const urlObj: any = { url: "https://javascript.info/url" };
  //eslint-disable-next-line no-console
  console.log(urlJSON);
  try {
    const assertions = await fetch("http://localhost:3000/api/postURL", {
      method: "POST",
      body: urlJSON,
    });
    const data = await assertions.json();
    //eslint-disable-next-line no-console
    console.log("Assertions: ", data);
  } catch (err) {
    console.error(err);
  }
};

getExistingAssertions();

// If you want to get the DOM of the open page, you can do it here.
// document.querySelector("#some-id");
chrome.runtime.onMessage.addListener((message: Message) => {
  // eslint-disable-next-line no-console
  console.log(message);
  return true;
});

// wait sendMessage
chrome.runtime.onMessage.addListener((request: Message, sender, sendResponse) => {
  if (request.action === "getId") {
    // eslint-disable-next-line no-console
    console.log("onMessage: ", request, sender, sendResponse);
    sendResponse({ id: "Got Content Script ID" });
  } else {
    sendResponse({ id: "No Action" });
  }
});

export {};
