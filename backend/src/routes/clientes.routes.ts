import { Router } from "express";
import { obtenerClientes, crearCliente, actualizarCliente, eliminarCliente } from "../controllers/clientes.controller";
import { verificarToken, soloAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", verificarToken, obtenerClientes);
router.post("/", verificarToken, soloAdmin, crearCliente);
router.put("/:id", verificarToken, soloAdmin, actualizarCliente);
router.delete("/:id", verificarToken, soloAdmin, eliminarCliente);

export default router;
