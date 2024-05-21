<script lang="ts" setup>
import { ref } from "vue";
import { Plus } from "@element-plus/icons-vue";

import type { UploadProps, UploadUserFile } from "element-plus";

const fileList = ref<UploadUserFile[]>([]);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
</script>
<template>
  <div class="pages">
    <h2 class="title">Telegraph-Image</h2>
    <el-upload
      v-model:file-list="fileList"
      action="/upload"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
  </div>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
<style scoped>
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
}
</style>
