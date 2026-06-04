<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { api } from "../services/clientes.service";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { setAuth } = useAuth();

const nombre = ref("");
const email = ref("");
const password = ref("");
const confirmar = ref("");
const mostrarPassword = ref(false);
const mostrarConfirmar = ref(false);
const error = ref("");
const cargando = ref(false);
const bgRef = ref<HTMLElement | null>(null);

let vantaEffect: VantaEffect | null = null;

onMounted(() => {
    if (bgRef.value && window.VANTA) {
        vantaEffect = window.VANTA.RINGS({
            el: bgRef.value,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            scale: 1,
            scaleMobile: 1,
            color: 0x88ff00,
            backgroundColor: 0x202428,
            backgroundAlpha: 1,
        });
    }
});

onBeforeUnmount(() => {
    vantaEffect?.destroy();
});

const registrarse = async () => {
    error.value = "";

    if (!nombre.value.trim() || !email.value.trim() || !password.value.trim()) {
        error.value = "Todos los campos son obligatorios";
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        error.value = "El formato del email no es válido";
        return;
    }

    if (password.value.length < 6) {
        error.value = "La contraseña debe tener al menos 6 caracteres";
        return;
    }

    if (password.value !== confirmar.value) {
        error.value = "Las contraseñas no coinciden";
        return;
    }

    cargando.value = true;

    try {
        const res = await api.post("/auth/registro", {
            nombre: nombre.value,
            email: email.value,
            password: password.value,
        });

        setAuth(res.data.token, res.data.usuario);
        router.push("/perfil");
    } catch (e: any) {
        error.value = e?.response?.data?.message ?? "Error al registrarse";
    } finally {
        cargando.value = false;
    }
};
</script>

<template>
    <div ref="bgRef" class="auth-bg">
        <div class="auth-card">
            <p class="brand">Gestor de Clientes</p>
            <h2>Crear cuenta</h2>

            <p v-if="error" class="msg-error">{{ error }}</p>

            <div class="field">
                <label>Nombre completo</label>
                <input v-model="nombre" placeholder="Ej: Juan García" />
            </div>

            <div class="field">
                <label>Email</label>
                <input v-model="email" type="email" placeholder="tu@email.com" />
            </div>

            <div class="field">
                <label>Contraseña</label>
                <div class="input-wrapper">
                    <input
                        v-model="password"
                        :type="mostrarPassword ? 'text' : 'password'"
                        placeholder="Mínimo 6 caracteres"
                    />
                    <button type="button" class="btn-eye" :title="mostrarPassword ? 'Ocultar' : 'Ver'" @click="mostrarPassword = !mostrarPassword">
                        <svg v-if="mostrarPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="field">
                <label>Confirmar contraseña</label>
                <div class="input-wrapper">
                    <input
                        v-model="confirmar"
                        :type="mostrarConfirmar ? 'text' : 'password'"
                        placeholder="Repite tu contraseña"
                        @keyup.enter="registrarse"
                    />
                    <button type="button" class="btn-eye" :title="mostrarConfirmar ? 'Ocultar' : 'Ver'" @click="mostrarConfirmar = !mostrarConfirmar">
                        <svg v-if="mostrarConfirmar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                </div>
            </div>

            <button class="btn-primary" :disabled="cargando" @click="registrarse">
                {{ cargando ? "Registrando..." : "Crear cuenta" }}
            </button>

            <p class="link-text">
                ¿Ya tienes cuenta?
                <router-link to="/login">Inicia sesión</router-link>
            </p>
        </div>
    </div>
</template>

<style scoped>
.auth-bg {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.auth-card {
    background: rgba(20, 28, 40, 0.78);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(136, 255, 0, 0.18);
    border-radius: 16px;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(136,255,0,0.06);
}

.brand {
    font-size: 0.82rem;
    font-weight: 700;
    color: #88ff00;
    text-align: center;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 0.35rem;
}

h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f1f5f9;
    text-align: center;
    margin-bottom: 1.75rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 1rem;
}

label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-wrapper input {
    width: 100%;
    padding-right: 44px;
}

input {
    padding: 11px 14px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    font-size: 0.95rem;
    outline: none;
    color: #f1f5f9;
    background: rgba(255,255,255,0.06);
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
}

input::placeholder { color: #475569; }

input:focus {
    border-color: #88ff00;
    box-shadow: 0 0 0 3px rgba(136, 255, 0, 0.15);
}

.btn-eye {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: #64748b;
    display: flex;
    align-items: center;
    transition: color 0.15s;
}

.btn-eye:hover { color: #88ff00; }

.btn-eye svg {
    width: 18px;
    height: 18px;
}

.btn-primary {
    width: 100%;
    padding: 12px;
    background: #88ff00;
    color: #111;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background 0.15s, transform 0.1s;
}

.btn-primary:hover:not(:disabled) {
    background: #aaff33;
    transform: translateY(-1px);
}

.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.msg-error {
    background: rgba(239, 68, 68, 0.15);
    color: #fca5a5;
    border: 1px solid rgba(239,68,68,0.3);
    padding: 0.6rem 1rem;
    border-radius: 8px;
    font-size: 0.88rem;
    margin-bottom: 1rem;
    text-align: center;
}

.link-text {
    text-align: center;
    margin-top: 1.25rem;
    font-size: 0.88rem;
    color: #64748b;
}

.link-text a { color: #88ff00; font-weight: 600; text-decoration: none; }
.link-text a:hover { text-decoration: underline; }
</style>
