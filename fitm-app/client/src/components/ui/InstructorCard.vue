<script setup>
import { inject, ref } from "vue";
import ClientService from "@/services/API-calls/ClientService";
// import Modal from "@/components/ui/Modal.vue";
// import EditEmployee from "@/components/ui/EditEmployee.vue";
const props = defineProps(["item"]);
const emit = defineEmits(["refreshEmployees"]);
const apiUrlPath = inject("apiUrlPath");

// const isModalOpen = ref(false);

// const displayImg = () => {
//   if (props.item.fitness_instructor)
//     return apiUrlPath + props.item.fitness_instructor.user.image.path;

//   return "../src/assets/images/gym_pic1.avif";
// };
const hireInstructor = async () => {
  try {
    // const res = await ClientService.validateMembership();
    // console.log("Response 1:", res);
    const res2 = await ClientService.setInstructor(props.item.id);
    console.log("Response 2: ", res2);
  } catch (err) {
    console.log(err);
  }
};
</script>

<template>
  <div
    v-if="props.item"
    id="container"
    class="h-full overflow-hidden rounded shadow-lg bg-testColor w-80"
  >
    <div id="inner">
      <div id="header">
        <img
          class="object-cover w-full max-h-48"
          :src="apiUrlPath + props.item.fitness_instructor.user.image.path"
          alt="gym image"
        />
      </div>
      <div id="content">
        <h3>{{ props.item.name }}</h3>
        <p>{{ props.item.gym.name }}</p>
      </div>
      <div id="footer">
        <button @click="hireInstructor">Hire</button>
      </div>
    </div>
  </div>
</template>
