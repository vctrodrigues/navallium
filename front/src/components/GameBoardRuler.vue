<script lang="ts" setup>
import { useCssModule } from "vue";

const props = defineProps<{
  size: number;
  type: "number" | "letter";
  orientation: "horizontal" | "vertical";
}>();

const ruler = useCssModule("ruler");
</script>

<template>
  <div
    :class="[
      ruler.container,
      {
        [ruler.horizontal]: orientation === 'horizontal',
        [ruler.vertical]: orientation === 'vertical',
      },
    ]"
  >
    <div v-for="index in size" :key="index" :class="[ruler.rule]">
      <p class="app-info--semi-bold">
        {{ type === "number" ? index : String.fromCharCode(64 + index) }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" module="ruler" scoped>
.container {
  display: flex;

  &.horizontal {
    flex-direction: row;
    padding-left: 50px;
  }

  &.vertical {
    flex-direction: column;
  }
}

.rule {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 50px;
  height: 50px;
}
</style>
