import { z } from "zod";

export const enquiryTypes = ["Family / Individual", "Institution", "Company"] as const;
export const interestAreas = ["Preserving wealth", "Growing wealth", "Planning your future"] as const;

const optionalText = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().or(z.literal("")).transform((v) => v ?? "");

export const contactEnquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your full name.").max(100, "Please keep your name under 100 characters."),
  email: z.string().trim().min(1, "Please enter your email address.").email("Please enter a valid email address.").max(255, "Please use a shorter email address."),
  enquiry: z.enum(enquiryTypes).optional().or(z.literal("")).transform((v) => v ?? ""),
  interest: z.enum(interestAreas).optional().or(z.literal("")).transform((v) => v ?? ""),
  message: optionalText(2000, "Please keep your message under 2000 characters."),
});

export type ContactEnquiry = z.infer<typeof contactEnquirySchema>;

export function formatEnquiry(values: ContactEnquiry) {
  return `iCapital enquiry — copy\n\nFull name: ${values.name}\nEmail: ${values.email}\nEnquiring as: ${values.enquiry || "—"}\nArea of interest: ${values.interest || "—"}\n\n${values.message}`;
}
