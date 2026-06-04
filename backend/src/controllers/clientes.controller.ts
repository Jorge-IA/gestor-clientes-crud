import { Request, Response } from "express";
import prisma from "../prisma/prisma";

export const obtenerClientes = async (
    req: Request,
    res: Response
) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const [clientes, total] = await Promise.all([
            prisma.cliente.findMany({ skip, take: limit }),
            prisma.cliente.count(),
        ]);

        res.status(200).json({
            data: clientes,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener clientes",
        });
    }
};

export const crearCliente = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            nombre_completo,
            email,
            telefono,
            empresa
        } = req.body;

        if (!nombre_completo || !email || !empresa) {
            return res.status(400).json({
                message: "Nombre, email y empresa son obligatorios"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "El formato del email no es válido"
            });
        }

        const clienteExistente = await prisma.cliente.findUnique({
            where: {
                email
            }
        });

        if (clienteExistente) {
            return res.status(400).json({
                message: "El email ya existe"
            });
        }

        const cliente = await prisma.cliente.create({
            data: {
                nombre_completo,
                email,
                telefono,
                empresa
            }
        });

        res.status(201).json(cliente);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al crear cliente"
        });
    }
};

export const actualizarCliente = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const {
            nombre_completo,
            email,
            telefono,
            empresa
        } = req.body;

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: "El formato del email no es válido"
                });
            }
        }

        const cliente = await prisma.cliente.findUnique({
            where: {
                id
            }
        });

        if (!cliente) {
            return res.status(404).json({
                message: "Cliente no encontrado"
            });
        }

        const clienteActualizado = await prisma.cliente.update({
            where: {
                id
            },
            data: {
                nombre_completo,
                email,
                telefono,
                empresa
            }
        });

        res.status(200).json(clienteActualizado);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al actualizar cliente"
        });
    }
};

export const eliminarCliente = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const cliente = await prisma.cliente.findUnique({
            where: { id }
        });

        if (!cliente) {
            return res.status(404).json({
                message: "Cliente no encontrado"
            });
        }

        if (cliente.email === req.usuario?.email) {
            return res.status(403).json({
                message: "No puedes eliminar tu propio registro"
            });
        }

        await prisma.cliente.delete({
            where: { id }
        });

        res.status(200).json({
            message: "Cliente eliminado correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al eliminar cliente"
        });
    }
};