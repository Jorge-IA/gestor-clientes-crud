import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "gestor_clientes_secret_2024";

export interface UsuarioPayload {
    id: number;
    email: string;
    rol: string;
}

declare global {
    namespace Express {
        interface Request {
            usuario?: UsuarioPayload;
        }
    }
}

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET) as UsuarioPayload;
        req.usuario = payload;
        next();
    } catch {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

export const soloAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.usuario?.rol !== "ADMIN") {
        return res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador" });
    }
    next();
};
