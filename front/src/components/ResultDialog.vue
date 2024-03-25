<script lang="ts" setup>
import { computed } from "vue";
import GeneralDialog from "@/components/GeneralDialog.vue";

import { useUserStore } from "@/stores/user";
import { useRoomStore } from "@/stores/room";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "close"): void;
}>();

const userStore = useUserStore();
const roomStore = useRoomStore();

const win = computed(() => {
  return roomStore.result?.winner === userStore.user?.session;
});

const lazyActive = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    if (!value) {
      onClose();
    }
  },
});

const onClose = () => {
  emit("close");
  emit("update:modelValue", false);
};
</script>

<template>
  <GeneralDialog
    v-model="lazyActive"
    title="Game over!"
    cancelText="Okay, go home"
    :confirm="false"
    @cancel="onClose"
  >
    {{
      win
        ? `Wow! Congratulations, you win!`
        : `Nooo! You lose, but cheer up, someday you can win something in your life.`
    }}
  </GeneralDialog>
</template>
