import { formatCurrency } from "./utils";

export type WhatsAppOrderSummary = {
  storeName: string;
  artistName?: string | null;
  artworkTitle: string;
  size?: string | null;
  frame?: string | null;
  quantity: number;
  unitPrice: number;
  currency: string;
  customerName: string;
  customerAddress: string;
  customerNote?: string | null;
  orderNumber: string;
};

/**
 * Build a customer-facing WhatsApp message that confirms order intent.
 * The message is intentionally readable and copy-pastable.
 */
export function buildWhatsAppMessage(input: WhatsAppOrderSummary): string {
  const lines: string[] = [];
  lines.push(`Hello${input.artistName ? ` ${input.artistName}` : ""},`);
  lines.push("");
  lines.push(`I'd like to order this print from ${input.storeName}:`);
  lines.push("");
  lines.push(`Artwork: ${input.artworkTitle}`);
  if (input.size) lines.push(`Size: ${input.size}`);
  if (input.frame) lines.push(`Frame: ${input.frame}`);
  lines.push(`Quantity: ${input.quantity}`);
  lines.push(
    `Total: ${formatCurrency(input.unitPrice * input.quantity, input.currency)}`,
  );
  lines.push("");
  lines.push(`Name: ${input.customerName}`);
  lines.push(`Delivery address: ${input.customerAddress}`);
  if (input.customerNote) lines.push(`Note: ${input.customerNote}`);
  lines.push("");
  lines.push(`Order ref: ${input.orderNumber}`);
  return lines.join("\n");
}

/**
 * Convert a phone number into a wa.me-compatible string by stripping all
 * non-digit characters. Returns null if the result is too short.
 */
export function normalisePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) return null;
  return digits;
}

export function buildWhatsAppLink(phone: string, message: string) {
  const normalised = normalisePhone(phone);
  if (!normalised) return null;
  return `https://wa.me/${normalised}?text=${encodeURIComponent(message)}`;
}
