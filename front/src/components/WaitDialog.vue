<script lang="ts" setup>
import { computed } from "vue";
import GeneralDialog from "@/components/GeneralDialog.vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

const lazyActive = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    if (!value) {
      onClose();
    }
  },
});

const onClose = () => {
  emit("update:modelValue", false);
};
</script>

<template>
  <GeneralDialog
    v-model="lazyActive"
    title="Waiting your buddy"
    :confirm="false"
    :cancel="false"
    persistent
  >
    We sent a request to your friend. Wait for him to accept it.
  </GeneralDialog>
</template>
