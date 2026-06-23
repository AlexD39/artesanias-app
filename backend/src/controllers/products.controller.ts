import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export async function getProducts(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        category: {
          status: "ACTIVE"
        }
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      ok: true,
      products: products.map((product) => ({
        ...product,
        price: Number(product.price)
      }))
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const slugParam = req.params.slug;

    if (!slugParam || Array.isArray(slugParam)) {
      return res.status(400).json({
        ok: false,
        message: "Slug inválido",
      });
    }

    const slug = String(slugParam);

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!product || product.status !== "ACTIVE") {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    res.json({
      ok: true,
      product: {
        ...product,
        price: Number(product.price),
      },
    });
  } catch (error) {
    next(error);
  }
}