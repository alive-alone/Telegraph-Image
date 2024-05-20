import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/home/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/admin/Admin.vue"),
    },
  ],
});

export default router;
