<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { userService } from "@/service/user";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const name = ref();
const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  userService.initialize({
    setUser: userStore.setUser,
  });

  if (userStore.user) {
    router.push({ name: "home" });
  }
});

watch(
  () => userStore.user,
  (user) => {
    if (user) {
      router.push({ name: "home" });
    }
  }
);

const onSubmit = () => {
  userService.create(name.value);
};
</script>

<template>
  <main>
    <v-container>
      <v-col :cols="12" align="center" justify="center">
        <img class="app-mb--5" src="../assets/logo.svg" alt="Navallium logo" />
        <v-col :cols="4">
          <form @submit.prevent="">
            <v-text-field
              v-model="name"
              variant="solo"
              density="comfortable"
              placeholder="Insert your name"
              type="text"
              flat
            />
            <v-btn
              :disabled="!name"
              min-width="100%"
              color="primary"
              @click="onSubmit"
            >
              Enter
            </v-btn>
          </form>
        </v-col>
      </v-col>
    </v-container>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
