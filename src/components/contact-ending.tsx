import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { contactInfo, visibleFacts, visibleLegal } from "@/lib/business";
import { contactEnquirySchema, enquiryTypes, interestAreas, formatEnquiry, type ContactEnquiry } from "@/lib/contact-enquiry";

type Field = keyof ContactEnquiry;
const fields: Field[] = ["name", "email", "enquiry", "interest", "message"];

export function ContactEnding({ jump }: { jump: (scene: number) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [prepared, setPrepared] = useState<ContactEnquiry | null>(null);
  const [copying, setCopying] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const fieldProps = (field: Field) => ({
    id: `ending-${field}`, name: field, required: true,
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `ending-${field}-error` : undefined,
  });
  const error = (field: Field) => errors[field] ? <span className="contact-error" id={`ending-${field}-error`}>{errors[field]}</span> : null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = contactEnquirySchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    setCopyStatus("");
    if (!result.success) {
      const nextErrors: Partial<Record<Field, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as Field;
        if (!nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      setPrepared(null);
      const first = fields.find((field) => nextErrors[field]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setPrepared(result.data);
    setStatus("sending");
    const { error: insertError } = await supabase.from("contact_enquiries").insert(result.data);
    if (insertError) { setStatus("failed"); return; }
    setStatus("sent");
    formRef.current?.reset();
  }

  async function copy() {
    if (!prepared || copying) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(formatEnquiry(prepared));
      setCopyStatus("Enquiry copied. It has not been sent to iCapital.");
    } catch {
      setCopyStatus("Copying is unavailable. Your details remain in the form and have not been sent.");
    } finally {
      setCopying(false);
    }
  }

  return (
    <>
      <section id="contact" className="contact-ending" aria-labelledby="contact-ending-title">
        <div className="contact-ending-layout">
          <div className="contact-invitation">
            <p className="contact-eyebrow">Let’s start a conversation</p>
            <h2 id="contact-ending-title">Your <em>next chapter</em> starts with a conversation.</h2>
            <p className="contact-intro">Every financial journey is different. Tell us a little about what matters to you, and let’s explore how thoughtful advice can help you move forward with clarity.</p>
            <div className="contact-editorial"><span aria-hidden="true" />Careful thinking.<br />A shared direction.</div>
          </div>
          <form ref={formRef} className="contact-form" noValidate onSubmit={(e) => void submit(e)} onChange={() => { if (status !== "sending") { setPrepared(null); setCopyStatus(""); setStatus("idle"); } }} aria-labelledby="contact-form-title">
            <div className="contact-form-heading"><h3 id="contact-form-title">What matters to you?</h3><p>A little context. A clearer beginning.</p></div>
            <div className="contact-fields">
              <div className="contact-field"><label htmlFor="ending-name">Full name</label><input {...fieldProps("name")} autoComplete="name" placeholder="Your full name" />{error("name")}</div>
              <div className="contact-field"><label htmlFor="ending-email">Email address</label><input {...fieldProps("email")} type="email" autoComplete="email" placeholder="you@example.com" />{error("email")}</div>
              <div className="contact-field"><label htmlFor="ending-enquiry">I am enquiring as</label><select {...fieldProps("enquiry")} defaultValue=""><option value="" disabled>Select an option</option>{enquiryTypes.map((value) => <option key={value}>{value}</option>)}</select>{error("enquiry")}</div>
              <div className="contact-field"><label htmlFor="ending-interest">Area of interest</label><select {...fieldProps("interest")} defaultValue=""><option value="" disabled>Select an interest</option>{interestAreas.map((value) => <option key={value}>{value}</option>)}</select>{error("interest")}</div>
              <div className="contact-field contact-field-wide"><label htmlFor="ending-message">Message</label><textarea {...fieldProps("message")} rows={3} placeholder="Tell us what you have in mind…" />{error("message")}</div>
            </div>
            <Button type="submit" className="contact-submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Start a conversation"} <ArrowUpRight aria-hidden="true" /></Button>
            <p className="contact-privacy">Please don’t include account numbers or other sensitive financial details. We use your details only to reply to you.</p>
            <div className="contact-feedback" role="status" aria-live="polite">
              {status === "sent" && <p><strong>Thank you — your enquiry has been received.</strong></p>}
              {status === "failed" && prepared && <><p><strong>We couldn’t send your enquiry.</strong> Please try again, or copy it so nothing is lost.</p><Button type="button" variant="ghost" className="contact-copy" disabled={copying} onClick={() => void copy()}><Copy aria-hidden="true" />{copying ? "Copying…" : "Copy enquiry"}</Button></>}
              {copyStatus && <p>{copyStatus}</p>}
            </div>
          </form>
        </div>
      </section>
      <footer className="white-ending">
        <div className="white-ending-main">
          <div className="footer-brand"><Button variant="ghost" className="footer-logo" onClick={() => jump(0)} aria-label="iCapital home"><span><i>i</i>Capital</span><small>Wealth Management<br />Advisors</small></Button><p>The value is in the journey.</p>{visibleFacts(contactInfo).map((f) => <p key={f.label} className={f.placeholder ? "footer-contact is-placeholder" : "footer-contact"}>{f.label}: {f.value}</p>)}</div>
          <nav className="footer-chapters" aria-label="Footer chapters">
            <div><h3>The journey</h3>{[["Perspective", 1], ["Our compass", 3], ["Legacy", 4]].map(([label, scene]) => <Button key={label} variant="ghost" onClick={() => jump(Number(scene))}>{label}</Button>)}</div>
            <div><h3>A shared direction</h3>{[["Vision", 8], ["Clarity", 9], ["By your side", 11]].map(([label, scene]) => <Button key={label} variant="ghost" onClick={() => jump(Number(scene))}>{label}</Button>)}</div>
          </nav>
        </div>
        <div className="white-ending-legal"><span>© {new Date().getUTCFullYear()} iCapital</span>
          {visibleLegal().length > 0 && <nav className="footer-legal" aria-label="Legal">{visibleLegal().map((l) => l.href ? <a key={l.label} href={l.href}>{l.label}</a> : <span key={l.label} className="is-placeholder">{l.label} <sup className="dev-flag">dev</sup></span>)}</nav>}<Button variant="ghost" onClick={() => jump(0)} className="footer-replay">Back to the beginning <RotateCcw aria-hidden="true" /></Button></div>
      </footer>
    </>
  );
}