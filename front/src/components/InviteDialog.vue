<script lang="ts" setup>
import { computed } from "vue";
import GeneralDialog from "@/components/GeneralDialog.vue";

const props = defineProps<{
  modelValue: boolean;
  host: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "accept"): void;
  (event: "deny"): void;
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

const onAccept = () => {
  emit("accept");
  onClose();
};

const onDeny = () => {
  emit("deny");
  onClose();
};
</script>

<template>
  <GeneralDialog
    v-model="lazyActive"
    title="Someone invited you"
    confirmText="Yes, let's go"
    cancelText="No, thanks"
    @confirm="onAccept"
    @cancel="onDeny"
  >
    Hey! {{ host }} invited you for a battle. Do you accept it?
  </GeneralDialog>
</template>
