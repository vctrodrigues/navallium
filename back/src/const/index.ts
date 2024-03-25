import { CellState } from "../enums/board";

export const SECOND_IN_MILLIS = 1000;
export const TIMEOUT_LIMIT = 15;

export const TABLE_BOUNDS_X = 10;
export const TABLE_BOUNDS_Y = 10;

export const SHIPS = [
  CellState.Aircraft,
  CellState.Boat,
  CellState.Submarine,
  CellState.Destroyer,
];
