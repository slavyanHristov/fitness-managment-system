import API from "@/services/axios-instances/API";

class UploadImageService {
  upload(file, onUploadProgress) {
    let formData = new FormData();
    formData.append("file", file);
    API().post("/image/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }
  uploadGymImage(file, onUploadProgress) {
    let formData = new FormData();
    console.log(typeof file);
    Object.values(file).forEach((element) => {
      formData.append("multiFiles", element);
    });
    // formData.append("multiFiles", file[0]);
    // formData.append("multiFiles", file[1]);
    // formData.append("multiFiles", file[3]);
    formData.append("gymId", 1);
    for (let data of formData) {
      console.log(data);
    }
    API().post("/image/uploadGymImage", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }
  getImages() {
    return API().get("/image/getImages");
  }
  getGymImages() {
    return API().get("/image/getAllImagesForGym/1");
  }
}

export default new UploadImageService();
