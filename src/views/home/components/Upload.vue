<script lang="ts" setup>
import { reactive, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";

import type { UploadUserFile } from "element-plus";

const imageViewer = reactive({
  visible: false,
  url: "",
});
const handlePictureCardPreview = (uploadFile: UploadUserFile) => {
  imageViewer.url = uploadFile.url!;
  imageViewer.visible = true;
};
const fileList = ref<UploadUserFile[]>([]);
// const fileList = ref<UploadUserFile[]>([
//   {
//     name: "0",
//     url: "	https://upload.aliveawait.top/file/44a04225751a7fc96d593.jpg",
//   },
// ]);
</script>
<template>
  <div class="pages">
    <h2 class="title">Telegraph-Image</h2>
    <el-upload
      multiple
      v-model:file-list="fileList"
      action="https://upload.aliveawait.top/upload"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
  </div>
  <template v-if="imageViewer.visible">
    <el-image-viewer
      :urlList="[imageViewer.url]"
      @close="() => (imageViewer.visible = false)"
    >
    </el-image-viewer>
  </template>
</template>
<style scoped lang="scss">
.pages {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-top: 14vh;
}
.title {
  text-align: center;
  color: rgb(51, 11, 84);
}
</style>
