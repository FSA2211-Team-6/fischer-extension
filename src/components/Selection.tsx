import { useState } from "react";

export const Selection = () => {
  const [selection, setSelection] = useState("");

  const getSelection = async () => {
    const selectedText = await chrome.storage.session.get(["selectedText"]);
    setSelection(selectedText.selectedText);
  };

  getSelection();

  return (
    <div>
      <p>{selection}</p>
    </div>
  );
};
