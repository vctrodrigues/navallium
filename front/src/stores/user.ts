import { defineStore } from "pinia";
import { ref } from "vue";

import type { User } from "@/types/user";

export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<User>();

    const setUser = (newUser?: User) => {
      user.value = newUser;
    };

    return {
      user,
      setUser,
    };
  },
  {
    persist: true,
  }
);
