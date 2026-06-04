<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "./composables/useAuth";
import { useTheme } from "./composables/useTheme";

const router = useRouter();
const { usuario, isAuthenticated, isAdmin, logout } = useAuth();
const { theme, toggle } = useTheme();

const cerrarSesion = () => {
    logout();
    router.push("/login");
};
</script>

<template>
    <div>
        <nav v-if="isAuthenticated" class="navbar">
            <div class="nav-inner">
                <span class="nav-brand">Gestor de Clientes</span>

                <div class="nav-right">
                    <router-link v-if="isAdmin" to="/admin" class="nav-link">
                        Panel Admin
                    </router-link>
                    <router-link to="/perfil" class="nav-link">
                        Mi Perfil
                    </router-link>

                    <div class="nav-user">
                        <span class="user-avatar">{{ usuario?.nombre?.charAt(0).toUpperCase() }}</span>
                        <span class="user-name">{{ usuario?.nombre }}</span>
                    </div>

                    <button class="btn-theme" :title="theme === 'dark' ? 'Modo claro' : 'Modo oscuro'" @click="toggle">
                        {{ theme === "dark" ? "☀️" : "🌙" }}
                    </button>

                    <button class="btn-logout" @click="cerrarSesion">Salir</button>
                </div>
            </div>
        </nav>

        <main :class="{ 'main-content': isAuthenticated }">
            <router-view />
        </main>
    </div>
</template>

<style scoped>
.navbar {
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: background 0.25s, border-color 0.25s;
}

.nav-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1rem;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.nav-brand {
    font-weight: 700;
    font-size: 1rem;
    color: var(--accent);
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.nav-link {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 6px;
    transition: background 0.15s;
}

.nav-link:hover {
    background: var(--bg-hover);
}

.nav-link.router-link-active {
    color: var(--accent);
    background: var(--accent-bg);
}

.nav-user {
    display: flex;
    align-items: center;
    gap: 8px;
}

.user-avatar {
    width: 32px;
    height: 32px;
    background: var(--accent-bg);
    color: var(--accent-text);
    border-radius: 50%;
    font-size: 0.85rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-name {
    font-size: 0.88rem;
    color: var(--text-secondary);
    font-weight: 500;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.btn-theme {
    width: 36px;
    height: 36px;
    background: var(--bg-hover);
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
}

.btn-theme:hover {
    background: var(--border);
}

.btn-logout {
    padding: 6px 14px;
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
}

.btn-logout:hover {
    background: var(--danger-bg);
    color: var(--danger);
    border-color: var(--danger-border);
}

.main-content {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1rem;
}
</style>
