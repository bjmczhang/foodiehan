import TransferActions from "@modules/order/components/transfer-actions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
export default async function TransferPage({
  params,
}: {
  params: Promise<{ id: string; token: string }>
}) {
  const { id, token } = await params
  return (
    <div className="page-shell">
      <section className="surface-panel max-w-2xl mx-auto !p-8 small:!p-12">
        <p className="eyebrow mb-5">Order ownership</p>
        <h1 className="page-title !text-4xl">An order transfer request.</h1>
        <p className="page-description mt-6">
          You’ve received a request to transfer your order to another account.
          Review this request before choosing what to do.
        </p>
        <p className="my-6 rounded-lg bg-[#eeeee7] p-4 text-xs break-all">
          Order reference: {id}
        </p>
        <p className="text-sm leading-7 text-[#73766c] mb-7">
          Accepting gives the new owner access to this order. If you don’t
          recognise the request or want to keep the order in your account,
          decline the transfer.
        </p>
        <TransferActions id={id} token={token} />
        <LocalizedClientLink href="/contact" className="text-link mt-8">
          Need a hand? Contact us ↗
        </LocalizedClientLink>
      </section>
    </div>
  )
}
