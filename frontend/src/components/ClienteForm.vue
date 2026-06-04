<script setup lang="ts">
import { ref } from "vue";
import { api } from "../services/clientes.service";

const nombre_completo = ref("");
const email = ref("");
const telefono = ref("");
const empresa = ref("");

const crearCliente = async () => {
  try {
    await api.post("/clientes", {
      nombre_completo: nombre_completo.value,
      email: email.value,
      telefono: telefono.value,
      empresa: empresa.value,
    });

    window.location.reload();
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="form-container">
    <input v-model="nombre_completo" placeholder="Nombre completo" />

    <input v-model="email" placeholder="Email" />

    <input v-model="empresa" placeholder="Empresa" />

    <input v-model="telefono" placeholder="Teléfono" />

    <button @click="crearCliente">Guardar Cliente</button>
  </div>
</template>

<style scoped>
.form-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

input {
  padding: 10px;
}

button {
  padding: 10px 15px;
  cursor: pointer;
}
</style>
