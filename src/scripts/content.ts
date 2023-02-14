import type { Message } from "src/types";

// You may need to use relative path import.
// import { } from "../constants";

console.log("content script");

window.addEventListener("contextmenu", (e) => {
  let node: any = e.view?.getSelection()?.anchorNode;

  // while (node?.childNodes.length <= 1) {
  //   node = node?.parentNode;
  // }

  while (node?.nodeName !== "P" && node?.nodeName !== "DIV") {
    node = node?.parentNode;
  }
  console.dir(node);

  const innerHTML = node.innerHTML.trim();
  // .replace("\n", "").replace(`\\`, "").trim();

  chrome.runtime.sendMessage(innerHTML);
});

const main = async () => {
  const assertionArray = await getExistingAssertions();
  assertionArray.forEach(async (post: any) => {
    const assertionStats = await getAssertionStats(post.id);
    const color = getHighlightColor(assertionStats.extensionTruthColor);
    highlighter(post, color);
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

const hoverMenu = (element: Element, post: any) => {
  const parent = element.parentElement;
  if (parent) {
    element.addEventListener("mouseenter", () => {
      const hover = document.createElement("div");
      hover.setAttribute("id", "hoverMenu");
      hover.setAttribute(
        "style",
        "display:flex;max-width:200px;position:absolute;background-color:rgba(31,41,55,1);border-radius:10px;padding:4px;z-index:1",
      );
      hover.innerHTML = `
        <p style='color:#FFFFFF'>Assertion: " ${post.assertion} " </p>
        <a href='http://localhost:3000/posts/${
          post ? post.id : 1
        }/1' target='_blank' rel='noreferrer noopener'><button>View on Fischer?</button></a>
        `;
      element.appendChild(hover);
    });
    element.addEventListener("mouseleave", () => {
      const element = document.getElementById("hoverMenu");
      if (element) {
        element.remove();
      }
    });
  }
};

const highlighter = (post: any, color: any) => {
  const DOM = document.querySelectorAll("*");

  for (let i = 0; i < DOM.length; i++) {
    const element = DOM[i];

    const elementHTML = element.innerHTML.replace("\n", "").replace(`\\`, "").trim();

    if (elementHTML === post.innerHTML) {
      console.log("replacing text");
      const newText = `<span class='FischerHighlight' style='background-color:${color};padding:2px;border-radius:4px'>${element.innerHTML}</span>`;
      element.innerHTML = newText;
      const span = element.getElementsByClassName("FischerHighlight");
      hoverMenu(span[0], post);
    }
  }
};

//     let matchCount = 0;
//     let finalNodeSearchString = null;
//     let finalWord;

//     for (let j = 0; j < element.childNodes.length; j++) {
//       const child: any = element.childNodes[j];
//       const elementToChange = child.parentElement;

//       if (child.textContent?.trim().includes(post.assertion)) {
//         const newText = elementToChange!.innerHTML.replace(
//           post.assertion,
//           `<span style='background-color:${color};padding:2px;border-radius:4px'>${post.assertion}</span>`,
//         );

//         elementToChange!.innerHTML = newText;
//       }

//       if (finalNodeSearchString !== null) {
//         const newText =
//           elementToChange.innerHTML.slice(
//             0,
//             elementToChange.innerHTML.indexOf(finalWord) + finalWord.length,
//           ) +
//           `</span>` +
//           elementToChange.innerHTML.slice(
//             elementToChange.innerHTML.indexOf(finalWord) + finalWord.length,
//             elementToChange.innerHTML.length,
//           );

//         elementToChange!.innerHTML =
//           `<span style='background-color:${color};padding:2px;border-radius:4px'>` + newText;

//         break;
//       }

//       console.log(post.assertion);
//       console.log(child.textContent);

//       if (matchCount >= 2 && !post.assertion.includes(child.textContent!.trim())) {
//         if (child.previousSibling?.nodeType === 3) {
//           finalNodeSearchString = child.previousSibling.textContent?.trim();
//         } else finalNodeSearchString = child.previousSibling!.outerHTML;
//       }

//       if (!post.assertion.includes(child.textContent.trim())) {
//         const assertionArray = post.assertion.split(" ");
//         const childTextArray = child.textContent.trim().split(" ");

//         let wordMatch = 0;

//         for (let k = 0; k < assertionArray.length; k++) {
//           const assertionWord = assertionArray[k];
//           if (childTextArray.includes(assertionWord)) {
//             wordMatch++;
//             if (wordMatch >= 2) {
//               finalWord = assertionWord;
//             }
//           } else wordMatch = 0;
//         }

//         matchCount = 0;
//       } else matchCount++;
//     }
//   }
// }

// for (let i = 0; i < DOM.length; i++) {
//   const element = DOM[i];
//   for (let j = 0; j < element.childNodes.length; j++) {
//     const node = element.childNodes[j];
//     if (node.nodeType === 3) {
//       const text = node.textContent;
//       const replacedText: any = text?.replace(
//         assertion,
//         `<span style='background-color:${color};padding:2px;border-radius:4px'>${assertion}</span>`,
//       );
//       if (replacedText !== text) {
//         console.log(node, text, replacedText);
//         element.innerHTML = replacedText;
//       }
//     }
//   }
// }
// };

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
