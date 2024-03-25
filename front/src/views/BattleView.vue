<script lang="ts" setup>
import { computed, reactive, watch, onMounted, ref } from "vue";
import { useRoomStore } from "@/stores/room";
import { useUserStore } from "@/stores/user";

import BattleBoard from "@/components/BattleBoard.vue";
import ResultDialog from "@/components/ResultDialog.vue";

import { UserRole } from "@/enums/role";
import type { Coordinate } from "@/types/coordinate";
import { roomService } from "@/service/room";
import { userService } from "@/service/user";
import { useRouter } from "vue-router";
import { CellState } from "@/enums/board";
import { RoomState } from "@/enums/room";

const userStore = useUserStore();
const roomStore = useRoomStore();

const router = useRouter();

const finishing = ref(false);

const resultDialog = reactive({
  active: false,
});

const yours = computed(() => {
  return roomStore.room?.users.find(
    (user) => user.session === userStore.user?.session
  );
});

const opponents = computed(() => {
  return roomStore.room?.users.find(
    (user) =>
      user.session !== userStore.user?.session && user.role === UserRole.Player
  );
});

const waiting = computed(() => {
  return roomStore.room?.users.some((user) => {
    return user.state === RoomState.Waiting;
  });
});

onMounted(() => {
  userService.initialize({
    setUser: userStore.setUser,
  });

  roomService.initialize({
    setRoom: roomStore.setRoom,
    setInvite: roomStore.setInvite,
    setResult: roomStore.setResult,
  });

  if (!userStore.user) {
    router.push({ name: "login" });
  }
});

watch(
  () => userStore.user,
  (user) => {
    if (!user) {
      router.push({ name: "login" });
    }
  }
);

watch(
  () => roomStore.result,
  (result) => {
    if (result?.winner) {
      resultDialog.active = true;
    }
  }
);

const onMove = (coordinate: Coordinate) => {
  if (!roomStore.room) {
    return;
  }

  if (roomStore.room.turn !== userStore.user!.session) {
    return;
  }

  if (!opponents.value) {
    return;
  }

  if (
    opponents.value.board.positions[coordinate.y][coordinate.x].state !==
    CellState.Empty
  ) {
    return;
  }

  roomService.move(roomStore.room, {
    session: userStore.user!.session,
    x: coordinate.x,
    y: coordinate.y,
  });
};

const onGoHome = () => {
  finishing.value = true;
  roomStore.reset();
  router.push({ name: "home" });
};
</script>

<template>
  <main class="app-battle-view">
    <header
      class="app-flex app-justify-content--space-between app-px--10 app-py--5"
    >
      <img src="../assets/logo.svg" alt="Navallium logo" />
      <div v-if="!resultDialog.active" class="app-battle-view__status">
        <span
          v-if="waiting"
          class="app-flex app-align-items--baseline app-gap--2 app-info--regular app-color--text-secondary"
        >
          <span class="app-info--semi-bold app-color--text-primary">
            Waiting...
          </span>
          Your opponent is placing the ships.
        </span>
        <span
          v-else
          class="app-flex app-align-items--baseline app-gap--2 app-info--regular app-color--text-secondary"
        >
          <span class="app-info--semi-bold app-color--text-primary">
            {{
              roomStore.room?.turn === userStore.user?.session
                ? "Your"
                : opponents?.name
            }}'s turn
          </span>
          {{
            roomStore.room?.turn === userStore.user?.session
              ? `Select a place and try to guess where are your opponent's ships to take it down.`
              : "Wait a minute and pray to not be drowned."
          }}
        </span>
      </div>
    </header>

    <div v-if="!finishing" class="app-battle-view__container app-flex">
      <div v-if="yours" class="app-battle-view__container__yours-board">
        <h2>{{ yours.name }}</h2>
        <BattleBoard
          v-if="userStore.user && yours"
          :user="yours"
          :size="10"
          :disabled="roomStore.room?.turn === yours.session"
        />
      </div>
      <div v-if="opponents" class="app-battle-view__container__opponents-board">
        <h2>{{ opponents.name }}</h2>
        <BattleBoard
          v-if="userStore.user && opponents"
          :user="opponents"
          :size="10"
          :disabled="roomStore.room?.turn === opponents.session"
          @select="onMove"
        />
      </div>
    </div>

    <ResultDialog v-model="resultDialog.active" @close="onGoHome" />
  </main>
</template>

<style lang="scss" scoped>
.app-battle-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;

  justify-content: center;
  align-items: center;

  padding-top: 80px;

  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    z-index: 1000;
    background-color: var(--background-paper);
  }

  .app-battle-view__container {
    width: 100%;
    display: flex;

    .app-battle-view__container__yours-board,
    .app-battle-view__container__opponents-board {
      width: 50%;
      min-height: calc(100vh - 80px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      gap: 20px;
    }

    .app-battle-view__container__opponents-board {
      background-color: var(--background-paper-light);
    }
  }
}
</style>
