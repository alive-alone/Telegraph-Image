<script lang="ts" setup>
import { ref } from "vue";

const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  getList(key);
};
const getList = (type: string) => {
  fetch(`../api/list?type=${type}`, {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  });
};
</script>

<template>
  <div class="pages">
    <el-container>
      <el-header class="header">
        <h2>alive</h2>
        <el-button type="primary" plain>退出登录</el-button>
      </el-header>
      <el-main>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="2">全部</el-menu-item>
          <el-menu-item index="0">未审核</el-menu-item>
          <el-menu-item index="1">已通过</el-menu-item>
          <el-menu-item index="-1">未通过</el-menu-item>
        </el-menu>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.pages {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 2vh 6vw;
}
.el-container {
  height: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
