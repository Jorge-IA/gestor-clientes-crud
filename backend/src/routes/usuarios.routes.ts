import { Router } from "express";
import {
    listarUsuarios,
    obtenerPerfil,
    actualizarPerfil,
    cambiarRol,
    eliminarUsuario,
} from "../controllers/usuarios.controller";
import { verificarToken, soloAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", verificarToken, soloAdmin, listarUsuarios);
router.get("/me", verificarToken, obtenerPerfil);
router.put("/me", verificarToken, actualizarPerfil);
router.patch("/:id/rol", verificarToken, soloAdmin, cambiarRol);
router.delete("/:id", verificarToken, soloAdmin, eliminarUsuario);

export default router;
