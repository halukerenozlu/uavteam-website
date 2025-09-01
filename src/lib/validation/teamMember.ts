import { z } from "zod";

export const MemberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "İsim en az 2 karakter"),
  role: z.string().optional().or(z.literal("")),
  squad: z.enum(["mechanical", "avionics", "software"]).optional().nullable(),
  isCaptain: z.coerce.boolean().optional().default(false),
  isPresident: z.coerce.boolean().optional().default(false),
  imageUrl: z
    .string()
    .url("Geçerli bir URL girin")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).default(0),
});

export type MemberInput = z.infer<typeof MemberSchema>;
