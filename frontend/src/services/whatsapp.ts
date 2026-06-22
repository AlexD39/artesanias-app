const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "";
const STORE_NAME = import.meta.env.VITE_STORE_NAME || "Tienda";

export function buildWhatsAppUrl(message: string) {
  const encodedMessage = encodeURIComponent(message);

  if (!WHATSAPP_NUMBER) {
    return `https://wa.me/?text=${encodedMessage}`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function buildProductMessage(productName: string, price: number) {
  return `Hola, vengo de ${STORE_NAME}. Me interesa el producto: ${productName}. Precio: $${price.toFixed(
    2
  )}. ¿Sigue disponible?`;
}