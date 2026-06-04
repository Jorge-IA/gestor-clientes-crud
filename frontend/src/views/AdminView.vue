<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "../services/clientes.service";
import type { Cliente } from "../types/cliente";
import type { Usuario } from "../types/usuario";
import ClienteForm from "../components/ClienteForm.vue";
import { useAuth } from "../composables/useAuth";

const { usuario: yo } = useAuth();

// ── Tabs ──────────────────────────────────────────────────
const tab = ref<"clientes" | "usuarios">("clientes");

// ── Clientes ──────────────────────────────────────────────
const clientes = ref<Cliente[]>([]);
const loadingClientes = ref(true);
const clienteSeleccionado = ref<Cliente | null>(null);
const paginaActual = ref(1);
const totalPaginas = ref(1);
const totalClientes = ref(0);
const LIMIT = 10;

const obtenerClientes = async () => {
    loadingClientes.value = true;
    try {
        const res = await api.get("/clientes", { params: { page: paginaActual.value, limit: LIMIT } });
        clientes.value = res.data.data;
        totalPaginas.value = res.data.totalPages;
        totalClientes.value = res.data.total;
    } catch (e) {
        console.error(e);
    } finally {
        loadingClientes.value = false;
    }
};

const eliminarCliente = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este cliente?")) return;
    try {
        await api.delete(`/clientes/${id}`);
        const eraUltimoEnPagina = clientes.value.length === 1 && paginaActual.value > 1;
        if (eraUltimoEnPagina) paginaActual.value -= 1;
        obtenerClientes();
    } catch (e: any) {
        alert(e?.response?.data?.message ?? "Error al eliminar");
    }
};

const editarCliente = (cliente: Cliente) => {
    clienteSeleccionado.value = { ...cliente };
    window.scrollTo({ top: 0, behavior: "smooth" });
};

const onClienteGuardado = () => {
    clienteSeleccionado.value = null;
    paginaActual.value = 1;
    obtenerClientes();
};

const irAPagina = (p: number) => {
    paginaActual.value = p;
    obtenerClientes();
};

// ── Usuarios ──────────────────────────────────────────────
const usuarios = ref<Usuario[]>([]);
const loadingUsuarios = ref(false);

const obtenerUsuarios = async () => {
    loadingUsuarios.value = true;
    try {
        const res = await api.get("/usuarios");
        usuarios.value = res.data;
    } catch (e) {
        console.error(e);
    } finally {
        loadingUsuarios.value = false;
    }
};

const cambiarRol = async (usuario: Usuario) => {
    const nuevoRol = usuario.rol === "ADMIN" ? "USUARIO" : "ADMIN";
    try {
        const res = await api.patch(`/usuarios/${usuario.id}/rol`, { rol: nuevoRol });
        const idx = usuarios.value.findIndex((u) => u.id === usuario.id);
        if (idx !== -1) usuarios.value[idx] = res.data;
    } catch (e: any) {
        alert(e?.response?.data?.message ?? "Error al cambiar rol");
    }
};

const eliminarUsuario = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este usuario?")) return;
    try {
        await api.delete(`/usuarios/${id}`);
        usuarios.value = usuarios.value.filter((u) => u.id !== id);
    } catch (e: any) {
        alert(e?.response?.data?.message ?? "Error al eliminar");
    }
};

const cambiarTab = (t: "clientes" | "usuarios") => {
    tab.value = t;
    if (t === "usuarios" && usuarios.value.length === 0) obtenerUsuarios();
};

onMounted(() => {
    obtenerClientes();
});
</script>

<template>
    <div class="page">
        <!-- Tabs -->
        <div class="tabs">
            <button :class="['tab', { active: tab === 'clientes' }]" @click="cambiarTab('clientes')">
                Clientes
                <span class="tab-badge">{{ totalClientes }}</span>
            </button>
            <button :class="['tab', { active: tab === 'usuarios' }]" @click="cambiarTab('usuarios')">
                Usuarios del sistema
                <span class="tab-badge">{{ usuarios.length }}</span>
            </button>
        </div>

        <!-- ── Panel Clientes ── -->
        <template v-if="tab === 'clientes'">
            <ClienteForm
                :cliente="clienteSeleccionado"
                @cliente-creado="onClienteGuardado"
                @cancelar="clienteSeleccionado = null"
            />

            <div class="table-section">
                <p v-if="loadingClientes" class="state-msg">Cargando clientes...</p>
                <p v-else-if="clientes.length === 0" class="state-msg empty">
                    No hay clientes registrados. ¡Agrega el primero!
                </p>
                <div v-else class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Empresa</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="cliente in clientes"
                                :key="cliente.id"
                                :class="{ 'row-selected': clienteSeleccionado?.id === cliente.id }"
                            >
                                <td class="td-name">{{ cliente.nombre_completo }}</td>
                                <td>{{ cliente.email }}</td>
                                <td>{{ cliente.empresa }}</td>
                                <td>{{ cliente.telefono ?? "—" }}</td>
                                <td class="td-actions">
                                    <button class="btn-edit" @click="editarCliente(cliente)">Editar</button>
                                    <button class="btn-delete" @click="eliminarCliente(cliente.id)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="totalPaginas > 1" class="pagination">
                        <button class="page-btn" :disabled="paginaActual === 1" @click="irAPagina(paginaActual - 1)">
                            ‹ Anterior
                        </button>
                        <span class="page-info">Página {{ paginaActual }} de {{ totalPaginas }}</span>
                        <button class="page-btn" :disabled="paginaActual === totalPaginas" @click="irAPagina(paginaActual + 1)">
                            Siguiente ›
                        </button>
                    </div>
                </div>
            </div>
        </template>

        <!-- ── Panel Usuarios ── -->
        <template v-if="tab === 'usuarios'">
            <div class="table-section">
                <p v-if="loadingUsuarios" class="state-msg">Cargando usuarios...</p>
                <p v-else-if="usuarios.length === 0" class="state-msg empty">
                    No hay usuarios registrados aún.
                </p>
                <div v-else class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="u in usuarios" :key="u.id" :class="{ 'row-yo': u.id === yo?.id }">
                                <td class="td-name">
                                    {{ u.nombre }}
                                    <span v-if="u.id === yo?.id" class="yo-tag">tú</span>
                                </td>
                                <td>{{ u.email }}</td>
                                <td>
                                    <span class="rol-badge" :class="u.rol === 'ADMIN' ? 'rol-admin' : 'rol-user'">
                                        {{ u.rol === "ADMIN" ? "Admin" : "Usuario" }}
                                    </span>
                                </td>
                                <td class="td-actions">
                                    <button
                                        v-if="u.id !== yo?.id"
                                        class="btn-edit"
                                        :title="u.rol === 'ADMIN' ? 'Quitar admin' : 'Hacer admin'"
                                        @click="cambiarRol(u)"
                                    >
                                        {{ u.rol === "ADMIN" ? "→ Usuario" : "→ Admin" }}
                                    </button>
                                    <button
                                        v-if="u.id !== yo?.id"
                                        class="btn-delete"
                                        @click="eliminarUsuario(u.id)"
                                    >
                                        Eliminar
                                    </button>
                                    <span v-if="u.id === yo?.id" class="no-action">—</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.page {
    padding: 2rem 0;
}

/* ── Tabs ── */
.tabs {
    display: flex;
    gap: 4px;
    border-bottom: 2px solid var(--border);
    margin-bottom: 1.5rem;
}

.tab {
    padding: 10px 20px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: color 0.15s;
}

.tab:hover { color: var(--text-primary); }

.tab.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
}

.tab-badge {
    background: var(--bg-hover);
    color: var(--text-muted);
    border-radius: 999px;
    padding: 1px 8px;
    font-size: 0.75rem;
    font-weight: 700;
}

.tab.active .tab-badge {
    background: var(--accent-bg);
    color: var(--accent-text);
}

/* ── Tabla compartida ── */
.table-section {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: background 0.25s, border-color 0.25s;
}

.table-wrapper { overflow-x: auto; }

table { width: 100%; border-collapse: collapse; }

thead { background: var(--bg-hover); }

th {
    padding: 12px 16px;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
}

td {
    padding: 14px 16px;
    font-size: 0.9rem;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border-light);
    transition: background 0.15s;
}

tr:last-child td { border-bottom: none; }
tr:hover td { background: var(--bg-hover); }
tr.row-selected td { background: var(--accent-bg); }
tr.row-yo td { background: var(--accent-bg); }

.td-name {
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 8px;
}

.yo-tag {
    font-size: 0.7rem;
    background: var(--accent-bg);
    color: var(--accent-text);
    border-radius: 999px;
    padding: 1px 8px;
    font-weight: 700;
}

.td-actions {
    display: flex;
    gap: 8px;
    white-space: nowrap;
    align-items: center;
}

.no-action { color: var(--text-faint); font-size: 0.9rem; }

.btn-edit {
    padding: 6px 14px;
    background: var(--edit-bg);
    color: var(--edit);
    border: 1px solid var(--edit-border);
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.82rem;
    cursor: pointer;
    transition: filter 0.15s;
}

.btn-edit:hover { filter: brightness(0.92); }

.btn-delete {
    padding: 6px 14px;
    background: var(--danger-bg);
    color: var(--danger);
    border: 1px solid var(--danger-border);
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.82rem;
    cursor: pointer;
    transition: filter 0.15s;
}

.btn-delete:hover { filter: brightness(0.92); }

.rol-badge {
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 999px;
    padding: 3px 10px;
}

.rol-admin { background: #fef3c7; color: #92400e; }
.rol-user  { background: var(--edit-bg); color: var(--edit); }

[data-theme="dark"] .rol-admin { background: #422006; color: #fbbf24; }

.state-msg {
    padding: 3rem;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.95rem;
}

.state-msg.empty { color: var(--text-faint); }

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    border-top: 1px solid var(--border-light);
}

.page-btn {
    padding: 6px 14px;
    background: var(--bg-card);
    color: var(--text-secondary);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
}

.page-btn:hover:not(:disabled) { background: var(--bg-hover); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.page-info {
    font-size: 0.85rem;
    color: var(--text-muted);
}
</style>
