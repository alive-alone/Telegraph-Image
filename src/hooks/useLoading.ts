import { ElLoading } from "element-plus";
import "element-plus/theme-chalk/el-loading.css";

export const useLoading = () => {
  let Loading: any;
  const showLoading = (params: {
    lock?: boolean;
    text?: string;
    body?: boolean;
    fullscreen?: boolean;
  }) => {
    const {
      lock = true,
      text = "Loading",
      body = true,
      fullscreen = true,
    } = params;
    Loading = ElLoading.service({
      lock,
      text,
      body,
      fullscreen,
    });
  };
  const hideLoading = () => {
    Loading && Loading.close();
  };
  return { showLoading, hideLoading };
};
