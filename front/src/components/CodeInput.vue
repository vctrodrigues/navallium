<script lang="ts" setup>
import { watch } from "vue";
import { onMounted } from "vue";
import { computed, reactive, ref } from "vue";

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const codeInput = reactive<Record<number, string>>({
  0: "",
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
});

const textFields = ref<HTMLElement[]>([]);

const code = computed(() => {
  return Object.values(codeInput).join("");
});

watch(
  () => code.value,
  (code) => {
    emit("update:modelValue", code);
  }
);

onMounted(() => {
  textFields.value?.[0]?.focus();
});

const onKeyDown = (index: number, event: KeyboardEvent) => {
  if (Number.isNaN(Number(event.key)) && event.key !== "Backspace") {
    return;
  }

  if (event.key === "Backspace" && index >= 0) {
    event.preventDefault();
    codeInput[index] = "";
    textFields.value[index - 1]?.focus();
  } else if (event.key.length === 1 && index < 5) {
    event.preventDefault();
    codeInput[index] = event.key;
    textFields.value[index + 1]?.focus();
  } else if (event.key.length === 1 && index === 5) {
    event.preventDefault();
    codeInput[index] = event.key;
    textFields.value[index]?.blur();
  }
};
</script>

<template>
  <div
    class="app-flex app-align-items--center app-justify-content--center app-gap--3"
  >
    <div v-for="i in 6" :key="i">
      <v-text-field
        ref="textFields"
        v-model="codeInput[i - 1]"
        variant="solo"
        density="comfortable"
        type="text"
        class="app-code-input"
        flat
        @keydown="onKeyDown(i - 1, $event)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.app-code-input {
  input {
    font-size: var(--font-size-lg);
    text-align: center;

    &:focus {
      border-radius: 4px;
      box-shadow: 0 0 8px 2px var(--text-secondary);
    }
  }
}
</style>
