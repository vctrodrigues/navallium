export enum UserEvents {
  Create = "user:create",
  Delete = "user:delete",
  Get = "user:get",
}

export enum RoomEvents {
  Create = "room:create",
  Join = "room:join",
  Move = "room:move",
  Invite = "room:invite",
  Answer = "room:invite:answer",
  Ready = "room:ready",
  Start = "room:start",
  Finish = "room:finish",
  Destroy = "room:destroy",
}
