<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { Ship } from "@/enums/ship";

import ShipItem from "@/components/ShipItem.vue";

defineProps<{
  ships: { type: Ship; amount: number }[];
  selectedShip?: Ship;
}>();

const emit = defineEmits<{
  (event: "select", ship: Ship): void;
}>();

const userStore = useUserStore();

function onSelectShip(ship: Ship) {
  emit("select", ship);
}
</script>

<template>
  <div class="app-ship-picker app-flex app-column app-pa--10">
    <p class="app-color--text-secondary app-info--semi-bold app-mb--8">
      Hi, {{ userStore.user?.name }} these are your ships.<br /><br />Click to
      select and place into the board.
    </p>

    <div class="app-flex app-column app-gap--4">
      <div
        v-for="ship in ships"
        :key="ship.type"
        class="app-flex app-row app-align-items--center app-justify-content--start app-gap--3"
      >
        <ShipItem
          :type="ship.type"
          :amount="ship.amount"
          :disabled="
            (selectedShip && selectedShip !== ship.type) || !ship.amount
          "
          @select="onSelectShip"
        />
        <span class="app-info--semi-bold app-color--text-secondary">
          {{ ship.amount }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-ship-picker {
  max-width: 320px;

  p {
    width: 120px;
  }
}
</style>
