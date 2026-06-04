<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "./services/clientes.service";
import type { Cliente } from "./types/cliente";
import ClienteForm from "./components/ClienteForm.vue";

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

    <ClienteForm />

    <p v-if="loading">Cargando clientes...</p>

    <table v-else>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Empresa</th>
          <th>Teléfono</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="cliente in clientes" :key="cliente.id">
          <td>{{ cliente.nombre_completo }}</td>
          <td>{{ cliente.email }}</td>
          <td>{{ cliente.empresa }}</td>
          <td>{{ cliente.telefono }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  border: 1px solid #ddd;
}

th {
  text-align: left;
}
</style>
