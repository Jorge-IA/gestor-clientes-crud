<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "./services/clientes.service";
import type { Cliente } from "./types/cliente";

const clientes = ref<Cliente[]>([]);
const loading = ref(true);

const obtenerClientes = async () => {
  try {
    const response = await api.get("/clientes");
    clientes.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  obtenerClientes();
});
</script>

<template>
  <main>
    <h1>Gestor de Clientes</h1>

    <p v-if="loading">Cargando clientes...</p>

    <ul v-else>
      <li v-for="cliente in clientes" :key="cliente.id">
        {{ cliente.nombre_completo }} - {{ cliente.empresa }}
      </li>
    </ul>
  </main>
</template>
