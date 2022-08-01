import { defineStore } from "pinia";
import UserService from "@/services/API-calls/UserService";

export const useImgStore = defineStore({
  id: "imgStore",
  state: () => ({
    imgPath: null,
  }),
  getters: {
    getImg: (state) => {
      return state.imgPath;
    },
  },
  actions: {
    setImg(newImgPath) {
      this.imgPath = newImgPath;
    },
    async getImageAsync() {
      try {
        const res = await UserService.getUserImage();
        return Promise.resolve(res.data.userImage.image.path);
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
});
