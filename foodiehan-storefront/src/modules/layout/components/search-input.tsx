"use client"
import { FormEvent, useState } from "react"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { MagnifyingGlass, XMark, ArrowRight } from "@medusajs/icons"
import { useParams, useRouter } from "next/navigation"

export default function SearchInput() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { countryCode } = useParams()
  function search(value: string) {
    if (!value.trim()) return
    router.push(`/${countryCode}/search?q=${encodeURIComponent(value.trim())}`)
    setOpen(false)
  }
  function submit(e: FormEvent) {
    e.preventDefault()
    search(query)
  }
  return (
    <>
      <button
        className="icon-button"
        aria-label="Open search"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlass className="h-5 w-5" />
      </button>
      <Dialog open={open} onClose={setOpen} className="relative z-[80]">
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 overflow-y-auto p-4 pt-24 small:pt-40">
          <DialogPanel className="mx-auto w-full max-w-2xl rounded-2xl bg-[#f8f7f3] p-7 small:p-10 shadow-xl">
            <div className="flex justify-between items-center mb-7">
              <DialogTitle className="section-heading !text-3xl">
                Find your next favourite.
              </DialogTitle>
              <button
                className="icon-button"
                aria-label="Close search"
                onClick={() => setOpen(false)}
              >
                <XMark />
              </button>
            </div>
            <form onSubmit={submit} className="flex gap-3">
              <label htmlFor="site-search" className="sr-only">
                Search products
              </label>
              <input
                id="site-search"
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="store-input min-w-0"
                placeholder="Try a butter bun or something sweet…"
                required
                maxLength={100}
              />
              <button
                type="submit"
                className="button-primary !px-4"
                aria-label="Search"
              >
                <ArrowRight />
              </button>
            </form>
            <p className="eyebrow mt-8 mb-4">A little inspiration</p>
            <div className="flex flex-wrap gap-2">
              {["Butter", "Red bean", "Sweet potato", "Kimchi"].map((term) => (
                <button
                  key={term}
                  onClick={() => search(term)}
                  className="button-secondary !min-h-0 !px-4 !py-2 !text-xs"
                >
                  {term}
                </button>
              ))}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
