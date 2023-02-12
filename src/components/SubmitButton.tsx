import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import type { Session } from "src/types";

interface SubmitButtonProps {
  session: Session | undefined;
  selection: string | undefined;
  urlHost: string;
  urlPath: string;
}

export const SubmitButton = (props: SubmitButtonProps) => {
  const { session, selection, urlHost, urlPath } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const userId = session?.user.fischerId;

  const disableButton = () => {
    if (session && selection) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await postAssertion(selection, urlHost, urlPath, userId);
    setIsLoading(false);
  };

  const postAssertion = async (
    assertion: any,
    urlHost: string,
    urlArticle: string,
    userId: number | undefined,
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
        },
        website: {
          host: urlHost,
          article: urlArticle,
        },
      };
      const aiDataJSON = JSON.stringify(aiData);

      console.log("AI DATA:", aiData);

      console.log("AI DATA JSON", aiDataJSON);

      const dbUpdate = await fetch("http://localhost:3000/api/post", {
        method: "POST",
        body: aiDataJSON,
      });
      console.log(dbUpdate);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    disableButton();
  });

  return (
    <div className="p-2 text-xs text-white bg-gray-700 border-radius-4px">
      <LoadingButton
        loading={isLoading}
        disabled={isDisabled}
        onClick={handleSubmit}
        endIcon={<SendIcon />}
        loadingPosition="end"
      >
        Submit Assertion
      </LoadingButton>
    </div>
  );
};
