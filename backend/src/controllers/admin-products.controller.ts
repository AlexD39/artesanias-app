import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

const PRODUCT_STATUSES = ["ACTIVE", "INACTIVE", "OUT_OF_STOCK"] as const;

type ProductStatusInput = (typeof PRODUCT_STATUSES)[number];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function normalizeStatus(status: unknown): ProductStatusInput {
  if (
    typeof status === "string" &&
    PRODUCT_STATUSES.includes(status as ProductStatusInput)
  ) {
    return status as ProductStatusInput;
  }

  return "ACTIVE";
}

function productResponse(product: any) {
  return {
    ...product,
    price: Number(product.price),
  };
}

export async function adminGetProducts(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      ok: true,
      products: products.map(productResponse),
    });
  } catch (error) {
    next(error);
  }
}

export async function adminCreateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      name,
      shortDescription,
      longDescription,
      price,
      stock,
      categoryId,
      mainImage,
      status,
      featured,
    } = req.body;

    if (!name || !shortDescription || price === undefined || !categoryId) {
      return res.status(400).json({
        ok: false,
        message: "Nombre, descripción corta, precio y categoría son obligatorios",
      });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    });

    if (!category) {
      return res.status(400).json({
        ok: false,
        message: "La categoría seleccionada no existe",
      });
    }

    const slug = slugify(name);

    const product = await prisma.product.create({
      data: {
        name: String(name).trim(),
        slug,
        shortDescription: String(shortDescription).trim(),
        longDescription: longDescription ? String(longDescription).trim() : null,
        price: Number(price),
        stock: Number(stock || 0),
        mainImage: mainImage ? String(mainImage).trim() : null,
        status: normalizeStatus(status),
        featured: Boolean(featured),
        categoryId: Number(categoryId),
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      ok: true,
      message: "Producto creado correctamente",
      product: productResponse(product),
    });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({
        ok: false,
        message: "Ya existe un producto con ese nombre o slug",
      });
    }

    next(error);
  }
}

export async function adminUpdateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "ID inválido",
      });
    }

    const {
      name,
      shortDescription,
      longDescription,
      price,
      stock,
      categoryId,
      mainImage,
      status,
      featured,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: Number(categoryId),
        },
      });

      if (!category) {
        return res.status(400).json({
          ok: false,
          message: "La categoría seleccionada no existe",
        });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name ? String(name).trim() : existingProduct.name,
        slug: name ? slugify(String(name)) : existingProduct.slug,
        shortDescription: shortDescription
          ? String(shortDescription).trim()
          : existingProduct.shortDescription,
        longDescription:
          longDescription !== undefined
            ? String(longDescription).trim()
            : existingProduct.longDescription,
        price: price !== undefined ? Number(price) : existingProduct.price,
        stock: stock !== undefined ? Number(stock) : existingProduct.stock,
        mainImage:
          mainImage !== undefined ? String(mainImage).trim() : existingProduct.mainImage,
        status: normalizeStatus(status || existingProduct.status),
        featured:
          featured !== undefined ? Boolean(featured) : existingProduct.featured,
        categoryId: categoryId ? Number(categoryId) : existingProduct.categoryId,
      },
      include: {
        category: true,
      },
    });

    res.json({
      ok: true,
      message: "Producto actualizado correctamente",
      product: productResponse(product),
    });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({
        ok: false,
        message: "Ya existe un producto con ese nombre o slug",
      });
    }

    next(error);
  }
}

export async function adminDeleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "ID inválido",
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    await prisma.product.update({
      where: { id },
      data: {
        status: "INACTIVE",
      },
    });

    res.json({
      ok: true,
      message: "Producto desactivado correctamente",
    });
  } catch (error) {
    next(error);
  }
}