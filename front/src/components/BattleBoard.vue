<script lang="ts" setup>
import { onMounted, reactive, ref, useCssModule } from "vue";

import GameBoardRuler from "@/components/GameBoardRuler.vue";
import BoardRow from "@/components/BoardRow.vue";

import type { Coordinate } from "@/types/coordinate";
import type { User } from "@/types/user";

const props = defineProps<{
  size: number;
  user: User;
  disabled: boolean;
}>();

const emit = defineEmits<{
  (event: "select", coordinate: Coordinate): void;
}>();

const styles = useCssModule("board");

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

const onClickCell = (index: number, row: number) => {
  emit("select", {
    x: index,
    y: row,
  });
};
</script>

<template>
  <div :class="[styles.board]">
    <div
      :class="[
        {
          [styles.disabled]: props.disabled,
        },
      ]"
    >
      <GameBoardRuler :size="size" orientation="horizontal" type="letter" />
      <div class="app-flex">
        <GameBoardRuler :size="size" orientation="vertical" type="number" />
        <div ref="gameBoard" :class="[styles.boardRows]">
          <BoardRow
            v-for="row in size"
            :key="`row-${row}`"
            :row="row - 1"
            :size="size"
            :coordinate="control.coordinate"
            :board="user.board"
            @move="onClickCell"
          />
        </div>
        <GameBoardRuler :size="size" orientation="vertical" type="number" />
      </div>
      <GameBoardRuler :size="size" orientation="horizontal" type="letter" />
    </div>
  </div>
</template>

<style lang="scss" module="board" scoped>
.board {
  display: flex;
  flex-direction: column;
  position: relative;
}

.boardRows {
  display: flex;
  flex-direction: column;
}

.disabled {
  filter: brightness(0.75);
}
</style>
