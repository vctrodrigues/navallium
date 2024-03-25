<script lang="ts" setup>
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    title: string;
    modelValue: boolean;
    confirm?: boolean;
    cancel?: boolean;

    confirmText?: string;
    cancelText?: string;

    persistent?: boolean;
  }>(),
  {
    confirm: true,
    cancel: true,
    confirmText: "Confirm",
    cancelText: "Cancel",
    persistent: false,
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "confirm"): void;
  (event: "cancel"): void;
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

const onCancel = () => {
  emit("cancel");
  onClose();
};

const onConfirm = () => {
  emit("confirm");
  onClose();
};
</script>

<template>
  <v-dialog
    v-model="lazyActive"
    :persistent="persistent"
    max-width="600"
    style="z-index: 9100"
  >
    <v-card :title="title">
      <v-card-text>
        <slot />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn v-if="cancel" variant="outlined" @click="onCancel">
          {{ cancelText }}
        </v-btn>
        <v-btn v-if="confirm" color="primary" variant="flat" @click="onConfirm">
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
