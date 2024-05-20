<script setup lang="ts">
const uploadSuccess = (e: any) => {
  console.log(e);
};
</script>

<template>
  <div>
    <el-upload
      class="upload-demo"
      action="http://127.0.0.1:8788/upload"
      multiple
      :on-success="uploadSuccess"
    >
      <el-button type="primary">Click to upload</el-button>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500KB.
        </div>
      </template>
    </el-upload>
  </div>
</template>
