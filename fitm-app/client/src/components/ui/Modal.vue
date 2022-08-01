<script setup>
import CloseIcon from "../icons/CloseIcon.vue";
const props = defineProps(["open", "headerTitle", "isClosableModal"]);
defineEmits(["closeModal"]);
</script>

<template>
  <div>
    <Transition>
      <div v-if="props.open" id="modal" class="relative z-50">
        <div
          id="modal-background"
          class="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-darkenedColor"
          @click.self="props.isClosableModal ? $emit('closeModal') : null"
        >
          <div
            id="modal-content"
            class="relative bg-white rounded-md shadow outline-none darkMode-colors lightMode-colors"
          >
            <div
              id="modal-header"
              class="flex items-start justify-between p-4 border-b rounded-t"
            >
              <h3 class="text-xl font-semibold">{{ props.headerTitle }}</h3>
              <button v-if="props.isClosableModal" @click="$emit('closeModal')">
                <CloseIcon />
              </button>
            </div>
            <div class="p-6 space-y-6">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.15s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
