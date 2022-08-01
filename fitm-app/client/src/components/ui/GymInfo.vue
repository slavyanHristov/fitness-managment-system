<script setup>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import Slide from "./Slide.vue";
import Carousel from "./Carousel.vue";
import FullAccessService from "@/services/API-calls/FullAccessService";
import SkewedButton from "./SkewedButton.vue";
import Modal from "./Modal.vue";
import EditGym from "./EditGym.vue";

const props = defineProps(["gymId"]);
const router = useRouter();
const apiUrlPath = inject("apiUrlPath");
const isModalOpen = ref(false);

const authStore = useAuthStore();
const gym = ref(null);
let gymImages = ref(null);
let foundGym = ref(null);
let gymAddress = ref(null);

const gymData = async () => {
  try {
    gym.value = await FullAccessService.getGym(props.gymId);
    if (gym.value) {
      foundGym.value = gym.value.data.foundGym;
      gymImages.value = gym.value.data.foundGym.images;
      gymAddress.value = gym.value.data.foundGym.address;

      editGymData.value = {
        id: foundGym.value.id,
        name: foundGym.value.name,
        monthly_cost: foundGym.value.monthly_cost,
        open_at: foundGym.value.open_at,
        closed_at: foundGym.value.closed_at,
        phone: foundGym.value.phone,
        description: foundGym.value.description,
      };
    }
  } catch (err) {
    console.log(err);
    router.push({ name: "notFound" });
  }
};
const editGymData = ref(null);

const setModal = () => {
  isModalOpen.value = true;
};

await gymData();

const removeSeconds = (timeStr) => {
  let hrMinSec = timeStr.split(":");
  return hrMinSec[0] + ":" + hrMinSec[1];
};
</script>

<template>
  <div v-if="gym" class="w-full">
    <Modal
      :open="isModalOpen"
      header-title="Edit Gym"
      :is-closable-modal="true"
      @close-modal="isModalOpen = !isModalOpen"
    >
      <EditGym
        :gym-data="editGymData"
        @refresh-gym-data="gymData"
        @close-modal="isModalOpen = !isModalOpen"
      />
    </Modal>
    <Carousel
      :num-of-slides="gymImages.length"
      class="relative h-[75vh] max-h-[75vh]"
    >
      <template #slide="{ currentSlide }">
        <div>
          <Slide v-for="(image, index) in gymImages" :key="image.id">
            <template #gymImage>
              <div
                v-show="currentSlide === index + 1"
                id="slide-info"
                class="absolute w-full h-full max-h-full"
              >
                <img
                  class="object-cover h-full min-w-full"
                  :src="apiUrlPath + image.path"
                  alt="Gym Image"
                />
              </div>
            </template>
          </Slide>
        </div>
      </template>
    </Carousel>
    <div id="gym-info" class="grid grid-cols-1 my-12 md:grid-cols-2">
      <div class="">
        <div id="header" class="flex items-center justify-center gap-3 mb-5">
          <img class="w-12 h-12" src="@/assets/icons/gym.svg" alt="" />
          <h1 class="text-4xl font-extrabold uppercase font-poppins">
            {{ foundGym.name }}
          </h1>
        </div>
        <div class="">
          <div class="flex items-center justify-center gap-2 p-5">
            <img class="w-6 h-6" src="@/assets/icons/location.svg" alt="" />
            <p class="text-lg font-light font-poppins">
              {{ gymAddress.name }}, {{ gymAddress.city.name }},
              {{ gymAddress.city.country.name }}
            </p>
          </div>
          <div class="flex items-center justify-center gap-2 p-5">
            <img class="w-6 h-6" src="@/assets/icons/time.svg" alt="" />
            <p class="text-lg font-light font-poppins">
              Open from {{ removeSeconds(foundGym.open_at) }} to
              {{ removeSeconds(foundGym.closed_at) }}
            </p>
          </div>
          <div class="flex items-center justify-center gap-2 p-5">
            <img class="w-6 h-6" src="@/assets/icons/contact.svg" alt="" />
            <p class="text-xl font-light font-poppins">Contact us</p>
            <p class="italic font-normal font-poppins">{{ foundGym.phone }}</p>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center gap-12">
        <p class="text-sm italic font-light font-poppins-light">
          {{ foundGym.description }}
        </p>
        <SkewedButton
          v-if="authStore.isCurrentUserClient || !authStore.getCurrentUser"
          class="w-1/2 bg-primaryBlue hover:bg-transparent hover:skewedButton-outline"
          button-text="JOIN US"
          @click="
            router.push({
              name: 'gymMembership',
              params: {
                id: foundGym.id,
              },
            })
          "
        />
        <SkewedButton
          v-if="authStore.isCurrentUserAdmin"
          class="w-1/2 bg-primaryBlue hover:bg-transparent hover:skewedButton-outline"
          button-text="EDIT"
          @click="setModal"
        />
      </div>
    </div>
  </div>
</template>
