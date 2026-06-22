import multer from "multer";

const storage = multer.memoryStorage();

export const uploadProductImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Solo se permiten imágenes JPG, PNG o WEBP"));
      return;
    }

    cb(null, true);
  },
});