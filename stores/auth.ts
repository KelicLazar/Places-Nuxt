import { createAuthClient } from "better-auth/vue";
import { defineStore } from "pinia";

const authClient = createAuthClient();

export const useAuthStore = defineStore("useAuthStore", () => {
  const session = ref <Awaited<ReturnType<typeof authClient.useSession>> | null>(null);
  async function init() {
    const data = await authClient.useSession(useFetch);
    session.value = data;
  }
  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);

  async function signIn() {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
      fetchOptions: {
        headers,
      },
    });
  }
  async function guestSignIn() {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);
    const response = await authClient.signIn.email({
      email: "guest@gmail.com",
      password: "no-password",
      fetchOptions: {
        headers,
      },
    });
    if (response.error) {
      await authClient.signUp.email({
        email: "guest@gmail.com",
        password: "no-password",
        name: "Guest",
        fetchOptions: {
          headers,
        },

      });
    }
    console.log("clicked guest signin");
  }
  async function signOut() {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);
    await authClient.signOut({
      fetchOptions: {
        headers,
      },
    });
    navigateTo("/");
  }

  return {
    loading,
    signIn,
    signOut,
    user,
    init,
    guestSignIn,
  };
});

// export const useAuthStore = defineStore("useAuthStore", {
//   state: () => ({
//     loading: false,
//   }),
//   actions: {
//     async signIn() {
//       this.loading = true;

//       await authClient.signIn.social({
//         provider: "github",
//         callbackURL: "/dashboard",
//       });
//       this.loading = false;
//     },
//   },
// });
