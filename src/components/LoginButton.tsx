import { useEffect, useState } from "react";
import type { Session } from "src/types";

export const LoginButton = () => {
  const [session, setSession] = useState<Session>();
  const name = session?.user.name;

  const handleLogin = () => {
    session
      ? chrome.tabs.create({
          active: true,
          url: "localhost:3000/posts",
        })
      : chrome.tabs.create({
          active: true,
          url: "localhost:3000/api/auth/signin",
        });
  };

  useEffect(() => {
    chrome.runtime.sendMessage({ action: "AUTH_CHECK" }, (session) => {
      if (session) {
        setSession(session);
      }
    });
  }, []);

  return (
    <>
      {session ? (
        <div className="text-white hover:underline text-bold underline-offset-8">
          <button onClick={handleLogin}>Welcome, {name} </button>
        </div>
      ) : (
        <div className="text-white hover:underline justify-right text-bold underline-offset-8">
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </>
  );
};
export {};
