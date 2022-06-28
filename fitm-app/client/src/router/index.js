import {
  createRouter,
  createWebHistory
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import {
  useAuthStore
} from "@/stores/authStore";

// const guardAdminRoutes = (to, from, next) => {
//   const authStore = useAuthStore();
//   if (authStore.isUserLoggedIn && authStore.getCurrentUser["userType"] === 1) {
//     next();
//   } else if (
//     authStore.isUserLoggedIn &&
//     authStore.getCurrentUser["userType"] === 2
//   ) {
//     next();
//   } else {
//     next({
//       name: "home",
//     });
//     return;
//   }
// };

const routeGuards = {
  guardRegisterLoginRoute(to, from, next) {
    const authStore = useAuthStore();
    const isUserLoggedIn = authStore.isUserLoggedIn;
    if (!isUserLoggedIn) {
      next();
    } else {
      next({
        name: "home"
      })
    }
  }
}

const routes = [{
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "login",
    beforeEnter: routeGuards.guardRegisterLoginRoute,
    component: () => import("@/views/SignInView.vue"),
  },
  {
    path: "/register",
    name: "register",
    beforeEnter: routeGuards.guardRegisterLoginRoute,
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/password-reset",
    name: "passwordReset",
    beforeEnter: (to, from, next) => {
      if (to.query.token && to.query.id) {
        next()
      } else {
        next({
          name: 'home'
        })
      }
    },
    component: () => import("@/views/PasswordResetView.vue")
  },
  {
    path: "/admin/dashboard",
    name: "adminDashboard",
    // beforeEnter: guardAdminRoutes,
    component: () => import("@/views/admin/AdminDashboard.vue"),
    meta: {
      requiresAuth: true,
      userType: [1],
    },
  },
  {
    path: "/admin/register/manager",
    name: "registerManager",
    // beforeEnter: guardAdminRoutes,
    component: () => import("@/views/admin/RegisterManager.vue"),
    meta: {
      requiresAuth: true,
      userType: [1],
    },
  },
  {
    path: "/admin/register/gym",
    name: "addGym",
    component: () => import("@/views/admin/AddGym.vue"),
    meta: {
      requiresAuth: true,
      userType: [1],
    },
  },
  {
    path: "/manager/dashboard",
    name: "managerDashboard",
    // beforeEnter: guardManagerRoutes,
    component: () => import("@/views/manager/ManagerDashboard.vue"),
    meta: {
      requiresAuth: true,
      userType: [2],
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("@/views/PageNotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return (
      savedPosition || {
        top: 0,
      }
    );
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  let currentUser = authStore.getCurrentUser

  if (to.meta.requiresAuth) {
    if (to.meta?.userType?.includes(currentUser?.["userType"])) {
      next()
    } else {
      next({
        name: 'home'
      })
    }
  } else {
    next();
  }

});

export default router;