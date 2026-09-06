import { Metadata } from "next"
import ProfilePhone from "@modules/account/components/profile-phone"
import ProfileBillingAddress from "@modules/account/components/profile-billing-address"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfileName from "@modules/account/components/profile-name"
import ProfilePassword from "@modules/account/components/profile-password"
import { notFound } from "next/navigation"
import { listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Your profile",
  description: "Manage your Foodiehan profile and account details.",
}

export default async function Profile() {
  const [customer, regions] = await Promise.all([
    retrieveCustomer(),
    listRegions(),
  ])
  if (!customer) return null
  if (!regions) notFound()
  return (
    <div className="w-full" data-testid="profile-page-wrapper">
      <div className="mb-8">
        <p className="eyebrow mb-3">Make yourself at home</p>
        <h1 className="page-title">Your profile.</h1>
        <p className="page-description mt-4">
          The little details that make your next visit easier.
        </p>
      </div>
      <div className="flex w-full flex-col gap-4">
        <ProfileName customer={customer} />
        <ProfileEmail customer={customer} />
        <ProfilePhone customer={customer} />
        <ProfileBillingAddress customer={customer} regions={regions} />
        <ProfilePassword customer={customer} />
      </div>
    </div>
  )
}
