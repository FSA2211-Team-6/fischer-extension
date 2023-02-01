import { useEffect, useState } from "react";

export const Selection: React.VFC = () => {
  const [selection, setSelection] = useState("");

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message: string) => {
      setSelection(message);
    });
  });

  return (
    <div>
      <p>{selection}</p>
    </div>
  );
};
