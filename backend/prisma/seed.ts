import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const existe = await prisma.usuario.findUnique({ where: { email: "admin@gestor.com" } });
    if (existe) {
        console.log("El admin ya existe");
        return;
    }

    await prisma.usuario.create({
        data: {
            nombre: "Administrador",
            email: "admin@gestor.com",
            password: await bcrypt.hash("admin123", 10),
            rol: "ADMIN",
        },
    });

    console.log("Admin creado: admin@gestor.com / admin123");
}

main().finally(() => prisma.$disconnect());
