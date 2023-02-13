import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import type { Session } from "src/types";

interface SubmitButtonProps {
  session: Session | undefined;
  selection: string | undefined;
  urlHost: string;
  urlPath: string;
  innerHTML: any;
}

interface Post {
  id: number | undefined;
}
interface Post {
  id: number | undefined;
}

export const SubmitButton = (props: SubmitButtonProps) => {
  const { session, selection, urlHost, urlPath, innerHTML } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [post, setPost] = useState<Post>();

  const userId = session?.user.fischerId;

  const clearSelection = async () => {
    await chrome.storage.session.set({
      selectedText: null,
      urlHost: null,
      urlPath: null,
    });
  };

  const disableButton = () => {
    if (session && selection) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setPost(await postAssertion(selection, urlHost, urlPath, userId, innerHTML));
    setIsCompleted(true);
    clearSelection();
  };
  const handleClick = () => {
    chrome.tabs.create({
      active: true,
      url: `localhost:3000/posts/${post ? post.id : 1}/1`,
    });
  };

  const postAssertion = async (
    assertion: any,
    urlHost: string,
    urlArticle: string,
    userId: number | undefined,
    innerHTML: any,
  ) => {
    try {
      const aiResponse = await fetch("http://localhost:3000/api/factcheck", {
        method: "POST",
        body: assertion,
      });
      const data = await aiResponse.json();
      const aiData: any = {
        post: {
          assertion: assertion,
          aiResponse: data.choices[0].text,
          userId: userId,
          topic: data.choices[1].text,
          innerHTML: innerHTML,
        },
        website: {
          host: urlHost,
          article: urlArticle,
        },
      };
      const aiDataJSON = JSON.stringify(aiData);
      const dbUpdate = await fetch("http://localhost:3000/api/post", {
        method: "POST",
        body: aiDataJSON,
      });
      return await dbUpdate.json();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    disableButton();
  });

  return (
    <div>
      {isCompleted ? (
        <Button onClick={handleClick} size="small" variant="contained" color="success">
          Success! Visit web app?
        </Button>
      ) : (
        <LoadingButton
          variant="contained"
          size="small"
          loading={isLoading}
          disabled={isDisabled}
          onClick={handleSubmit}
          endIcon={<SendIcon />}
          loadingPosition="end"
        >
          <span className="p-2 text-xs text-white">Submit Assertion</span>
        </LoadingButton>
      )}
    </div>
  );
};
