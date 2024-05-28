<script lang="ts" setup>
import Tabs from "./components/Tabs.vue";
</script>

<template>
  <div class="pages">
    <el-container>
      <el-header class="header">
        <h2>alive</h2>
        <el-button type="primary" plain>退出登录</el-button>
      </el-header>
      <el-main class="main">
        <el-tabs model-value="all" class="tabs">
          <el-tab-pane class="content" label="全部" name="all">
            <Tabs type="2"></Tabs>
          </el-tab-pane>
          <el-tab-pane lazy label="未审核" name="unaudited">
            <Tabs type="0"></Tabs>
          </el-tab-pane>
          <el-tab-pane lazy label="已通过" name="passed">
            <Tabs type="1"></Tabs>
          </el-tab-pane>
          <el-tab-pane lazy label="未通过" name="fail">
            <Tabs type="-1"></Tabs>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
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
.main {
  height: 100%;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.tabs {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
  overflow-y: hidden;
}

:deep(.el-tabs__content) {
  flex: 1;
  overflow-y: hidden;
  display: flex;
}
</style>
