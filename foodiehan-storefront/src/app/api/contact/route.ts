import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin")
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json(
      { message: "Please send your message from our contact page." },
      { status: 403 }
    )
  }
  let data: Record<string, unknown>
  try {
    const raw = await request.text()
    if (raw.length > 16000)
      return NextResponse.json(
        { message: "Your message is too long." },
        { status: 413 }
      )
    data = JSON.parse(raw)
    if (!data || typeof data !== "object" || Array.isArray(data))
      throw new Error()
  } catch {
    return NextResponse.json(
      { message: "Please check your message and try again." },
      { status: 400 }
    )
  }
  if (data.website)
    return NextResponse.json(
      { message: "Unable to submit this message." },
      { status: 400 }
    )
  const fields = ["name", "email", "topic", "order", "message"] as const
  const cleaned = Object.fromEntries(
    fields.map((key) => [
      key,
      typeof data[key] === "string" ? (data[key] as string).trim() : "",
    ])
  )
  if (
    !cleaned.name ||
    cleaned.name.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email) ||
    cleaned.email.length > 200 ||
    !cleaned.topic ||
    cleaned.topic.length > 80 ||
    cleaned.order.length > 80 ||
    cleaned.message.length < 10 ||
    cleaned.message.length > 5000
  ) {
    return NextResponse.json(
      {
        message:
          "Please enter your name, a valid email, a topic and a message between 10 and 5,000 characters.",
      },
      { status: 400 }
    )
  }
  const webhook = process.env.CONTACT_WEBHOOK_URL
  if (!webhook) {
    return NextResponse.json(
      {
        message:
          "Our message service is temporarily unavailable. Your note has not been sent. Please try again later.",
      },
      { status: 503 }
    )
  }
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.CONTACT_WEBHOOK_TOKEN
            ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({ ...cleaned, source: "foodiehan-contact" }),
        signal: controller.signal,
        redirect: "error",
      })
      if (!response.ok) throw new Error("Delivery failed")
    } finally {
      clearTimeout(timeout)
    }
    return NextResponse.json({ message: "Your message has been received." })
  } catch {
    return NextResponse.json(
      {
        message:
          "Your message could not be delivered. Please try again in a moment.",
      },
      { status: 502 }
    )
  }
}
