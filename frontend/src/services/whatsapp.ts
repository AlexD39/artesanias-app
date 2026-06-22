export function buildWhatsAppUrl(message: string, whatsappNumber?: string | null) {
  const encodedMessage = encodeURIComponent(message);
  const cleanNumber = String(whatsappNumber || "").replace(/\D/g, "");

  if (!cleanNumber) {
    return `https://wa.me/?text=${encodedMessage}`;
  }

  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

export function buildProductMessage(
  storeName: string,
  productName: string,
  price: number,
  baseMessage?: string | null
) {
  const intro =
    baseMessage ||
    `Hola, vengo de ${storeName}. Quisiera más información sobre sus productos.`;

  return `${intro}\n\nProducto: ${productName}\nPrecio: $${price.toFixed(
    2
  )}\n\n¿Sigue disponible?`;
}