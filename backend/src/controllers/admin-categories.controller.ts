import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

const CATEGORY_STATUSES = ["ACTIVE", "INACTIVE"] as const;
type CategoryStatusInput = (typeof CATEGORY_STATUSES)[number];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function normalizeStatus(status: unknown): CategoryStatusInput {
  if (
    typeof status === "string" &&
    CATEGORY_STATUSES.includes(status as CategoryStatusInput)
  ) {
    return status as CategoryStatusInput;
  }

  return "ACTIVE";
}

export async function adminGetCategories(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      ok: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function adminCreateCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({
        ok: false,
        message: "El nombre de la categoría es obligatorio",
      });
    }

    const category = await prisma.category.create({
      data: {
        name: String(name).trim(),
        slug: slugify(String(name)),
        description: description ? String(description).trim() : null,
        status: normalizeStatus(status),
      },
    });

    res.status(201).json({
      ok: true,
      message: "Categoría creada correctamente",
      category,
    });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({
        ok: false,
        message: "Ya existe una categoría con ese nombre",
      });
    }

    next(error);
  }
}

export async function adminUpdateCategory(
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

    const { name, description, status } = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({
        ok: false,
        message: "Categoría no encontrada",
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name ? String(name).trim() : existingCategory.name,
        slug: name ? slugify(String(name)) : existingCategory.slug,
        description:
          description !== undefined
            ? String(description).trim()
            : existingCategory.description,
        status: normalizeStatus(status || existingCategory.status),
      },
    });

    res.json({
      ok: true,
      message: "Categoría actualizada correctamente",
      category,
    });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({
        ok: false,
        message: "Ya existe una categoría con ese nombre",
      });
    }

    next(error);
  }
}

export async function adminDeleteCategory(
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

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({
        ok: false,
        message: "Categoría no encontrada",
      });
    }

    await prisma.category.update({
      where: { id },
      data: {
        status: "INACTIVE",
      },
    });

    res.json({
      ok: true,
      message: "Categoría desactivada correctamente",
    });
  } catch (error) {
    next(error);
  }
}