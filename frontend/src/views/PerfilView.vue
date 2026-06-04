<script setup lang="ts">
import { ref, watch } from "vue";
import { api } from "../services/clientes.service";
import { useAuth } from "../composables/useAuth";

const { usuario, setAuth, token } = useAuth();

const nombre = ref(usuario.value?.nombre ?? "");
const email = ref(usuario.value?.email ?? "");
const password = ref("");
const confirmar = ref("");
const errores = ref<Record<string, string>>({});
const exito = ref(false);
const cargando = ref(false);

watch(usuario, (u) => {
    nombre.value = u?.nombre ?? "";
    email.value = u?.email ?? "";
});

const validar = (): boolean => {
    errores.value = {};

    if (!nombre.value.trim()) errores.value.nombre = "El nombre es obligatorio";

    if (!email.value.trim()) {
        errores.value.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errores.value.email = "El formato del email no es válido";
    }

    if (password.value && password.value.length < 6) {
        errores.value.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (password.value && password.value !== confirmar.value) {
        errores.value.confirmar = "Las contraseñas no coinciden";
    }

    return Object.keys(errores.value).length === 0;
};

const guardar = async () => {
    if (!validar()) return;

    cargando.value = true;
    exito.value = false;

    try {
        const datos: Record<string, string> = {
            nombre: nombre.value,
            email: email.value,
        };
        if (password.value) datos.password = password.value;

        const res = await api.put("/usuarios/me", datos);

        setAuth(token.value!, { ...res.data });

        password.value = "";
        confirmar.value = "";
        exito.value = true;
        setTimeout(() => (exito.value = false), 3000);
    } catch (e: any) {
        errores.value.api = e?.response?.data?.message ?? "Error al guardar";
    } finally {
        cargando.value = false;
    }
};
</script>

<template>
    <div class="perfil-page">
        <div class="perfil-card">
            <div class="avatar">{{ usuario?.nombre?.charAt(0).toUpperCase() }}</div>
            <h2>Mi Perfil</h2>
            <span class="rol-badge" :class="usuario?.rol === 'ADMIN' ? 'rol-admin' : 'rol-user'">
                {{ usuario?.rol === "ADMIN" ? "Administrador" : "Usuario" }}
            </span>

            <p v-if="errores.api" class="msg-error">{{ errores.api }}</p>
            <p v-if="exito" class="msg-exito">¡Perfil actualizado correctamente!</p>

            <div class="form">
                <div class="field">
                    <label>Nombre completo</label>
                    <input v-model="nombre" :class="{ 'input-error': errores.nombre }" />
                    <span v-if="errores.nombre" class="error-txt">{{ errores.nombre }}</span>
                </div>

                <div class="field">
                    <label>Email</label>
                    <input v-model="email" type="email" :class="{ 'input-error': errores.email }" />
                    <span v-if="errores.email" class="error-txt">{{ errores.email }}</span>
                </div>

                <div class="divider">Cambiar contraseña <span>(opcional)</span></div>

                <div class="field">
                    <label>Nueva contraseña</label>
                    <input
                        v-model="password"
                        type="password"
                        placeholder="Dejar en blanco para no cambiar"
                        :class="{ 'input-error': errores.password }"
                    />
                    <span v-if="errores.password" class="error-txt">{{ errores.password }}</span>
                </div>

                <div class="field">
                    <label>Confirmar contraseña</label>
                    <input
                        v-model="confirmar"
                        type="password"
                        placeholder="Repite la nueva contraseña"
                        :class="{ 'input-error': errores.confirmar }"
                    />
                    <span v-if="errores.confirmar" class="error-txt">{{ errores.confirmar }}</span>
                </div>

                <button class="btn-guardar" :disabled="cargando" @click="guardar">
                    {{ cargando ? "Guardando..." : "Guardar cambios" }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.perfil-page {
    display: flex;
    justify-content: center;
    padding: 2rem 1rem;
}

.perfil-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 480px;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: background 0.25s, border-color 0.25s;
}

.avatar {
    width: 64px;
    height: 64px;
    background: var(--accent-bg);
    color: var(--accent-text);
    border-radius: 50%;
    font-size: 1.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
}

h2 {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.rol-badge {
    font-size: 0.78rem;
    font-weight: 600;
    border-radius: 999px;
    padding: 3px 12px;
    margin-bottom: 1.5rem;
}

.rol-admin {
    background: #fef3c7;
    color: #92400e;
}

.rol-user {
    background: var(--edit-bg);
    color: var(--edit);
}

[data-theme="dark"] .rol-admin {
    background: #422006;
    color: #fbbf24;
}

.form {
    width: 100%;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 1rem;
}

label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

input {
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.95rem;
    outline: none;
    color: var(--text-primary);
    background: var(--bg-input);
    transition: border-color 0.15s, box-shadow 0.15s, background 0.25s;
}

input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}

input.input-error {
    border-color: var(--danger);
}

.error-txt {
    font-size: 0.78rem;
    color: var(--danger);
}

.divider {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-top: 1px solid var(--border-light);
    padding-top: 1rem;
    margin-bottom: 1rem;
}

.divider span {
    font-weight: 400;
    text-transform: none;
    color: var(--text-faint);
}

.btn-guardar {
    width: 100%;
    padding: 12px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background 0.15s;
}

.btn-guardar:hover:not(:disabled) {
    background: var(--accent-h);
}

.btn-guardar:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.msg-error {
    background: var(--error-bg);
    color: var(--error-text);
    padding: 0.6rem 1rem;
    border-radius: 8px;
    font-size: 0.88rem;
    margin-bottom: 1rem;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
}

.msg-exito {
    background: var(--success-bg);
    color: var(--success-text);
    padding: 0.6rem 1rem;
    border-radius: 8px;
    font-size: 0.88rem;
    margin-bottom: 1rem;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
}
</style>
