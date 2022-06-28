<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import Modal from "@/components/ui/Modal.vue";
import InputField from "@/components/ui/InputField.vue";
import ForgotPassword from "@/components/ui/ForgotPassword.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";

const router = useRouter();
const authStore = useAuthStore();
const user = ref({
  username: "",
  password: "",
  rememberUser: true,
});
const isSuccessful = ref(false);
const errorMsg = ref("");
const isModalOpen = ref(false);

const pushToDashboard = (user) => {
  user["userType"] === 1
    ? router.push({ name: "adminDashboard" })
    : user["userType"] === 2
    ? router.push({ name: "managerDashboard" })
    : router.push({ name: "home" });
};

const loginAction = async () => {
  errorMsg.value = "";
  isSuccessful.value = false;
  try {
    const currentUser = await authStore.login(user.value);
    isSuccessful.value = true;
    pushToDashboard(currentUser);
  } catch (err) {
    errorMsg.value = err.response.data.message;
    console.log(err.response.data.message);
  }

  // authStore.login(user.value).then(
  //   () => {
  //     isSuccessful.value = true;
  //     console.log("Authenticated");
  //     router.push({ name: "adminDashboard" });
  //   },
  //   (err) => {
  //     errorMsg.value = err.response.data.message;
  //     console.log(err.response.data.message);
  //   }
  // );

  // try {
  //   errorMsg.value = "";
  //   isSuccessful.value = false;
  //   const response = await AuthAPI.authUser(user.value);
  //   store.setToken(response.data.accessToken);
  //   store.setUserId(response.data.userId);
  //   isSuccessful.value = true;
  // } catch (err) {
  //   errorMsg.value = err.response.data.message;
  //   console.log(err.response.data.message);
  // }
};
const setModal = () => {
  isModalOpen.value = true;
};

const testProtectedAction = async () => {
  // try {
  //   const response = await AdminAPI.getManagers();
  // } catch (err) {
  //   console.log(err.response.data);
  // }
};
</script>

<template>
  <section
    class="flex items-center justify-center flex-auto min-w-full min-h-screen"
  >
    <Modal
      :open="isModalOpen"
      headerTitle="Password Reset"
      :isClosableModal="true"
      @closeModal="isModalOpen = !isModalOpen"
    >
      <ForgotPassword @closeModal="isModalOpen = !isModalOpen" />
    </Modal>
    <div class="container h-full">
      <div class="flex flex-wrap items-center justify-center w-auto h-full">
        <div class="hidden mb-12 lg:block md:w-8/12 lg:w-6/12 md:mb-0">
          <img src="@/assets/images/login.svg" alt="Phone image" />
        </div>
        <div
          class="flex justify-center transition-all bg-primaryWhite dark:bg-primaryDark sm:mb-9 md:w-8/12 lg:w-5/12 lg:ml-10"
        >
          <form class="w-full bg-inherit" @submit.prevent="loginAction">
            <InputField
              inputId="username"
              inputType="text"
              :failureErrors="errorMsg"
              v-model:inputContent="user.username"
              labelText="Username"
            />
            <InputField
              inputId="password"
              inputType="password"
              :failureErrors="errorMsg"
              v-model:inputContent="user.password"
              labelText="Password"
            />
            <div
              class="flex flex-col items-center justify-between gap-3 mb-6 md:flex-row"
            >
              <div class="form-group form-check">
                <input
                  type="checkbox"
                  class="float-left w-4 h-4 mt-1 mr-2 align-top transition duration-200 bg-white bg-center bg-no-repeat bg-contain border border-gray-300 rounded-sm appearance-none cursor-pointer form-check-input checked:bg-blue-600 checked:border-blue-600 focus:outline-none"
                  id="exampleCheck3"
                  v-model="user.rememberUser"
                />
                <label
                  class="inline-block form-check-label md:mb-0"
                  for="exampleCheck2"
                  >Remember me</label
                >
              </div>
              <a
                @click="setModal"
                class="transition duration-200 ease-in-out cursor-pointer text-primaryBlue hover:text-blue-700 focus:text-blue-700 active:text-blue-800"
                >Forgot your password?</a
              >
            </div>
            <div
              class="text-xs text-center text-red-500 font-inter"
              v-if="errorMsg"
            >
              {{ errorMsg }}
            </div>
            <div
              class="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"
            ></div>
            <div class="flex flex-col items-center justify-center gap-3">
              <span class=""
                >Don't have an account?
                <router-link
                  class="font-semibold uppercase text-primaryBlue"
                  :to="{ name: 'register' }"
                  >Sign up</router-link
                ></span
              >
              <SubmitButton buttonText="Sign in" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
