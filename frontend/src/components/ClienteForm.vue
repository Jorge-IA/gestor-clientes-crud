<script setup lang="ts">
import { ref, watch } from "vue";
import { api } from "../services/clientes.service";
import type { Cliente } from "../types/cliente";

const props = defineProps<{
    cliente: Cliente | null;
}>();

const emit = defineEmits<{
    clienteCreado: [];
    cancelar: [];
}>();

const nombre_completo = ref("");
const email = ref("");
const telefono = ref("");
const empresa = ref("");
const errores = ref<Record<string, string>>({});

watch(
    () => props.cliente,
    (cliente) => {
        nombre_completo.value = cliente?.nombre_completo ?? "";
        email.value = cliente?.email ?? "";
        telefono.value = cliente?.telefono ?? "";
        empresa.value = cliente?.empresa ?? "";
        errores.value = {};
    }
);

const validar = (): boolean => {
    errores.value = {};

    if (!nombre_completo.value.trim())
        errores.value.nombre_completo = "El nombre es obligatorio";

    if (!email.value.trim()) {
        errores.value.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errores.value.email = "El formato del email no es válido";
    }

    if (!empresa.value.trim())
        errores.value.empresa = "La empresa es obligatoria";

    return Object.keys(errores.value).length === 0;
};

const guardarCliente = async () => {
    if (!validar()) return;

    try {
        const datos = {
            nombre_completo: nombre_completo.value,
            email: email.value,
            telefono: telefono.value,
            empresa: empresa.value,
        };

        if (props.cliente?.id) {
            await api.put(`/clientes/${props.cliente.id}`, datos);
        } else {
            await api.post("/clientes", datos);
        }

        emit("clienteCreado");

        nombre_completo.value = "";
        email.value = "";
        telefono.value = "";
        empresa.value = "";
        errores.value = {};
    } catch (error: any) {
        if (error?.response?.data?.message) {
            errores.value.api = error.response.data.message;
        }
    }
};

const cancelar = () => {
    emit("cancelar");
    nombre_completo.value = "";
    email.value = "";
    telefono.value = "";
    empresa.value = "";
    errores.value = {};
};
</script>

<template>
    <div class="form-card">
        <h2>{{ cliente ? `Editando: ${cliente.nombre_completo}` : "Nuevo Cliente" }}</h2>

        <p v-if="errores.api" class="error-api">{{ errores.api }}</p>

        <div class="form-grid">
            <div class="field">
                <label>Nombre completo *</label>
                <input
                    v-model="nombre_completo"
                    placeholder="Ej: Juan García"
                    :class="{ 'input-error': errores.nombre_completo }"
                />
                <span v-if="errores.nombre_completo" class="error-msg">{{ errores.nombre_completo }}</span>
            </div>

            <div class="field">
                <label>Email *</label>
                <input
                    v-model="email"
                    placeholder="Ej: juan@empresa.com"
                    :class="{ 'input-error': errores.email }"
                />
                <span v-if="errores.email" class="error-msg">{{ errores.email }}</span>
            </div>

            <div class="field">
                <label>Empresa *</label>
                <input
                    v-model="empresa"
                    placeholder="Ej: Tech Corp"
                    :class="{ 'input-error': errores.empresa }"
                />
                <span v-if="errores.empresa" class="error-msg">{{ errores.empresa }}</span>
            </div>

            <div class="field">
                <label>Teléfono <span class="optional">(opcional)</span></label>
                <input v-model="telefono" placeholder="Ej: +52 55 1234 5678" />
            </div>
        </div>

        <div class="form-actions">
            <button v-if="cliente" class="btn-secondary" @click="cancelar">Cancelar</button>
            <button class="btn-primary" @click="guardarCliente">
                {{ cliente ? "Actualizar Cliente" : "Guardar Cliente" }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.form-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: var(--shadow-sm);
    transition: background 0.25s, border-color 0.25s;
}

h2 {
    margin: 0 0 1.25rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
    margin-bottom: 1.25rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.optional {
    font-weight: 400;
    text-transform: none;
    color: var(--text-faint);
}

input {
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 0.95rem;
    outline: none;
    color: var(--text-primary);
    background-color: var(--bg-input);
    transition: border-color 0.15s, box-shadow 0.15s, background 0.25s;
}

input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}

input.input-error {
    border-color: var(--danger);
}

.error-msg {
    font-size: 0.78rem;
    color: var(--danger);
}

.error-api {
    background: var(--error-bg);
    color: var(--error-text);
    padding: 0.6rem 1rem;
    border-radius: 6px;
    font-size: 0.88rem;
    margin-bottom: 1rem;
}

.form-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
}

.btn-primary {
    padding: 10px 20px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.15s;
}

.btn-primary:hover {
    background: var(--accent-h);
}

.btn-secondary {
    padding: 10px 20px;
    background: var(--bg-card);
    color: var(--text-secondary);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.15s;
}

.btn-secondary:hover {
    background: var(--bg-hover);
}
</style>
