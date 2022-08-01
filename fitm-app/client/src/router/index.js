import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "@/stores/authStore";

const routeGuards = {
  guardRegisterLoginRoute(to, from, next) {
    const authStore = useAuthStore();
    const isUserLoggedIn = authStore.isUserLoggedIn;
    if (!isUserLoggedIn) {
      next();
    } else {
      next({
        name: "home",
      });
    }
  },
  guardPaymentRoutes(to, from, next) {
    const authStore = useAuthStore();
    if (authStore.isCurrentUserClient) {
      next();
    } else {
      next({
        name: "home",
      });
    }
  },
};

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/gyms",
    name: "gymsView",
    component: () => import("@/views/AllGymsView.vue"),
  },
  {
    path: "/instructors",
    name: "instructorsView",
    component: () => import("@/views/AllInstructorsView.vue"),
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
    path: "/admin/register",
    name: "register",
    beforeEnter: routeGuards.guardRegisterLoginRoute,
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/register",
    name: "registerClient",
    beforeEnter: routeGuards.guardRegisterLoginRoute,
    component: () => import("@/views/ClientRegistrationView.vue"),
  },
  {
    path: "/password-reset",
    name: "passwordReset",
    beforeEnter: (to, from, next) => {
      if (to.query.token && to.query.id) {
        next();
      } else {
        next({
          name: "home",
        });
      }
    },
    component: () => import("@/views/PasswordResetView.vue"),
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
    component: () => import("@/views/admin/AddGymView.vue"),
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
    path: "/manager/employees",
    name: "employeesView",
    // beforeEnter: guardManagerRoutes,
    component: () => import("@/views/manager/AllEmployeesView.vue"),
    meta: {
      requiresAuth: true,
      userType: [2],
    },
  },
  {
    path: "/manager/register/instructor",
    name: "registerInstructor",
    component: () => import("@/views/manager/RegisterInstructorView.vue"),
    meta: {
      requiresAuth: true,
      userType: [2],
    },
  },
  {
    path: "/manager/register/employee",
    name: "registerEmployee",
    component: () => import("@/views/manager/RegisterEmployeeView.vue"),
    meta: {
      requiresAuth: true,
      userType: [2],
    },
  },
  {
    path: "/instructor/dashboard",
    name: "instructorDashboard",
    // beforeEnter: guardManagerRoutes,
    component: () => import("@/views/instructor/InstructorDashboard.vue"),
    meta: {
      requiresAuth: true,
      userType: [3],
    },
  },
  {
    path: "/instructor/create/routine",
    name: "createRoutine",
    // beforeEnter: guardManagerRoutes,
    component: () => import("@/views/instructor/CreateRoutineView.vue"),
    meta: {
      requiresAuth: true,
      userType: [3],
    },
  },
  {
    path: "/instructor/clients",
    name: "yourClients",
    component: () => import("@/views/instructor/YourClientsView.vue"),
    meta: {
      requiresAuth: true,
      userType: [3],
    },
  },
  {
    path: "/instructor/routine/:id(\\d+)",
    name: "routine",
    // beforeEnter: guardManagerRoutes,
    component: () => import("@/views/instructor/RoutineView.vue"),
    meta: {
      requiresAuth: true,
      userType: [3],
    },
  },
  {
    path: "/instructor/mealPlan",
    name: "mealPlan",
    // beforeEnter: guardManagerRoutes,
    component: () => import("@/views/instructor/TestMealPlan.vue"),
    meta: {
      requiresAuth: true,
      userType: [3],
    },
  },
  {
    path: "/client/dashboard",
    name: "clientDashboard",
    // beforeEnter: guardManagerRoutes,
    component: () => import("@/views/user/ClientDashboard.vue"),
    meta: {
      requiresAuth: true,
      userType: [4],
    },
  },
  {
    path: "/gyms/membership/:id(\\d+)",
    name: "gymMembership",
    // beforeEnter: guardManagerRoutes,
    component: () => import("@/views/user/GymMembershipView.vue"),
    meta: {
      requiresAuth: true,
      userType: [4],
    },
  },
  {
    path: "/client/membership",
    name: "clientMembership",
    // beforeEnter: guardManagerRoutes,
    component: () => import("@/views/user/MembershipView.vue"),
    meta: {
      requiresAuth: true,
      userType: [4],
    },
  },
  {
    path: "/client/routine",
    name: "clientRoutine",
    // beforeEnter: guardManagerRoutes,
    component: () => import("@/views/user/ClientRoutineView.vue"),
    meta: {
      requiresAuth: true,
      userType: [4],
    },
  },
  {
    path: "/client/mealPlan",
    name: "clientMealPlan",
    // beforeEnter: guardManagerRoutes,
    component: () => import("@/views/user/ClientMealPlanView.vue"),
    meta: {
      requiresAuth: true,
      userType: [4],
    },
  },
  {
    path: "/my-profile",
    name: "myProfile",
    // beforeEnter: guardManagerRoutes,
    component: () => import("@/views/MyProfileView.vue"),
    meta: {
      requiresAuth: true,
      userType: [1, 2, 3, 4],
    },
  },
  {
    path: "/gyms/:id(\\d+)",
    name: "gym",
    component: () => import("@/views/GymView.vue"),
  },
  {
    path: "/success",
    name: "paymentComplete",
    beforeEnter: routeGuards.guardPaymentRoutes,
    component: () => import("@/views/PaymentComplete.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("@/views/errors/PageNotFound.vue"),
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
  let currentUser = authStore.getCurrentUser;

  if (to.meta.requiresAuth) {
    if (to.meta?.userType?.includes(currentUser?.["userType"])) {
      next();
    } else {
      next({
        name: "login",
      });
    }
  } else {
    next();
  }
});

export default router;
