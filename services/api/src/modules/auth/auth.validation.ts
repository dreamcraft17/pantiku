import { UserRole } from "@prisma/client";
import { z } from "zod";

const baseRegisterSchema = z.object({
  accountType: z
    .nativeEnum(UserRole)
    .refine((value) => value !== UserRole.ADMIN, "ADMIN registration is not allowed"),
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).optional(),
  managerName: z.string().min(2).optional(),
  phone: z.string().min(6).optional(),
  skills: z.string().optional(),
  city: z.string().optional(),
  orphanageName: z.string().min(2).optional(),
  address: z.string().min(5).optional(),
  province: z.string().min(2).optional(),
  contactPhone: z.string().min(6).optional(),
  estimatedChildrenCount: z.number().int().positive().optional()
});

export const registerSchema = baseRegisterSchema.superRefine((value, ctx) => {
  if (value.accountType === UserRole.DONOR) {
    if (!value.fullName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Nama wajib diisi", path: ["fullName"] });
    return;
  }
  if (value.accountType === UserRole.VOLUNTEER) {
    if (!value.fullName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Nama wajib diisi", path: ["fullName"] });
    return;
  }
  if (value.accountType === UserRole.ORPHANAGE_MANAGER) {
    if (!value.managerName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Nama pengelola wajib diisi", path: ["managerName"] });
    if (!value.phone) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Nomor telepon wajib diisi", path: ["phone"] });
    if (!value.orphanageName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Nama panti wajib diisi", path: ["orphanageName"] });
    if (!value.address) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Alamat wajib diisi", path: ["address"] });
    if (!value.city) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Kota wajib diisi", path: ["city"] });
    if (!value.province) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Provinsi wajib diisi", path: ["province"] });
    if (!value.contactPhone) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Kontak panti wajib diisi", path: ["contactPhone"] });
    if (!value.estimatedChildrenCount) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Estimasi jumlah anak wajib diisi", path: ["estimatedChildrenCount"] });
    }
  }
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(16)
});
