import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma";

const JWT_SECRET = process.env.JWT_SECRET ?? "gestor_clientes_secret_2024";

export const registro = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ message: "Nombre, email y contraseña son obligatorios" });
        }

        const existente = await prisma.usuario.findUnique({ where: { email } });
        if (existente) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const usuario = await prisma.usuario.create({
            data: { nombre, email, password: passwordHash },
        });

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar usuario" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son obligatorios" });
        }

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};
