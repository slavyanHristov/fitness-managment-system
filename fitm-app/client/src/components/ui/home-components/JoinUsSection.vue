<script setup>
import SkewedButton from "@/components/ui/SkewedButton.vue";
import { useRouter } from "vue-router";
const router = useRouter();
</script>
<template>
  <div class="h-full bg-primaryBgWhite dark:bg-accentDark">
    <div class="flex items-center justify-center w-10/12 h-full mx-auto py-36">
      <div class="grid justify-center grid-cols-1 gap-8 lg:grid-cols-2">
        <div id="col-1" class="w-full h-full customGrid">
          <div class="first-section">
            <img
              class="object-cover w-full h-full"
              src="@/assets/images/join-us-1.jpg"
              alt=""
            />
          </div>
          <div class="second-section">
            <img
              class="object-cover object-center w-full h-full"
              src="@/assets/images/join-us-2.jpg"
              alt=""
            />
          </div>
          <div class="third-section">
            <img
              class="object-cover w-full h-full"
              src="@/assets/images/join-us-3.jpg"
              alt=""
            />
          </div>
          <div class="fourth-section">
            <img
              class="object-cover object-center w-full h-full"
              src="@/assets/images/join-us-4.jpg"
              alt=""
            />
          </div>
        </div>
        <div id="col-2">
          <div
            class="flex flex-col items-center w-full h-full gap-20 mt-10 lg:mt-0"
          >
            <h1
              class="text-3xl font-bold text-center uppercase text-primaryBlue lg:text-5xl"
            >
              Reasons to join us
            </h1>
            <div class="flex flex-col items-center justify-center gap-4">
              <div class="flex items-center w-full gap-4 font-bold uppercase">
                <img
                  class="w-10 h-10"
                  src="@/assets/icons/dashboard-icons/tick.svg"
                  alt=""
                />
                <p>Top-notch fitness experts</p>
              </div>
              <div class="flex items-center w-full gap-4 font-bold uppercase">
                <img
                  class="w-10 h-10"
                  src="@/assets/icons/dashboard-icons/tick.svg"
                  alt=""
                />
                <p>Accessible gym fees and quality equipment</p>
              </div>
              <div class="flex items-center w-full gap-4 font-bold uppercase">
                <img
                  class="w-10 h-10"
                  src="@/assets/icons/dashboard-icons/tick.svg"
                  alt=""
                />
                <p>Free personal fitness instructor on gym membership order</p>
              </div>
              <div class="flex items-center w-full gap-4 font-bold uppercase">
                <img
                  class="w-10 h-10"
                  src="@/assets/icons/dashboard-icons/tick.svg"
                  alt=""
                />
                <p>Control your own weekly meal plan</p>
              </div>
              <div class="flex items-center w-full gap-4 font-bold uppercase">
                <img
                  class="w-10 h-10"
                  src="@/assets/icons/dashboard-icons/tick.svg"
                  alt=""
                />
                <p>Get a free fitness routine from instructor</p>
              </div>
            </div>
            <div class="w-1/2">
              <SkewedButton
                class="w-full mt-10 bg-primaryBlue hover:bg-transparent hover:skewedButton-outline"
                button-text="Join us now"
                @click="router.push({ name: 'registerClient' })"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: 8px;
  grid-row-gap: 8px;
}
.first-section {
  grid-area: 1 / 1 / 4 / 2;
}
.second-section {
  grid-area: 1 / 2 / 3 / 4;
}
.third-section {
  grid-area: 3 / 3 / 4 / 4;
}
.fourth-section {
  grid-area: 3 / 2 / 4 / 3;
}
</style>
