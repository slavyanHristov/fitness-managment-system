<script setup>
import { ref, inject } from "vue";
import ClientService from "@/services/API-calls/ClientService.js";
import Modal from "@/components/ui/Modal.vue";
import AddFoodToMeal from "@/components/ui/client-components/AddFoodToMeal.vue";
import RemoveIcon from "@/components/icons/RemoveIcon.vue";
import AddIcon from "@/components/icons/AddIcon.vue";

const props = defineProps(["item"]);
const emit = defineEmits(["refreshItems"]);

const mealId = ref(null);
const apiUrlPath = inject("apiUrlPath");

const isModalOpen = ref(false);

const addFood = (id) => {
  console.log("added " + id);
  mealId.value = id;
  isModalOpen.value = true;
};

const deleteAction = async (id) => {
  console.log("meal has food id:", id);
  try {
    const response = await ClientService.deleteFoodFromMeal(id);
    emit("refreshItems");
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};
</script>
<template>
  <div class="w-full mb-5">
    <Modal
      :open="isModalOpen"
      header-title="Add Food To Meal"
      :is-closable-modal="true"
      @close-modal="isModalOpen = !isModalOpen"
    >
      <AddFoodToMeal
        :meal-id="mealId"
        @refresh-items="emit('refreshItems')"
        @close-modal="isModalOpen = false"
      />
    </Modal>

    <div
      class="w-full px-6 py-2 rounded-t-lg bg-gradient-to-t from-primaryGreen to-accentGreen"
    >
      <h1
        class="text-3xl font-bold tracking-wider uppercase text-primaryDark font-poppins"
      >
        {{ props.item.meal_type.name }}
      </h1>
    </div>
    <table class="w-full border-collapse font-poppins">
      <thead>
        <tr class="font-bold text-center bg-primaryBgWhite dark:bg-accentDark">
          <th class="px-4 py-1"></th>
          <th class="px-4 py-1">Food Name</th>
          <th class="px-4 py-1">Quantity</th>
          <th class="px-4 py-1">Calories</th>
          <th class="px-4 py-1">#</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="food in props.item.food"
          :key="food.id"
          class="text-center bg-accentWhite dark:bg-testColor"
        >
          <td class="px-4 py-2">
            <img
              class="w-20 h-16"
              :src="apiUrlPath + food.food_info.image.path"
              alt=""
            />
          </td>
          <td class="px-4 py-2">{{ food.food_info.name }}</td>
          <td class="px-4 py-2">{{ food.quantity }}</td>
          <td class="px-4 py-2">{{ food.total_calories }}</td>
          <td class="px-4 py-2 cursor-pointer">
            <RemoveIcon
              class="text-red-500 transition-colors hover:text-red-400"
              @click="deleteAction(food.id)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <button
      class="flex items-center justify-center w-full gap-2 py-2 text-xl font-bold text-center uppercase rounded-b-lg group text-primaryDark bg-gradient-to-t from-primaryBlue to-accentBlue font-poppins"
      @click="addFood(props.item.id)"
    >
      <AddIcon class="transition-colors group-hover:text-primaryGreen" />
      <p class="tracking-wider">Add Food</p>
    </button>
  </div>
</template>
