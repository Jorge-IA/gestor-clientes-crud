import { ref, computed } from "vue";
import type { Usuario } from "../types/usuario";

const token = ref<string | null>(localStorage.getItem("token"));
const usuario = ref<Usuario | null>(
    JSON.parse(localStorage.getItem("usuario") ?? "null")
);

export function useAuth() {
    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => usuario.value?.rol === "ADMIN");

    const setAuth = (newToken: string, newUsuario: Usuario) => {
        token.value = newToken;
        usuario.value = newUsuario;
        localStorage.setItem("token", newToken);
        localStorage.setItem("usuario", JSON.stringify(newUsuario));
    };

    const logout = () => {
        token.value = null;
        usuario.value = null;
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
    };

    return { token, usuario, isAuthenticated, isAdmin, setAuth, logout };
}
