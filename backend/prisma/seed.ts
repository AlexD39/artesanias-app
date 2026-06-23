import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@artesanias.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@artesanias.com",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE"
    }
  });

  const cojines = await prisma.category.upsert({
    where: { slug: "cojines" },
    update: {},
    create: {
      name: "Cojines",
      slug: "cojines",
      description: "Cojines artesanales hechos a mano.",
      status: "ACTIVE"
    }
  });

  const textiles = await prisma.category.upsert({
    where: { slug: "textiles" },
    update: {},
    create: {
      name: "Textiles",
      slug: "textiles",
      description: "Textiles mexicanos elaborados por artesanos.",
      status: "ACTIVE"
    }
  });

  const decoracion = await prisma.category.upsert({
    where: { slug: "decoracion" },
    update: {},
    create: {
      name: "Decoración",
      slug: "decoracion",
      description: "Piezas decorativas para el hogar.",
      status: "ACTIVE"
    }
  });

  await prisma.product.upsert({
    where: { slug: "cojin-artesanal-amarillo" },
    update: {},
    create: {
      name: "Cojín artesanal amarillo",
      slug: "cojin-artesanal-amarillo",
      shortDescription: "Cojín hecho a mano con bordado mexicano.",
      longDescription:
        "Pieza artesanal elaborada cuidadosamente por manos mexicanas. Ideal para decorar salas, recámaras o espacios cálidos.",
      price: 450,
      stock: 8,
      mainImage: "https://placehold.co/800x600/f6d365/222222?text=Cojin+Artesanal",
      status: "ACTIVE",
      featured: true,
      categoryId: cojines.id
    }
  });

  await prisma.product.upsert({
    where: { slug: "bolsa-tejida-mexicana" },
    update: {},
    create: {
      name: "Bolsa tejida mexicana",
      slug: "bolsa-tejida-mexicana",
      shortDescription: "Bolsa artesanal tejida con diseño tradicional.",
      longDescription:
        "Bolsa artesanal con detalles únicos. Cada pieza puede variar ligeramente por su proceso hecho a mano.",
      price: 620,
      stock: 5,
      mainImage: "https://placehold.co/800x600/e9c46a/222222?text=Bolsa+Tejida",
      status: "ACTIVE",
      featured: true,
      categoryId: textiles.id
    }
  });

  await prisma.product.upsert({
    where: { slug: "pieza-decorativa-barro" },
    update: {},
    create: {
      name: "Pieza decorativa de barro",
      slug: "pieza-decorativa-barro",
      shortDescription: "Decoración artesanal en barro mexicano.",
      longDescription:
        "Pieza decorativa elaborada en barro, perfecta para dar un toque cálido y mexicano al hogar.",
      price: 380,
      stock: 10,
      mainImage: "https://placehold.co/800x600/d4a373/222222?text=Barro+Artesanal",
      status: "ACTIVE",
      featured: false,
      categoryId: decoracion.id
    }
  });

await prisma.storeSetting.upsert({
  where: { id: 1 },
  update: {},
  create: {
    id: 1,
    storeName: "Artesanía MX",
    whatsappNumber: "123456798",
    contactEmail: "contacto@artesanias.com",
    address: "México",
    whatsappMessage:
      "Hola, vengo de la tienda web. Quisiera más información sobre sus productos.",
  },
});  

  console.log("Seed ejecutado correctamente.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });