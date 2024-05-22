<script lang="ts" setup>
import { ref } from "vue";
import { Plus } from "@element-plus/icons-vue";

import type { UploadUserFile } from "element-plus";

const fileList = ref<UploadUserFile[]>([]);
</script>
<template>
  <div class="pages">
    <h2 class="title">Telegraph-Image</h2>
    <el-upload
      multiple
      v-model:file-list="fileList"
      action="/upload"
      list-type="picture-card"
    >
      <el-icon><Plus /></el-icon>
      <template #file="{ file }">
        <div>
          <el-image
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt=""
            fit="cover"
            :preview-src-list="[file.url]"
          />
        </div>
      </template>
    </el-upload>
  </div>
  <div></div>
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
