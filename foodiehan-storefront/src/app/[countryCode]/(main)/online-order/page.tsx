import { redirect } from "next/navigation"
type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}
export default async function OnlineOrderPage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") query.set(key, value)
    else if (Array.isArray(value))
      value.forEach((item) => query.append(key, item))
  }
  redirect(`/${countryCode}/store${query.size ? `?${query.toString()}` : ""}`)
}
