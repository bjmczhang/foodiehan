import { redirect } from "next/navigation"
export default async function TransferActionPage({
  params,
}: {
  params: Promise<{ countryCode: string; id: string; token: string }>
}) {
  const { countryCode, id, token } = await params
  redirect(
    `/${countryCode}/order/${encodeURIComponent(
      id
    )}/transfer/${encodeURIComponent(token)}`
  )
}
