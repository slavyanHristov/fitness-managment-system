<script setup>
import { inject } from "vue";
import NotFoundResource from "@/components/ui/NotFoundResource.vue";
const apiUrlPath = inject("apiUrlPath");
const props = defineProps(["collection", "headerCollection", "length"]);

const fitleredAttributes = (item) => {
  const { id, image, fitness_instructor, userId, imageId, ...rest } = item;
  return rest;
};

const displayImg = (item) => {
  if (item.image) {
    return apiUrlPath + item.image.path;
  }
  return "../src/assets/images/employee-picture.png";
};
</script>
<template>
  <main>
    <div v-if="props.collection">
      <div v-if="props.collection.length > 0" class="grid w-full overflow-auto">
        <table class="border-collapse">
          <thead>
            <tr
              class="text-sm font-bold text-center border-b-4 dark:border-accentDark bg-darkerWhite dark:bg-accentDark"
            >
              <th class="rounded-l-lg"></th>
              <th
                v-for="(header, index) in props.headerCollection"
                :key="index"
                class="px-4 py-1 last:rounded-r-lg"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in props.collection"
              :key="item.id"
              class="text-sm border-b-4 last:border-none solid dark:border-accentDark bg-darkerWhite dark:bg-primaryGray"
            >
              <td class="py-2.5 rounded-l-lg">
                <img
                  class="w-12 h-12 mx-auto rounded-full"
                  :src="displayImg(item)"
                  alt="User Image"
                />
              </td>
              <td
                v-for="key in fitleredAttributes(item)"
                :key="key.id"
                class="py-2.5 last:rounded-r-lg"
              >
                <p class="text-center">{{ key }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <NotFoundResource title="No result" />
      </div>
    </div>
  </main>
</template>
