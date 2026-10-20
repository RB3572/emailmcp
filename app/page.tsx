"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

const tones = ["Clear", "Warm", "Direct"] as const;

function draftFor(name: string, context: string, tone: string) {
  const greeting = name.trim() ? `Hi ${name.trim()},` : "Hello,";
  const signoff = tone === "Warm" ? "Warmly," : tone === "Direct" ? "Best," : "Thanks,";
  const opening = tone === "Warm" ? "I hope you are doing well." : tone === "Direct" ? "I am writing regarding the following:" : "I wanted to follow up about the following:";
  return `${greeting}\n\n${opening}\n\n${context.trim() || "[Add the details you want to communicate.]"}\n\n${signoff}\nRishi`;
}

export default function Home() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<(typeof tones)[number]>("Clear");
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const previewSubject = useMemo(() => subject.trim() || "Untitled message", [subject]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setDraft(draftFor(recipient, context, tone));
    setNotice("Draft ready");
  }

  async function copyDraft() {
    if (!draft) return;
    await navigator.clipboard.writeText(`Subject: ${previewSubject}\n\n${draft}`);
    setNotice("Copied to clipboard");
  }

  return (
    <main className="shell">
      <header className="topbar"><Link className="brand" href="/" aria-label="EmailMCP home"><span className="brand-mark" aria-hidden="true">E</span><span>EmailMCP</span></Link><span className="status"><i /> Local drafting workspace</span></header>
      <section className="intro"><p className="eyebrow">MESSAGE COMPOSER</p><h1>Write the next email with a little less friction.</h1><p className="lede">Build a clean first draft, tune its voice, and copy it into the mail client you already use.</p></section>
      <section className="workspace" aria-label="Email draft composer">
        <form className="compose" onSubmit={handleSubmit}>
          <div className="panel-heading"><span>New draft</span><span className="shortcut">Draft locally</span></div>
          <label>Recipient name<input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="Professor Lee" /></label>
          <label>Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Question about next week" /></label>
          <fieldset><legend>Tone</legend><div className="tone-row">{tones.map((item) => <button className={tone === item ? "tone active" : "tone"} type="button" onClick={() => setTone(item)} key={item}>{item}</button>)}</div></fieldset>
          <label>What do you need to say?<textarea value={context} onChange={(event) => setContext(event.target.value)} placeholder="Give the important context, request, and any deadline." /></label>
          <button className="primary" type="submit">Generate draft <span aria-hidden="true">→</span></button>
        </form>
        <article className="preview" aria-live="polite">
          <div className="panel-heading"><span>Preview</span>{notice && <span className="notice">{notice}</span>}</div>
          <div className="mail-card"><div className="mail-line"><span>To</span><strong>{recipient || "Recipient"}</strong></div><div className="mail-line"><span>Subject</span><strong>{previewSubject}</strong></div><div className={draft ? "draft-content filled" : "draft-content"}>{draft || "Your draft will appear here."}</div></div>
          <button className="copy" type="button" onClick={copyDraft} disabled={!draft}>Copy email</button>
        </article>
      </section>
      <footer>Nothing leaves this page until you choose to copy it.</footer>
    </main>
  );
}
