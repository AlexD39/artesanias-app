import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

const SOCIAL_STATUSES = ["ACTIVE", "INACTIVE"] as const;
type SocialStatusInput = (typeof SOCIAL_STATUSES)[number];

function normalizeStatus(status: unknown): SocialStatusInput {
  if (
    typeof status === "string" &&
    SOCIAL_STATUSES.includes(status as SocialStatusInput)
  ) {
    return status as SocialStatusInput;
  }

  return "ACTIVE";
}

export async function adminGetSettings(
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

export async function adminUpdateSettings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      storeName,
      whatsappNumber,
      contactEmail,
      address,
      whatsappMessage,
    } = req.body;

    const settings = await prisma.storeSetting.upsert({
      where: { id: 1 },
      update: {
        storeName: storeName ? String(storeName).trim() : "Artesanía MX",
        whatsappNumber: whatsappNumber ? String(whatsappNumber).trim() : null,
        contactEmail: contactEmail ? String(contactEmail).trim() : null,
        address: address ? String(address).trim() : null,
        whatsappMessage: whatsappMessage
          ? String(whatsappMessage).trim()
          : null,
      },
      create: {
        id: 1,
        storeName: storeName ? String(storeName).trim() : "Artesanía MX",
        whatsappNumber: whatsappNumber ? String(whatsappNumber).trim() : null,
        contactEmail: contactEmail ? String(contactEmail).trim() : null,
        address: address ? String(address).trim() : null,
        whatsappMessage: whatsappMessage
          ? String(whatsappMessage).trim()
          : null,
      },
    });

    res.json({
      ok: true,
      message: "Configuración actualizada correctamente",
      settings,
    });
  } catch (error) {
    next(error);
  }
}

export async function adminGetSocialLinks(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const socialLinks = await prisma.socialLink.findMany({
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

export async function adminCreateSocialLink(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, url, icon, status, order } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        ok: false,
        message: "Nombre y URL son obligatorios",
      });
    }

    const socialLink = await prisma.socialLink.create({
      data: {
        name: String(name).trim(),
        url: String(url).trim(),
        icon: icon ? String(icon).trim() : null,
        status: normalizeStatus(status),
        order: Number(order || 0),
      },
    });

    res.status(201).json({
      ok: true,
      message: "Red social creada correctamente",
      socialLink,
    });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateSocialLink(
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

    const { name, url, icon, status, order } = req.body;

    const existing = await prisma.socialLink.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        ok: false,
        message: "Red social no encontrada",
      });
    }

    const socialLink = await prisma.socialLink.update({
      where: { id },
      data: {
        name: name ? String(name).trim() : existing.name,
        url: url ? String(url).trim() : existing.url,
        icon: icon !== undefined ? String(icon).trim() : existing.icon,
        status: normalizeStatus(status || existing.status),
        order: order !== undefined ? Number(order) : existing.order,
      },
    });

    res.json({
      ok: true,
      message: "Red social actualizada correctamente",
      socialLink,
    });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteSocialLink(
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

    const existing = await prisma.socialLink.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        ok: false,
        message: "Red social no encontrada",
      });
    }

    await prisma.socialLink.update({
      where: { id },
      data: {
        status: "INACTIVE",
      },
    });

    res.json({
      ok: true,
      message: "Red social desactivada correctamente",
    });
  } catch (error) {
    next(error);
  }
}