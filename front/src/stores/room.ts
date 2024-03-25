import { computed, ref } from "vue";
import { defineStore } from "pinia";

import type { Board } from "@/types/board";
import type { Room, Invite } from "@/types/room";
import type { User } from "@/types/user";
import { CellState } from "@/enums/board";

export const useRoomStore = defineStore(
  "room",
  () => {
    const room = ref<Room>();
    const invite = ref<Invite>();
    const result = ref<{
      winner: string;
      loser: string;
    }>();

    const lazyBoard = ref<Board>({
      positions: Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => ({
          index: -1,
          state: CellState.Empty,
        }))
      ),
    });

    const getBoard = computed(() => (user: User) => {
      return room.value?.users.find((_user) => _user.session === user.session)
        ?.board;
    });

    const setRoom = (newRoom?: Room) => {
      room.value = newRoom;
    };

    const setInvite = (newInvite?: Invite) => {
      invite.value = newInvite;
    };

    const setLazyBoard = (newBoard: Board) => {
      lazyBoard.value = newBoard;
    };

    const setResult = (newResult: { winner: string; loser: string }) => {
      result.value = newResult;
    };

    const reset = () => {
      room.value = undefined;
      invite.value = undefined;
      result.value = undefined;

      lazyBoard.value = {
        positions: Array.from({ length: 10 }, () =>
          Array.from({ length: 10 }, () => ({
            index: -1,
            state: CellState.Empty,
          }))
        ),
      };
    };

    return {
      room,
      invite,
      lazyBoard,
      result,
      getBoard,
      setRoom,
      setResult,
      setInvite,
      setLazyBoard,
      reset,
    };
  },
  {
    persist: true,
  }
);
