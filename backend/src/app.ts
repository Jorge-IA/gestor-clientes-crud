import express from "express";
import cors from "cors";
import clientesRoutes from "./routes/clientes.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.use("/clientes", clientesRoutes);

export default app;