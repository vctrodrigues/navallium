export type Move = MovePayload & MoveResponse;

export type MovePayload = {
  x: number;
  y: number;
  session: string;
};

export type MoveResponse = {
  hit: boolean;
};
