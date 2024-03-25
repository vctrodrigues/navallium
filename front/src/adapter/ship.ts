import { CellState } from "@/enums/board";
import { Ship } from "@/enums/ship";

export const toCell = (ship: Ship) => {
  return {
    [Ship.Aircraft]: CellState.Aircraft,
    [Ship.Submarine]: CellState.Submarine,
    [Ship.Boat]: CellState.Boat,
    [Ship.Destroyer]: CellState.Destroyer,
  }[ship];
};

export const toShip = (cell: CellState) => {
  return (
    {
      [CellState.Aircraft]: Ship.Aircraft,
      [CellState.Submarine]: Ship.Submarine,
      [CellState.Boat]: Ship.Boat,
      [CellState.Destroyer]: Ship.Destroyer,
      [CellState.Empty]: undefined,
      [CellState.Miss]: undefined,
    }[cell] ?? Ship.Aircraft
  );
};
