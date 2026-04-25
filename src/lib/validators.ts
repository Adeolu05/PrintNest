import { z } from "zod";
import {
  AI_TONES,
  FRAME_OPTIONS,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PRINT_CATEGORIES,
  PRINT_SIZES,
  STORE_THEMES,
  SUPPORTED_CURRENCIES,
} from "./constants";

const toneIds = AI_TONES.map((t) => t.id) as [string, ...string[]];
const themeIds = STORE_THEMES.map((t) => t.id) as [string, ...string[]];
const currencyCodes = SUPPORTED_CURRENCIES.map((c) => c.code) as [
  string,
  ...string[],
];
const sizeCodes = PRINT_SIZES.map((s) => s.code) as [string, ...string[]];
const frameOptions = [...FRAME_OPTIONS] as [string, ...string[]];
const categories = [...PRINT_CATEGORIES] as [string, ...string[]];

export const slugSchema = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only.");

export const onboardingSchema = z.object({
  storeName: z.string().min(2).max(60),
  storeSlug: slugSchema,
  artistName: z.string().min(2).max(60),
  whatsappNumber: z
    .string()
    .min(7)
    .max(20)
    .regex(/^[+0-9 ()-]+$/, "Enter a valid phone number."),
  country: z.string().min(2).max(60),
  city: z.string().max(60).optional().or(z.literal("")),
  currency: z.enum(currencyCodes),
  bio: z.string().max(500).optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  tiktokUrl: z.string().url().optional().or(z.literal("")),
  xUrl: z.string().url().optional().or(z.literal("")),
  themeId: z.enum(themeIds),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const storeUpdateSchema = onboardingSchema.partial().extend({
  heroHeadline: z.string().max(120).optional(),
  heroSubheadline: z.string().max(280).optional(),
  accentColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  displayMode: z
    .enum(["gallery", "shop_grid", "editorial", "portfolio_shop"])
    .optional(),
});

export const artworkVariantSchema = z.object({
  id: z.string().optional(),
  sizeCode: z.enum(sizeCodes),
  frameOption: z.enum(frameOptions),
  price: z.number().nonnegative(),
  stockQuantity: z.number().int().nonnegative().nullable().optional(),
});

export const artworkSchema = z.object({
  title: z.string().min(1).max(120),
  slug: slugSchema.optional(),
  shortDescription: z.string().max(280).optional().or(z.literal("")),
  description: z.string().max(4000).optional().or(z.literal("")),
  category: z.enum(categories).optional(),
  medium: z.string().max(80).optional().or(z.literal("")),
  yearCreated: z.number().int().min(1800).max(2100).optional(),
  tags: z.array(z.string().min(1).max(40)).max(20).optional(),
  basePrice: z.number().nonnegative(),
  currency: z.enum(currencyCodes),
  isLimitedEdition: z.boolean().optional(),
  editionSize: z.number().int().positive().optional(),
  variants: z.array(artworkVariantSchema).max(20).optional(),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  imageWidth: z.number().int().positive().optional(),
  imageHeight: z.number().int().positive().optional(),
  isPublished: z.boolean().optional(),
});

export type ArtworkInput = z.infer<typeof artworkSchema>;

export const aiGenerateSchema = z.object({
  artworkId: z.string().optional(),
  tone: z.enum(toneIds).default("simple"),
  notes: z.string().max(800).optional(),
  medium: z.string().max(80).optional(),
  category: z.enum(categories).optional(),
  audience: z.string().max(120).optional(),
  language: z.string().max(40).default("English"),
  imageUrl: z.string().url().optional(),
  includeOriginal: z.boolean().optional(),
  includeLimitedEdition: z.boolean().optional(),
});

export const aiRewriteSchema = z.object({
  text: z.string().min(1).max(4000),
  action: z.enum([
    "regenerate",
    "simpler",
    "luxury",
    "poetic",
    "shorter",
    "nigerian",
    "seo",
    "premium",
    "emotional",
  ]),
  tone: z.enum(toneIds).optional(),
});

export const checkoutSchema = z.object({
  storeSlug: slugSchema,
  artworkId: z.string(),
  variantId: z.string().optional(),
  sizeCode: z.enum(sizeCodes).optional(),
  frameOption: z.enum(frameOptions).optional(),
  quantity: z.number().int().positive().max(20).default(1),
  customer: z.object({
    name: z.string().min(2).max(80),
    phone: z
      .string()
      .min(7)
      .max(20)
      .regex(/^[+0-9 ()-]+$/),
    email: z.string().email().optional().or(z.literal("")),
    deliveryAddress: z.string().min(4).max(280),
    note: z.string().max(500).optional().or(z.literal("")),
  }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const orderStatusUpdateSchema = z.object({
  orderStatus: z.enum(ORDER_STATUSES).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
});
