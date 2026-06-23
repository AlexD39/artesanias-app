import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export async function getPublicSettings(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let settings = await prisma.storeSetting.findFirst({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await prisma.storeSetting.create({
        data: {
          id: 1,
          storeName: "Artesanía MX",
          whatsappNumber: "",
          contactEmail: "",
          address: "",
          whatsappMessage:
            "Hola, vengo de la tienda web. Quisiera más información sobre sus productos.",
        },
      });
    }

    res.json({
      ok: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicSocialLinks(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        order: "asc",
      },
    });

    res.json({
      ok: true,
      socialLinks,
    });
  } catch (error) {
    next(error);
  }
}