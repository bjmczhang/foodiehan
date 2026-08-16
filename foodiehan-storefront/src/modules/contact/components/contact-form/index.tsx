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
  "w-full px-3.5 py-2.5 small:py-3 text-sm text-[#1a1a1a] bg-white border border-[#d1d5db] focus:border-black focus:outline-none rounded-none transition-colors placeholder:text-[#999999]"
const labelClasses = "block mb-2 text-xs small:text-sm font-normal text-[#1a1a1a]"

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
      // Backend submission simulation / placeholder
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
        <div className="flex items-center justify-center w-14 h-14 mb-5 rounded-full bg-black text-white">
          <svg
            className="w-6 h-6"
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
          className="mb-2 text-2xl font-light text-[#1a1a1a]"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          Thank You!
        </h3>
        <p className="text-sm text-[#666666]">
          Your message has been sent. We&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-xs uppercase tracking-wider font-semibold text-black underline hover:opacity-75"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
            className={inputClasses}
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
            className={inputClasses}
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
            className={inputClasses}
          />
        </div>

        {/* Store Location */}
        <div>
          <label htmlFor="contact-storeLocation" className={labelClasses}>
            Store Location
          </label>
          <input
            id="contact-storeLocation"
            type="text"
            name="storeLocation"
            value={formData.storeLocation}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Message (Full width) */}
        <div className="md:col-span-2">
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
            className={`${inputClasses} resize-y min-h-[120px]`}
          />
        </div>

        {/* Error message */}
        {status === "error" && (
          <div className="md:col-span-2">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="md:col-span-2 pt-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="px-9 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {status === "submitting" ? (
              <>
                <svg
                  className="w-4 h-4 mr-2 animate-spin text-white"
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
                SENDING...
              </>
            ) : (
              "SEND"
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

