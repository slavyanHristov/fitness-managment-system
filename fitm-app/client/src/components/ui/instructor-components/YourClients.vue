<script setup>
import { ref, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import InstructorService from "@/services/API-calls/InstructorService";
import CoverImage from "@/components/ui/CoverImage.vue";
import Toast from "../Toast.vue";
import WarningIcon from "@/components/icons/WarningIcon.vue";
import SearchFilter from "@/components/ui/SearchFilter.vue";
import GridContainer from "../GridContainer.vue";
import { filterBySingle } from "@/utils/filtrationsAndSorts";
import ClientCard from "../ClientCard.vue";
import AllGymsSkeleton from "@/components/skeleton-loaders/AllGymsSkeleton.vue";

const clientsCollection = ref(null);
const router = useRouter();
const noCollection = ref(null);
const toastMsg = ref("");
let redirectTimer = null;

let search = ref("");
const coverImg = ref("../src/assets/images/gyms-cover2.jpg");

const showToastAndRedirect = (message, pageToRedirect) => {
  toastMsg.value = message;
  redirectTimer = setTimeout(() => {
    toastMsg.value = "";
    router.push({ name: pageToRedirect });
  }, 1500);
};

const getYourClinets = async () => {
  try {
    const res = await InstructorService.getYourClients();
    clientsCollection.value = res.data.collection;
    console.log(clientsCollection.value);
  } catch (err) {
    noCollection.value = true;
    showToastAndRedirect(
      "You don't have clients. You'll be redirected.",
      "instructorDashboard"
    );
    console.log(err);
  }
};

onUnmounted(() => {
  if (redirectTimer) clearTimeout(redirectTimer);
});

await getYourClinets();
let filteredClients = computed(() => {
  return filterBySingle(clientsCollection.value, search.value, "name");
});
</script>
<template>
  <div>
    <Toast class="top-[55px]" :is-toast-active="toastMsg" :toast-msg="toastMsg">
      <template #icon>
        <WarningIcon />
      </template>
    </Toast>
    <AllGymsSkeleton v-if="noCollection" />
    <div v-else class="w-full">
      <CoverImage :img-path="coverImg" title-text="Your Clients" />
      <SearchFilter
        v-model:inputValue="search"
        placeholder-val="Search employees..."
      />
      <GridContainer
        :collection="clientsCollection"
        :filtered-collection="filteredClients"
        grid-card-type="personType"
      >
        <template #card="slotProps">
          <ClientCard :item="slotProps.item" @refresh-data="getYourClinets" />
        </template>
      </GridContainer>
      <!-- <h1>{{ clientsCollection }}</h1> -->
    </div>
  </div>
</template>
