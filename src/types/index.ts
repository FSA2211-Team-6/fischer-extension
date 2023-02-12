export type Message = {
  action: "getId";
};

export type Response = {
  id: string;
};

export type SelectionResponse = {
  text: string;
};

export type Session = {
  user: {
    name: string;
    id: string;
    fischerId: number;
    currentTokens: number;
  };
};
