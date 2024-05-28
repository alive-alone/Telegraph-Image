<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-message-box.css";
import { useLoading } from "@/hooks/useLoading";

const props = defineProps({
  type: {
    type: String,
    default: "1",
  },
});

const datas = ref([]) as Ref<
  Array<{ name: string; metadata: { verify: string } }>
>;
/*
[
  {
    name: "https://upload.aliveawait.top/file/3fc38a87db675bb10faf9.jpg",
    metadata: { verify: "0" },
  },
  {
    name: "https://upload.aliveawait.top/file/44a04225751a7fc96d593.jpg",
    metadata: { verify: "0" },
  },
  {
    name: "https://upload.aliveawait.top/file/3c19bfbed54e17a8cf3e7.jpg",
    metadata: { verify: "0" },
  },
]
*/
const imgListRef = ref();
const activeIndex = props.type;

const checkAll = ref(false);
const isIndeterminate = ref(false);
const checkedId = ref([]) as Ref<Array<string>>;

const Loading = useLoading();
const uploadLoading = ref(false);

const getList = (type: string) => {
  fetch(`../api/list?type=${type}`, {
    method: "GET",
    redirect: "follow",
    credentials: "include",
  })
    .then((response) => {
      if (response.status == 401) {
        alert("请先登录");
        window.location.href = "../api/login";
      } else {
        return response;
      }
    })
    .then((res) => res?.text())
    .then((res) => {
      res && (datas.value = JSON.parse(res));
    })
    .catch((err) => {
      console.error(err);
      ElMessage({
        type: "error",
        message: "获取数据失败",
      });
    });
};

const uploadList = async () => {
  uploadLoading.value = true;
  await getList(activeIndex);
  uploadLoading.value = false;
  ElMessage({
    type: "success",
    message: "刷新成功",
  });
};

const confirm = (type: string, id?: string) => {
  const centent =
    type == "1" ? "确定该图片通过审核？" : "确定该图片不通过审核？";
  ElMessageBox.confirm(centent, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      Loading.showLoading({ text: "请求中" });
      if (id) {
        fetch(`../api/verify/${id}?type=${type}`, {
          method: "GET",
          redirect: "follow",
          credentials: "include",
        })
          .then((res) => {
            console.log(res);
            if (res.status == 200) {
              ElMessage({
                type: "success",
                message: "审核成功",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            ElMessage({
              type: "error",
              message: "审核失败",
            });
          })
          .finally(() => {
            Loading.hideLoading();
          });
      } else {
        const data = {
          list: checkedId.value,
          type: type,
        };
        fetch(`../api/verify`, {
          method: "POST",
          redirect: "follow",
          credentials: "include",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (res.status == 200) {
              ElMessage({
                type: "success",
                message: "审核成功",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            ElMessage({
              type: "error",
              message: "审核失败",
            });
          })
          .finally(() => {
            Loading.hideLoading();
          });
      }
    })
    .catch(() => {
      // catch error
    });
};

const copyImgPath = (name: string) => {
  const path = `${document.location.origin}/file/${name}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(path);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = name;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
  ElMessage({
    type: "success",
    message: "已复制到剪切板",
  });
};

const handleCheckAllChange = (val: boolean) => {
  checkedId.value = val ? datas.value.map((item) => item.name) : [];
  isIndeterminate.value = false;
};
const handleCheckedIdChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === datas.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < datas.value.length;
};

onMounted(() => {
  getList(activeIndex);
});
</script>

<template>
  <div class="pages">
    <div class="content" v-if="datas.length > 0">
      <div class="control-box">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <div>
          <el-button
            color="#626aef"
            plain
            @click="uploadList"
            :loading="uploadLoading"
            >刷新</el-button
          >
          <el-button
            :disabled="checkedId.length < 1"
            type="success"
            plain
            @click="confirm('1')"
            >通过</el-button
          >
          <el-button
            :disabled="checkedId.length < 1"
            type="danger"
            plain
            @click="confirm('-1')"
            >不通过</el-button
          >
        </div>
      </div>
      <el-checkbox-group
        v-model="checkedId"
        @change="handleCheckedIdChange"
        size="large"
        class="checkbox-group"
      >
        <div class="img-list-box" ref="imgListRef">
          <div
            class="img-item grid-item"
            v-for="item in datas"
            :key="item.name"
          >
            <!-- <el-image
                  class="image"
                  :src="item.name"
                  lazy
                  fit="cover"
                  :preview-src-list="[item.name]"
                  hide-on-click-modal
                /> -->
            <el-image
              class="image"
              :src="'/file/' + item.name"
              lazy
              fit="cover"
              :preview-src-list="['/file/' + item.name]"
              hide-on-click-modal
            />
            <div class="image-control">
              <div class="btn-box">
                <el-button
                  :disabled="item.metadata.verify == '1'"
                  type="success"
                  plain
                  @click="confirm('1', item.name)"
                  >通过</el-button
                >
                <el-button
                  :disabled="item.metadata.verify == '-1'"
                  type="danger"
                  plain
                  @click="confirm('-1', item.name)"
                  >不通过</el-button
                >
              </div>
            </div>
            <el-button
              color="#626aef"
              class="copy-btn"
              plain
              @click="copyImgPath(item.name)"
              >复制链接</el-button
            >
            <el-checkbox class="checkbox" label="" :value="item.name">
            </el-checkbox>
          </div>
        </div>
      </el-checkbox-group>
    </div>
    <div class="no-content-box" v-else>
      <el-empty :image-size="200" />
    </div>
  </div>
  <div></div>
</template>

<style scoped lang="scss">
.pages {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}

.content {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: hidden;
}
.control-box {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}
.checkbox-group {
  flex: 1;
  overflow: hidden;
}
.img-list-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: scroll;
  .img-item {
    // box-sizing: border-box;
    width: 315px;
    height: 420px;
    margin: 5px;
    position: relative;
    .image {
      width: 315px;
      height: 420px;
    }
  }
}
.image-control {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  .btn-box {
    padding: 20px 20%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(115, 115, 115, 0) 100%
    );
  }
}
.copy-btn {
  position: absolute;
  top: 4px;
  left: 4px;
  font-size: 12px;
  opacity: 0.8;
}
.checkbox {
  position: absolute;
  top: 4px;
  right: 4px;
}
.no-content-box {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10vh;
  .no-content {
    font-size: 64px;
    letter-spacing: 10px;
    color: rgb(219, 219, 219);
  }
}
</style>
