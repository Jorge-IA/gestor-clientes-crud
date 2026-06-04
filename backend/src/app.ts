import "dotenv/config";
import express from "express";
import cors from "cors";
import clientesRoutes from "./routes/clientes.routes";
import authRoutes from "./routes/auth.routes";
import usuariosRoutes from "./routes/usuarios.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/clientes", clientesRoutes);

export default app;
