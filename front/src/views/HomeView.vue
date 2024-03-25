<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

import { useUserStore } from "@/stores/user";
import { useRoomStore } from "@/stores/room";
import { roomService } from "@/service/room";

import CodeInput from "@/components/CodeInput.vue";
import AnswerDialog from "@/components/AnswerDialog.vue";
import WaitDialog from "@/components/WaitDialog.vue";
import InviteDialog from "@/components/InviteDialog.vue";
import { UserRole } from "@/enums/role";
import { userService } from "@/service/user";

const userStore = useUserStore();
const roomStore = useRoomStore();

const router = useRouter();

const code = ref<string>("");

const waitDialog = reactive({
  active: false,
});

const answerDialog = reactive({
  active: false,
});

const inviteDialog = reactive({
  active: false,
});

onMounted(() => {
  userService.initialize({
    setUser: userStore.setUser,
  });

  roomService.initialize({
    setRoom: roomStore.setRoom,
    setInvite: roomStore.setInvite,
    setResult: roomStore.setResult,
  });

  if (!userStore.user) {
    router.push({ name: "login" });
  }
});

watch(
  () => userStore.user,
  (user) => {
    if (!user) {
      router.push({ name: "login" });
    }
  }
);

watch(
  () => roomStore.invite,
  (invite) => {
    if (invite) {
      inviteDialog.active = true;
    }
  }
);

watch(
  () => roomStore.room,
  (room) => {
    if (room) {
      if (
        room.users.filter((user) => user.role === UserRole.Player).length === 2
      ) {
        router.push({ name: "board" });
      }

      waitDialog.active = true;
    } else {
      waitDialog.active = false;
      answerDialog.active = true;
    }
  }
);

const onJoin = () => {
  if (!userStore.user) {
    return;
  }

  roomService.create(userStore.user, code.value);

  waitDialog.active = true;
};

const onLogout = () => {
  if (!userStore.user) {
    return;
  }

  userService.delete(userStore.user.code);
  userStore.setUser(undefined);
  router.push({ name: "login" });
};

const onAcceptInvite = () => {
  if (!userStore.user) {
    return;
  }

  if (!roomStore.invite) {
    return;
  }

  roomService.join(roomStore.invite.room.uid, userStore.user);
};

const onDenyInvite = () => {
  if (!roomStore.invite) {
    return;
  }

  roomService.deny(roomStore.invite.room);
};
</script>

<template>
  <main>
    <v-container>
      <v-col :cols="12" align="center" justify="center">
        <img class="app-mb--8" src="../assets/logo.svg" alt="Navallium logo" />
        <v-col :cols="6">
          <h2 class="app-mb--8">Hello, {{ userStore.user?.name }}</h2>
          <p
            class="app-mb--3 app-info--regular app-color--text-secondary app-mb--3"
          >
            Insert a friend's tag code
          </p>
          <CodeInput v-model="code" />
          <p class="app-info--regular app-color--text-secondary app-mb--3">
            or send yours
          </p>
          <p class="app-mt--4 app-mb--10 app-heading-2--semi-bold app-mono">
            {{ userStore.user?.code }}
          </p>

          <v-btn
            :disabled="code.length < 6"
            class="app-mt--5"
            min-width="100%"
            color="primary"
            @click="onJoin"
          >
            Join
          </v-btn>

          <v-btn
            class="app-mt--5"
            min-width="100%"
            variant="outlined"
            color="secondary"
            @click="onLogout"
          >
            Logout
          </v-btn>
        </v-col>
      </v-col>
    </v-container>

    <AnswerDialog v-model="answerDialog.active" />

    <WaitDialog v-model="waitDialog.active" />

    <InviteDialog
      v-model="inviteDialog.active"
      :host="roomStore.invite?.host ?? ''"
      @accept="onAcceptInvite"
      @deny="onDenyInvite"
    />
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
