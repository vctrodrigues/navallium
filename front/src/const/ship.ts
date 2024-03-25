import { CellState } from "@/enums/board";
import { Ship } from "@/enums/ship";

export const SHIP_SIZE = {
  [Ship.Aircraft]: 4,
  [Ship.Submarine]: 3,
  [Ship.Boat]: 2,
  [Ship.Destroyer]: 5,
};

export const SHIPS = [
  CellState.Aircraft,
  CellState.Submarine,
  CellState.Boat,
  CellState.Destroyer,
];
