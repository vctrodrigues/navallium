<script lang="ts" setup>
import { useCssModule } from "vue";

import BoardCell from "./BoardCell.vue";

import { Ship } from "@/enums/ship";

import type { Coordinate } from "@/types/coordinate";
import type { Board } from "@/types/board";

const props = defineProps<{
  row: number;
  size: number;
  coordinate: Coordinate;
  board?: Board;
  selectedShip?: Ship;
}>();

const emit = defineEmits<{
  (event: "place", index: number, row: number, ship: Ship): void;
  (event: "move", index: number, row: number): void;
}>();

const styles = useCssModule("row");

const onClick = (index: number) => {
  if (props.board) {
    emit("move", index, props.row);
    return;
  }

  if (!props.selectedShip) {
    return;
  }

  emit("place", index, props.row, props.selectedShip);
};
</script>

<template>
  <div :class="[styles.container]" ref="boardRow">
    <BoardCell
      v-for="index in size"
      :key="`row-${row}-column-${index}`"
      :row="row"
      :index="index - 1"
      :size="size"
      :board="board"
      :selected-ship="selectedShip"
      :highlight="index - 1 === coordinate.x && row === coordinate.y"
      @click="onClick(index - 1)"
    />
  </div>
</template>

<style lang="scss" module="row" scoped>
.container {
  display: flex;
  width: 100%;
  height: 50px;
}
</style>
