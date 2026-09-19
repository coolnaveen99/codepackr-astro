import { useState, type FormEvent } from "react";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxLtRspOxZaKhGdikBBlAjJk3ndSibOs0t3Im2Xf-K0podjAPItb90iOA9mDjRAbuT_Bg/exec";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@") || message.trim().length < 5) {
      setError("Enter a valid email and message.");
      return;
    }
    setBusy(true);
    const params = new URLSearchParams({
      name: name.trim() || "Anonymous",
      email: email.trim(),
      subject: "[Astro] Contact",
      message: message.trim(),
      category: "Feedback & General Comment",
      source: "astro.codepackr.com",
      timestamp: new Date().toISOString(),
    });
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      setDone(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Network issue. Email codepackr@gmail.com");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h2 className="font-display text-2xl">Contact</h2>
      <p className="mt-2 text-sm text-muted">Same form endpoint as codepackr.com — codepackr@gmail.com</p>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {done ? (
        <p className="mt-6 text-sm">Message sent. Thank you.</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm" />
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm" />
          <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm" />
          <button disabled={busy} type="submit" className="h-9 rounded-md bg-ink px-4 text-sm text-accent-fg disabled:opacity-50">
            {busy ? "Sending…" : "Send"}
          </button>
        </form>
      )}
    </main>
  );
}
