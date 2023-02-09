import type { Message } from "src/types";

// You may need to use relative path import.
// import { } from "../constants";

console.log("content script");

const main = async () => {
  const assertionArray = await getExistingAssertions();
  assertionArray.forEach((assertion: any) => {
    console.log("Assertion: ", assertion.assertion);
    highlighter(assertion.assertion);
  });
};

const highlighter = (assertion: any) => {
  const DOM = document.querySelectorAll("*");
  for (let i = 0; i < DOM.length; i++) {
    const element = DOM[i];
    for (let j = 0; j < element.childNodes.length; j++) {
      const node = element.childNodes[j];
      if (node.nodeType === 3) {
        const text = node.textContent;
        const replacedText: any = text?.replace(
          assertion,
          `<span style='background-color:yellow;padding:2;border-radius:4'>${assertion}</span>`,
        );
        if (replacedText !== text) {
          console.log(node, text, replacedText);
          element.innerHTML = replacedText;
          //element.replaceChild(document.createTextNode(replacedText), node);
        }
      }
    }
  }
};

const getExistingAssertions = async () => {
  const urlOBJ: any = { url: location.href };
  const urlJSON = JSON.stringify(urlOBJ);
  console.log("URL: ", urlJSON);
  try {
    const assertions = await fetch("http://localhost:3000/api/postURL", {
      method: "POST",
      body: urlJSON,
    });
    const data = await assertions.json();
    //eslint-disable-next-line no-console
    console.log("Assertions: ", data);
    return data;
  } catch (err) {
    console.error(err);
  }
};
// If you want to get the DOM of the open page, you can do it here.
// document.querySelector("#some-id");
chrome.runtime.onMessage.addListener((message: Message) => {
  console.log(message);
  return true;
});

// wait sendMessage
chrome.runtime.onMessage.addListener((request: Message, sender, sendResponse) => {
  if (request.action === "getId") {
    console.log("onMessage: ", request, sender, sendResponse);
    sendResponse({ id: "Got Content Script ID" });
  } else {
    sendResponse({ id: "No Action" });
  }
});

main();

export {};
