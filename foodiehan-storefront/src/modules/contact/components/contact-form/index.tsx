"use client"
import { FormEvent, useState } from "react"

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle")
  const [error, setError] = useState("")
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus("submitting")
    setError("")
    try {
      const data = Object.fromEntries(new FormData(form).entries())
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!response.ok)
        throw new Error(
          result.message || "Your message could not be sent. Please try again."
        )
      setStatus("success")
      form.reset()
    } catch (error) {
      setStatus("error")
      setError(
        error instanceof Error
          ? error.message
          : "Your message could not be sent. Please try again."
      )
    }
  }
  if (status === "success")
    return (
      <div role="status" className="text-center py-12">
        <div className="mx-auto mb-5 w-14 h-14 flex items-center justify-center bg-[#eaece1] rounded-full text-2xl text-[#323c2b]">
          ✓
        </div>
        <h3 className="font-serif text-3xl mb-4">Thanks for saying hello.</h3>
        <p className="page-description">
          Your message has been received. We’ll reply to the email address you
          shared.
        </p>
        <button
          className="button-secondary mt-7"
          onClick={() => setStatus("idle")}
        >
          Send another note
        </button>
      </div>
    )
  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-6">
      <div>
        <label htmlFor="contact-name" className="store-label">
          Your name *
        </label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          required
          maxLength={100}
          className="store-input"
          placeholder="First and last name"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="store-label">
          Email address *
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={200}
          className="store-input"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="contact-topic" className="store-label">
          What’s on your mind? *
        </label>
        <select
          id="contact-topic"
          name="topic"
          className="store-input"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Select a topic
          </option>
          <option>Order enquiry</option>
          <option>Products & ingredients</option>
          <option>Partnerships</option>
          <option>Feedback</option>
          <option>Something else</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-order" className="store-label">
          Order number <span className="font-normal">(optional)</span>
        </label>
        <input
          id="contact-order"
          name="order"
          maxLength={80}
          className="store-input"
          placeholder="e.g. 1001"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="contact-message" className="store-label">
          Your message *
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          className="store-input resize-y"
          placeholder="Tell us a little more…"
        />
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {status === "error" && (
        <p
          role="alert"
          className="sm:col-span-2 rounded-lg bg-rose-50 p-4 text-sm text-rose-800"
        >
          {error}
        </p>
      )}
      <div className="sm:col-span-2 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
        <p className="text-xs leading-5 text-[#73766c] max-w-[250px]">
          We’ll use these details to respond to your enquiry.
        </p>
        <button
          type="submit"
          className="button-primary shrink-0 disabled:opacity-60"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Send message"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </form>
  )
}
