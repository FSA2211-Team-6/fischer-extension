import { useEffect, useState } from "react";

interface session {
  user: {
    name: string;
  };
}

export const LoginButton = () => {
  const [session, setSession] = useState<session>();
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
        <div className="">
          <button onClick={handleLogin}>Welcome, {name} </button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </>
  );
};
export {};
