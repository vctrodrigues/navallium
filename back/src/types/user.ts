import { Board } from "./board";

export type User = {
  session: string;
  code: string;
  name: string;
  board: Board;
};
