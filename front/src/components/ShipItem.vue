<script lang="ts" setup>
import { useCssModule } from "vue";
import { Ship } from "../enums/ship";

const props = defineProps<{
  type: Ship;
  amount: number;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (event: "select", ship: Ship): void;
}>();

const { ship, aircraft, submarine, boat, destroyer, disabledShip } =
  useCssModule("ship");

const onSelect = () => {
  if (props.disabled) return;

  emit("select", props.type);
};
</script>

<template>
  <div
    :class="[
      ship,
      {
        [aircraft]: type === Ship.Aircraft,
        [submarine]: type === Ship.Submarine,
        [boat]: type === Ship.Boat,
        [destroyer]: type === Ship.Destroyer,
        [disabledShip]: props.disabled,
      },
    ]"
    @click="onSelect"
  >
    <p class="app-info--semi-bold app-capitalize">{{ type }}</p>
  </div>
</template>

<style lang="scss" module="ship" scoped>
.aircraft {
  --size: 4;
  --ship-color: var(--color-ship-1-bg);
  --ship-stroke-color: var(--color-ship-1-stroke);
}

.submarine {
  --size: 3;
  --ship-color: var(--color-ship-2-bg);
  --ship-stroke-color: var(--color-ship-2-stroke);
}

.boat {
  --size: 2;
  --ship-color: var(--color-ship-3-bg);
  --ship-stroke-color: var(--color-ship-3-stroke);
}

.destroyer {
  --size: 5;
  --ship-color: var(--color-ship-4-bg);
  --ship-stroke-color: var(--color-ship-4-stroke);
}

.ship {
  width: calc(50px * var(--size));
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 25px;

  box-shadow: inset 0 0 0 2px var(--ship-stroke-color);
  background-color: var(--ship-color);

  transition: 0.3s ease;
  cursor: pointer;

  &:hover {
    filter: brightness(1.2);
  }
}

.disabledShip {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);

  &:hover {
    filter: grayscale(1);
  }
}
</style>
