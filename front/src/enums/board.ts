export enum CellState {
  Empty = "empty",
  Aircraft = "aircraft",
  Boat = "boat",
  Submarine = "submarine",
  Destroyer = "destroyer",
  Miss = "miss",
}

export enum BoardEvents {
  Uncover = "board:uncover",
  Update = "board:update",
}
