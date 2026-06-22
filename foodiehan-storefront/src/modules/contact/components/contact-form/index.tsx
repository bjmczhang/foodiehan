"use client"

import { useState } from "react"

type FormData = {
  name: string
  email: string
  phone: string
  storeLocation: string
  message: string
}

type FormStatus = "idle" | "submitting" | "success" | "error"

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  storeLocation: "",
  message: "",
}

const inputClasses =
  "w-full px-0 py-3 text-sm bg-transparent border-0 border-b transition-colors duration-200 focus:outline-none focus:ring-0"
const labelClasses = "block mb-1 text-xs font-medium uppercase tracking-[0.1em]"

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    setErrorMessage("")

    try {
      // TODO: Replace with actual API endpoint when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStatus("success")
      setFormData(initialFormData)
    } catch (err) {
      setStatus("error")
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[var(--color-brand)]">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3
          className="mb-2 text-2xl font-light"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "var(--color-text-primary)",
          }}
        >
          Thank You!
        </h3>
        <p className="text-[var(--color-text-secondary)]">
          Your message has been sent. We&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-[var(--color-brand)] hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className={labelClasses}>
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your name"
          className={inputClasses}
          style={{
            color: "var(--color-text-primary)",
            borderColor: "var(--color-surface-off)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-brand)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--color-surface-off)"
          }}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className={labelClasses}>
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your@email.com"
          className={inputClasses}
          style={{
            color: "var(--color-text-primary)",
            borderColor: "var(--color-surface-off)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-brand)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--color-surface-off)"
          }}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="contact-phone" className={labelClasses}>
          Phone
        </label>
        <input
          id="contact-phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+61 4XX XXX XXX"
          className={inputClasses}
          style={{
            color: "var(--color-text-primary)",
            borderColor: "var(--color-surface-off)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-brand)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--color-surface-off)"
          }}
        />
      </div>

      {/* Store Location */}
      <div>
        <label htmlFor="contact-storeLocation" className={labelClasses}>
          Store Location
        </label>
        <select
          id="contact-storeLocation"
          name="storeLocation"
          value={formData.storeLocation}
          onChange={handleChange}
          className={inputClasses}
          style={{
            color: "var(--color-text-primary)",
            borderColor: "var(--color-surface-off)",
            backgroundColor: "transparent",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-brand)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--color-surface-off)"
          }}
        >
          <option value="">Select a store</option>
          <option value="sydney">Sydney — Bakery Street</option>
          <option value="chatswood">Chatswood</option>
          <option value="parramatta">Parramatta</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className={labelClasses}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="How can we help you?"
          className={inputClasses}
          style={{
            color: "var(--color-text-primary)",
            borderColor: "var(--color-surface-off)",
            resize: "vertical",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-brand)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--color-surface-off)"
          }}
        />
      </div>

      {/* Error message */}
      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-brand-filled disabled:opacity-50 disabled:cursor-not-allowed"
          style={
            status === "submitting"
              ? { backgroundColor: "var(--color-text-muted)" }
              : undefined
          }
        >
          {status === "submitting" ? (
            <>
              <svg
                className="w-4 h-4 mr-2 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Sending...
            </>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </form>
  )
}
