import { Request, Response, NextFunction } from "express";
import { uploadImageToCloudinary } from "../services/cloudinary.service";

export async function adminUploadProductImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "No se recibió ninguna imagen",
      });
    }

    const result = await uploadImageToCloudinary(req.file.buffer);

    res.json({
      ok: true,
      message: "Imagen subida correctamente",
      image: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  } catch (error) {
    next(error);
  }
}