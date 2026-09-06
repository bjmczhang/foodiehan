import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  if (!customer) return null
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8">
        <p className="eyebrow mb-3">Ready for your next delivery</p>
        <h1 className="page-title">Your addresses.</h1>
        <p className="page-description mt-4">
          Home, work, or somewhere special. Save your favourite delivery spots
          for an easier checkout.
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
