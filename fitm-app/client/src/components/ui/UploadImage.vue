<script setup>
import { ref } from "vue";

const props = defineProps(["labelText", "vuelidateErrors", "inputName"]);
const emit = defineEmits(["selectedImages"]);

const currentImage = ref(null);
const previewImage = ref(null);

const selectImage = (event) => {
  console.log(event);
  currentImage.value = event.target.files;
  emit("selectedImages", currentImage.value);
  // previewImage.value = URL.createObjectURL(event.target.files[0]);
  // progress.value = 0;
  // message.value = "";
};

// const upload = () => {
//   progress.value = 0;
//   UploadImageService.uploadGymImage(currentImage.value, (event) => {
//     progress.value = Math.round((100 * event.loaded) / event.total);
//   });
//   // .then((response) => {
//   //   message.value = response.data.message;
//   //   return UploadService.getFiles();
//   // })
//   // .then((images) => {
//   //   imageInfos.value = images.data;
//   // })
//   // .catch((err) => {
//   //   progress.value = 0;
//   //   message.value = "Could not upload the image! " + err;
//   //   currentImage.value = null;
//   // });
// };
</script>

<template>
  <div class="pt-4">
    <label
      class="inline-block mb-1 text-sm font-inter"
      :for="props.inputName"
      >{{ props.labelText }}</label
    >
    <input
      ref="multiFiles"
      class="block w-full text-sm file:transition-all file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-primaryBlue hover:file:bg-accentBlue"
      :class="{
        'text-red-500 file:border-2 file:border-red-500':
          props.vuelidateErrors?.length,
      }"
      type="file"
      :name="props.inputName"
      multiple
      accept="image/*"
      @change="selectImage"
    />
    <!-- <button @click="upload">Upload</button> -->
    <div v-if="previewImage"><img :src="previewImage" alt="myImg" /></div>
    <div
      v-for="error in props.vuelidateErrors"
      :key="error.$uid"
      class="text-xs text-red-500 font-inter"
    >
      {{ error.$message }}
    </div>
  </div>
</template>
