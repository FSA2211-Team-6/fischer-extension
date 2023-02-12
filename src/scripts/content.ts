import type { Message } from "src/types";

// You may need to use relative path import.
// import { } from "../constants";

console.log("content script");

const main = async () => {
  const assertionArray = await getExistingAssertions();
  assertionArray.forEach(async (assertion: any) => {
    console.log("Assertion: ", assertion.assertion);
    const assertionStats = await getAssertionStats(assertion.id);
    const color = getHighlightColor(assertionStats.extensionTruthColor);
    highlighter(assertion.assertion, color);
  });
};

const getAssertionStats = async (id: number) => {
  try {
    const stats = await fetch(`http://localhost:3000/api/posts/${id}/stats`);
    const data = await stats.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const getHighlightColor = (color: string) => {
  switch (color) {
    case "red":
      color = "rgba(255,0,0,0.6)";
      return color;
    case "green":
      color = "rgba(0,255,0,0.6)";
      return color;
    case "yellow":
      color = "rgba(255,255,0,0.6)";
      return color;
  }
};

const highlighter = (assertion: any, color: any) => {
  const DOM = document.querySelectorAll("*");
  for (let i = 0; i < DOM.length; i++) {
    const element = DOM[i];
    for (let j = 0; j < element.childNodes.length; j++) {
      const node = element.childNodes[j];
      if (node.nodeType === 3) {
        const text = node.textContent;
        const replacedText: any = text?.replace(
          assertion,
          `<span style='background-color:${color};padding:2px;border-radius:4px'>${assertion}</span>`,
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
