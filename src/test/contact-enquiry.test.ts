import { describe, expect, it } from "vitest";
import { contactEnquirySchema, formatEnquiry } from "../lib/contact-enquiry";

const valid = { name: "Alex Taylor", email: "alex@example.com", enquiry: "Family / Individual", interest: "Planning your future", message: "I would like to discuss my future." };

describe("Ending enquiry validation", () => {
  for (const field of ["name", "email"]) {
    it(`requires ${field}`, () => {
      const result = contactEnquirySchema.safeParse({ ...valid, [field]: "" });
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(true);
    });
  }
  it("rejects an invalid email format", () => {
    expect(contactEnquirySchema.safeParse({ ...valid, email: "alex@" }).success).toBe(false);
  });
  it("accepts each specified enquiry type", () => {
    for (const enquiry of ["Family / Individual", "Institution", "Company"]) expect(contactEnquirySchema.safeParse({ ...valid, enquiry }).success).toBe(true);
    expect(contactEnquirySchema.safeParse({ ...valid, enquiry: "Other" }).success).toBe(false);
  });
  it("allows enquiry, interest and message to be left empty", () => {
    const result = contactEnquirySchema.safeParse({ name: "Alex Taylor", email: "alex@example.com", enquiry: "", interest: "", message: "" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.enquiry).toBe("");
      expect(result.data.interest).toBe("");
      expect(result.data.message).toBe("");
    }
  });
  it("keeps prepared details without treating them as a submission", () => {
    const result = contactEnquirySchema.parse(valid);
    expect(result.name).toBe("Alex Taylor");
    expect(formatEnquiry(result)).toContain("alex@example.com");
  });
});
