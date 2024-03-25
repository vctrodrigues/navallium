<script lang="ts" setup>
import { computed, useCssModule } from "vue";

import { SHIPS, SHIP_SIZE } from "@/const/ship";
import { Ship } from "@/enums/ship";
import { CellState } from "@/enums/board";
import { useRoomStore } from "@/stores/room";
import { toShip } from "@/adapter/ship";

import ShipItem from "./ShipItem.vue";
import type { Board } from "@/types/board";

const LOWER_BOUND = 0;

const props = defineProps<{
  index: number;
  row: number;
  size: number;
  board?: Board;
  selectedShip?: Ship;
  highlight?: boolean;
}>();

const roomStore = useRoomStore();

const emit = defineEmits<{
  (event: "click"): void;
}>();

const cell = computed(() => {
  return props.board
    ? props.board.positions[props.row][props.index]
    : roomStore.lazyBoard.positions[props.row][props.index];
});

const styles = useCssModule("cell");

const onClick = () => {
  emit("click");
};
</script>

<template>
  <div
    :class="[
      styles.container,
      {
        [styles.firstRow]: row === LOWER_BOUND,
        [styles.firstColumn]: index === LOWER_BOUND,
        [styles.topLeft]: index === LOWER_BOUND && row === LOWER_BOUND,
        [styles.topRight]: index === size - 1 && row === LOWER_BOUND,
        [styles.bottomLeft]: index === LOWER_BOUND && row === size - 1,
        [styles.bottomRight]: index === size - 1 && row === size - 1,
        [styles.hitted]: cell.hit,
      },
    ]"
    @click="onClick"
  >
    <ShipItem
      v-if="cell.state === CellState.Empty && selectedShip && highlight"
      :type="selectedShip"
      :class="[
        styles.overboard,
        {
          [styles.outbounds]: index + SHIP_SIZE[selectedShip] > size,
        },
      ]"
      :amount="1"
      @click="onClick"
    />
    <ShipItem
      v-else-if="SHIPS.includes(cell.state) && cell.index === 0"
      :type="toShip(roomStore.lazyBoard.positions[row][index].state)"
      :class="[styles.overboard]"
      :amount="1"
      @click="onClick"
    />

    <img v-else-if="cell.state === CellState.Miss" src="../assets/miss.png" />

    <img v-if="cell.hit" src="../assets/hit.png" />
  </div>
</template>

<style lang="scss" module="cell" scoped>
.container {
  display: flex;
  position: relative;
  width: 50px;
  height: 50px;
  overflow: visible;

  align-items: center;
  justify-content: center;

  background-color: var(--color-board-bg);

  border-right: 1px solid var(--color-board-stroke);
  border-bottom: 1px solid var(--color-board-stroke);

  transition: 0.3s ease;

  &:hover {
    cursor: pointer;
  }

  img {
    position: absolute;
    width: 50px;
    height: 50px;

    padding: 10px;
    object-fit: contain;

    background-color: var(--color-hit);
    border: 2px solid var(--color-disabled);
    z-index: 3000;
  }
}

.container.topLeft {
  border-top-left-radius: 8px;
}

.container.topRight {
  border-top-right-radius: 8px;
}

.container.bottomLeft {
  border-bottom-left-radius: 8px;
}

.container.bottomRight {
  border-bottom-right-radius: 8px;
}

.container.firstColumn {
  border-left: 1px solid var(--color-board-stroke);
}

.container.firstRow {
  border-top: 1px solid var(--color-board-stroke);
}

.overboard {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
}

.outbounds {
  opacity: 0.5;
  cursor: not-allowed;
}

.aircraft {
  --ship-color: var(--color-ship-1-bg);
  --ship-stroke-color: var(--color-ship-1-stroke);
}

.submarine {
  --ship-color: var(--color-ship-2-bg);
  --ship-stroke-color: var(--color-ship-2-stroke);
}

.boat {
  --ship-color: var(--color-ship-3-bg);
  --ship-stroke-color: var(--color-ship-3-stroke);
}

.destroyer {
  --ship-color: var(--color-ship-4-bg);
  --ship-stroke-color: var(--color-ship-4-stroke);
}

.ship {
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: inset 0 0 0 2px var(--ship-stroke-color);
  background-color: var(--ship-color);

  transition: 0.3s ease;
  cursor: pointer;
}

.hitted {
  box-shadow: inset 0 0 0 4px var(--background-paper);
}
</style>
