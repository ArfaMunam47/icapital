/**
 * Central, editable business information for iCapital.
 * Every value starts unverified (null / verified: false). Unverified items render only in
 * development builds, clearly marked as placeholders, and are hidden on the published site.
 */
export const showUnverified = import.meta.env.DEV;

type Fact = { label: string; value: string | null };

/** Fill a value once the business owner confirms it. Empty values never publish. */
export const credibility: Fact[] = [
  { label: "Founded", value: null },
  { label: "Years of experience", value: null },
  { label: "Legal business name", value: null },
  { label: "Regulatory authority", value: null },
  { label: "Registration number", value: null },
  { label: "Verified credentials", value: null },
  { label: "Business address", value: null },
];

/** Provisional categories. Set verified: true only after the owner confirms the service. */
export const services = [
  { name: "Personal Financial Planning", verified: false },
  { name: "Investment Guidance", verified: false },
  { name: "Wealth and Legacy Planning", verified: false },
  { name: "Corporate and Institutional Solutions", verified: false },
];

export const approach = [
  { step: "Discover", text: "Understand circumstances, priorities and objectives." },
  { step: "Define", text: "Explore suitable approaches based on what you need." },
  { step: "Navigate", text: "Review and adapt the approach as life evolves." },
];

/** Legal pages: add an href once the approved document exists. */
export const legalLinks: { label: string; href: string | null }[] = [
  { label: "Privacy Policy", href: null },
  { label: "Terms and Conditions", href: null },
  { label: "Regulatory Disclosures", href: null },
  { label: "Risk Disclosures", href: null },
];

export const contactInfo: Fact[] = [
  { label: "Email", value: null },
  { label: "Phone", value: null },
  { label: "Office", value: null },
];

export const visibleFacts = (facts: Fact[]) =>
  facts.filter((f) => f.value || showUnverified).map((f) => ({ label: f.label, value: f.value ?? "[Dev placeholder]", placeholder: !f.value }));
export const visibleServices = () => services.filter((s) => s.verified || showUnverified);
export const visibleLegal = () => legalLinks.filter((l) => l.href || showUnverified);
