"use client"

import React, { useState } from "react"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return
    setStatus("sending")
    try {
      // Placeholder: wire to an API endpoint if available
      await new Promise((res) => setTimeout(res, 600))
      setStatus("success")
      setEmail("")
    } catch (err) {
      setStatus("error")
    }
  }

  return (
    <form className="flex gap-2" onSubmit={onSubmit}>
      <input
        placeholder="Email address"
        className="flex-1 px-3 py-2 border border-[var(--color-border)] bg-[var(--color-surface)] text-sm"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-[var(--color-brand)] text-white font-semibold"
        disabled={status === "sending"}
      >
        {status === "sending"
          ? "Joining..."
          : status === "success"
          ? "Joined"
          : "Join"}
      </button>
    </form>
  )
}
