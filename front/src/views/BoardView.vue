<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

import ShipPicker from "@/components/ShipPicker.vue";
import GameBoard from "@/components/GameBoard.vue";

import { useUserStore } from "@/stores/user";

import { Ship } from "@/enums/ship";
import { roomService } from "@/service/room";
import { useRoomStore } from "@/stores/room";
import { userService } from "@/service/user";

import type { User } from "@/types/user";
import { onMounted } from "vue";

const userStore = useUserStore();
const roomStore = useRoomStore();
const router = useRouter();

const finishing = ref(false);

const resultDialog = reactive({
  active: false,
});

const boardSetup = reactive<{
  selectedShip?: Ship;
  ships: { type: Ship; amount: number }[];
}>({
  selectedShip: undefined,
  ships: [
    { type: Ship.Aircraft, amount: 1 },
    { type: Ship.Submarine, amount: 2 },
    { type: Ship.Boat, amount: 2 },
    { type: Ship.Destroyer, amount: 1 },
  ],
});

const isComplete = computed(() => {
  return boardSetup.ships.every((ship) => ship.amount === 0);
});

onMounted(() => {
  userService.initialize({
    setUser: userStore.setUser,
  });

  if (!userStore.user) {
    router.push({ name: "login" });
  }
});

watch(
  () => roomStore.result,
  (result) => {
    if (result?.winner) {
      resultDialog.active = true;
    }
  }
);

watch(
  () => userStore.user,
  (user) => {
    if (!user) {
      router.push({ name: "login" });
    }
  }
);

const onReady = () => {
  if (!userStore.user) return;
  if (!isComplete.value) return;
  if (!roomStore.room) return;

  const room = {
    ...roomStore.room,
    users: roomStore.room.users.map((user) => {
      if (user.session === (userStore.user as User).session) {
        user.board = {
          ...roomStore.lazyBoard,
        };
      }

      return user;
    }),
  };

  const user = {
    ...userStore.user,
    board: {
      ...roomStore.lazyBoard,
    },
  };

  roomStore.setRoom(room);
  userStore.setUser(user);

  roomService.ready(room, user);

  router.push("/battle");
};

const onSelectShip = (ship: Ship) => {
  boardSetup.selectedShip = ship;
};

const onPlaceShip = (ship: Ship) => {
  const _ship = boardSetup.ships.find((_ship) => _ship.type === ship);

  if (!_ship) return;

  if (_ship.amount === 0) return;

  boardSetup.selectedShip = undefined;
  _ship.amount--;
};

const onGoHome = () => {
  finishing.value = true;
  roomStore.reset();
  router.push({ name: "home" });
};
</script>

<template>
  <main class="app-board-view">
    <header
      class="app-flex app-justify-content--space-between app-px--10 app-py--5"
    >
      <img src="../assets/logo.svg" alt="Navallium logo" />
      <v-btn color="primary" :disabled="!isComplete" @click="onReady">
        I'm ready
      </v-btn>
    </header>

    <div v-if="!finishing" class="app-board-view__container app-flex">
      <ShipPicker
        :ships="boardSetup.ships"
        :selected-ship="boardSetup.selectedShip"
        @select="onSelectShip"
      />
      <div class="app-board-view__container__board">
        <GameBoard
          v-if="userStore.user"
          :size="10"
          :selected-ship="boardSetup.selectedShip"
          @place="onPlaceShip"
        />
      </div>
    </div>

    <ResultDialog v-model="resultDialog.active" @close="onGoHome" />
  </main>
</template>

<style lang="scss" scoped>
.app-board-view {
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  padding-top: 80px;

  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    z-index: 1000;
    background-color: var(--background-paper);
  }

  .app-board-view__container {
    width: 100%;

    .app-board-view__container__board {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
