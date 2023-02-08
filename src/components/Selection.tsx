import { useEffect, useState } from "react";

export const Selection = () => {
  const [selection, setSelection] = useState("");

  const getSelection = async () => {
    const selectedText = await chrome.storage.session.get(["selectedText"]);
    setSelection(selectedText.selectedText);
  };

  useEffect(() => {
    getSelection();
  });

  return (
    <div>
      <p className="px-2 text-xs text-white">{selection}</p>
    </div>
  );
};
