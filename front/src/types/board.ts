import type { CellState } from "@/enums/board";

export type Cell = {
  state: CellState;
  index: number;
  hit?: boolean;
};

export type Board = {
  positions: Array<Cell[]>;
};
