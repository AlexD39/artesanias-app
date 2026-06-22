import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export async function getCategories(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        status: "ACTIVE"
      },
      orderBy: {
        name: "asc"
      }
    });

    res.json({
      ok: true,
      categories
    });
  } catch (error) {
    next(error);
  }
}