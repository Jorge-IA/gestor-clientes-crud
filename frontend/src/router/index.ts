import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AdminView from "../views/AdminView.vue";
import PerfilView from "../views/PerfilView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/login", component: LoginView },
        { path: "/registro", component: RegisterView },
        {
            path: "/admin",
            component: AdminView,
            meta: { requiresAdmin: true },
        },
        {
            path: "/perfil",
            component: PerfilView,
            meta: { requiresAuth: true },
        },
        {
            path: "/",
            redirect: () => {
                const usuario = JSON.parse(localStorage.getItem("usuario") ?? "null");
                if (!usuario) return "/login";
                return usuario.rol === "ADMIN" ? "/admin" : "/perfil";
            },
        },
    ],
});

router.beforeEach((to) => {
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario") ?? "null");

    if (!token && (to.meta.requiresAuth || to.meta.requiresAdmin)) {
        return "/login";
    }

    if (token && to.meta.requiresAdmin && usuario?.rol !== "ADMIN") {
        return "/perfil";
    }

    if (token && (to.path === "/login" || to.path === "/registro")) {
        return usuario?.rol === "ADMIN" ? "/admin" : "/perfil";
    }
});

export default router;
