// Innovatechs WhatsApp line; override per deployment with VITE_WHATSAPP_NUMBER.
const DEFAULT_NUMBER = '212699312362'

export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_NUMBER).replace(/\D/g, '')

/** Optional call line. Empty → no "Call" button anywhere (never an invented number). */
export const PHONE_NUMBER = (import.meta.env.VITE_PHONE_NUMBER || '').replace(/[^\d+]/g, '')

export function whatsappLink(text: string, number = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export function phoneLink(number = PHONE_NUMBER) {
  return number ? `tel:${number}` : null
}
