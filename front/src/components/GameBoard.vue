<script lang="ts" setup>
import { reactive, ref, useCssModule, onMounted } from "vue";
import GameBoardRuler from "@/components/GameBoardRuler.vue";
import BoardRow from "@/components/BoardRow.vue";

import { Ship } from "@/enums/ship";
import { useRoomStore } from "@/stores/room";
import { CellState } from "@/enums/board";
import { SHIP_SIZE } from "@/const/ship";

import type { Coordinate } from "@/types/coordinate";
import { toCell } from "@/adapter/ship";

const props = defineProps<{
  size: number;
  selectedShip?: Ship;
}>();

const emit = defineEmits<{
  (event: "place", ship: Ship): void;
}>();

const styles = useCssModule("board");

const roomStore = useRoomStore();
const gameBoard = ref<HTMLDivElement>();

const control = reactive<{
  coordinate: Coordinate;
}>({
  coordinate: {
    x: -1,
    y: -1,
  },
});

onMounted(() => {
  roomStore.setLazyBoard({
    positions: Array.from({ length: props.size }, () =>
      Array.from({ length: props.size }, () => ({
        index: -1,
        state: CellState.Empty,
      }))
    ),
  });

  if (gameBoard.value) {
    gameBoard.value.addEventListener("mousemove", trackMousePosition);
    gameBoard.value.addEventListener("mouseleave", onMouseLeave);
  }
});

const trackMousePosition = (event: MouseEvent) => {
  if (!gameBoard.value) return;

  const { clientX, clientY } = event;
  const { top, left, width, height } = gameBoard.value.getBoundingClientRect();

  const x = clientX - left;
  const y = clientY - top;

  const index = Math.ceil((x / width) * props.size);
  const row = Math.ceil((y / height) * props.size);

  if (index < 1 || index > props.size - 1) {
    control.coordinate.x = -1;
    control.coordinate.y = -1;
    return;
  }

  control.coordinate.x = index - 1;
  control.coordinate.y = row - 1;
};

const onMouseLeave = () => {
  control.coordinate.x = -1;
  control.coordinate.y = -1;
};

const onPlaceShip = (index: number, row: number, ship: Ship) => {
  const isInRange = (_row: number, _index: number) => {
    return _row === row && _index >= index && _index < SHIP_SIZE[ship] + index;
  };

  if (roomStore.lazyBoard.positions[row][index].state !== CellState.Empty) {
    return;
  }

  if (!roomStore.lazyBoard) {
    return;
  }

  const isOverlapped = roomStore.lazyBoard.positions.some((position, _row) => {
    return position.some((cell, _index) => {
      return isInRange(_row, _index) && cell.state !== CellState.Empty;
    });
  });

  if (isOverlapped) {
    return;
  }

  const isOutbounds = index + SHIP_SIZE[ship] > props.size;

  if (isOutbounds) {
    return;
  }

  roomStore.setLazyBoard({
    positions: roomStore.lazyBoard.positions.map((position, _row) => {
      return position.map((cell, _index) => {
        return isInRange(_row, _index)
          ? { index: _index - index, state: toCell(ship) }
          : cell;
      });
    }),
  });

  emit("place", ship);
};
</script>

<template>
  <div :class="[styles.board]">
    <GameBoardRuler :size="size" orientation="horizontal" type="letter" />
    <div class="app-flex">
      <GameBoardRuler :size="size" orientation="vertical" type="number" />
      <div
        v-if="roomStore.lazyBoard"
        ref="gameBoard"
        :class="[styles.boardRows]"
      >
        <BoardRow
          v-for="row in size"
          :key="`row-${row}`"
          :row="row - 1"
          :size="size"
          :selected-ship="selectedShip"
          :coordinate="control.coordinate"
          @place="onPlaceShip"
        />
      </div>
      <GameBoardRuler :size="size" orientation="vertical" type="number" />
    </div>
    <GameBoardRuler :size="size" orientation="horizontal" type="letter" />
  </div>
</template>

<style lang="scss" module="board" scoped>
.board {
  display: flex;
  flex-direction: column;
}

.boardRows {
  display: flex;
  flex-direction: column;
}
</style>
