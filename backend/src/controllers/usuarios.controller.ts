import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma/prisma";

export const listarUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: { id: true, nombre: true, email: true, rol: true },
            orderBy: { id: "asc" },
        });
        res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al listar usuarios" });
    }
};

export const obtenerPerfil = async (req: Request, res: Response) => {
    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.usuario!.id },
            select: { id: true, nombre: true, email: true, rol: true },
        });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener perfil" });
    }
};

export const actualizarPerfil = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password } = req.body;
        const id = req.usuario!.id;

        const data: Record<string, string> = {};
        if (nombre?.trim()) data.nombre = nombre.trim();
        if (email?.trim()) data.email = email.trim();
        if (password?.trim()) data.password = await bcrypt.hash(password, 10);

        const usuario = await prisma.usuario.update({
            where: { id },
            data,
            select: { id: true, nombre: true, email: true, rol: true },
        });

        res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar perfil" });
    }
};

export const cambiarRol = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { rol } = req.body;

        if (rol !== "ADMIN" && rol !== "USUARIO") {
            return res.status(400).json({ message: "Rol inválido" });
        }

        if (id === req.usuario!.id) {
            return res.status(403).json({ message: "No puedes cambiar tu propio rol" });
        }

        const usuario = await prisma.usuario.update({
            where: { id },
            data: { rol },
            select: { id: true, nombre: true, email: true, rol: true },
        });

        res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al cambiar rol" });
    }
};

export const eliminarUsuario = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (id === req.usuario!.id) {
            return res.status(403).json({ message: "No puedes eliminar tu propia cuenta" });
        }

        const existe = await prisma.usuario.findUnique({ where: { id } });
        if (!existe) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await prisma.usuario.delete({ where: { id } });
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar usuario" });
    }
};
