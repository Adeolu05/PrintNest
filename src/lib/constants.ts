export const PRINT_SIZES = [
  { code: "A5", label: "A5 (148 × 210 mm)", widthIn: 5.83, heightIn: 8.27 },
  { code: "A4", label: "A4 (210 × 297 mm)", widthIn: 8.27, heightIn: 11.69 },
  { code: "A3", label: "A3 (297 × 420 mm)", widthIn: 11.69, heightIn: 16.54 },
  { code: "A2", label: "A2 (420 × 594 mm)", widthIn: 16.54, heightIn: 23.39 },
  { code: "A1", label: "A1 (594 × 841 mm)", widthIn: 23.39, heightIn: 33.11 },
] as const;

export type PrintSizeCode = (typeof PRINT_SIZES)[number]["code"];

export const FRAME_OPTIONS = [
  "No frame",
  "Black frame",
  "White frame",
  "Natural wood",
  "Walnut frame",
] as const;

export const PRINT_CATEGORIES = [
  "Abstract",
  "Portrait",
  "Landscape",
  "Photography",
  "Illustration",
  "Typography",
  "Minimalist",
  "Afro Modern",
  "Pop",
  "Other",
] as const;

export const STORE_THEMES = [
  {
    id: "minimal-gallery",
    name: "Minimal Gallery",
    description: "White space, large images, fine-art typography.",
    accent: "#111111",
  },
  {
    id: "dark-museum",
    name: "Dark Museum",
    description: "Dark canvas, spotlight feel for dramatic art.",
    accent: "#f5f5f5",
  },
  {
    id: "bold-poster",
    name: "Bold Poster Shop",
    description: "Big type, colour blocks, made for posters.",
    accent: "#ff5a1f",
  },
  {
    id: "luxury-studio",
    name: "Luxury Studio",
    description: "Soft neutrals and elegant spacing.",
    accent: "#9b8862",
  },
  {
    id: "afro-modern",
    name: "Afro Modern",
    description: "Warm tones and editorial layout.",
    accent: "#c2410c",
  },
] as const;

export type StoreThemeId = (typeof STORE_THEMES)[number]["id"];

export const AI_TONES = [
  { id: "simple", label: "Simple" },
  { id: "premium", label: "Premium" },
  { id: "poetic", label: "Poetic" },
  { id: "gallery", label: "Gallery-style" },
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold" },
  { id: "warm", label: "Warm" },
  { id: "luxury", label: "Luxury" },
  { id: "afro", label: "African Contemporary" },
  { id: "instagram", label: "Instagram-friendly" },
  { id: "seo", label: "SEO-friendly" },
] as const;

export type AIToneId = (typeof AI_TONES)[number]["id"];

export const ORDER_STATUSES = [
  "new",
  "confirmed",
  "paid",
  "printing",
  "ready",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "awaiting_transfer",
  "submitted",
  "paid",
  "failed",
  "refunded",
  "cancelled",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const SUPPORTED_CURRENCIES = [
  { code: "NGN", symbol: "₦", label: "Nigerian Naira" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GHS", symbol: "₵", label: "Ghanaian Cedi" },
  { code: "KES", symbol: "KSh", label: "Kenyan Shilling" },
  { code: "ZAR", symbol: "R", label: "South African Rand" },
] as const;

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
export const MIN_IMAGE_DIMENSION = 800;
export const MIN_DPI_FOR_PRINT = 150;

export const ANALYTICS_EVENTS = {
  storeView: "store_view",
  artworkView: "artwork_view",
  checkoutStarted: "checkout_started",
  whatsappClicked: "whatsapp_clicked",
  orderCreated: "order_created",
  shareClicked: "share_clicked",
} as const;
