"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
export function Pagination({
  page,
  totalPages,
  "data-testid": dataTestId,
}: {
  page: number
  totalPages: number
  "data-testid"?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const goToPage = (next: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", next.toString())
    router.push(`${pathname}?${params.toString()}`)
  }
  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter(
    (number) =>
      number === 1 || number === totalPages || Math.abs(number - page) <= 1
  )
  return (
    <nav
      aria-label="Product pagination"
      className="flex items-center justify-center gap-2 mt-14 border-t border-[#e2e4dc] pt-8"
      data-testid={dataTestId}
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
        className="w-10 h-10 border border-[#e2e4dc] bg-white rounded-full disabled:opacity-30 hover:border-[#323c2b]"
      >
        ←
      </button>
      {visiblePages.map((number, index) => (
        <span className="flex items-center gap-2" key={number}>
          {index > 0 && number - visiblePages[index - 1] > 1 && (
            <span className="text-[#73766c] px-1">…</span>
          )}
          <button
            type="button"
            aria-label={`Page ${number}`}
            aria-current={number === page ? "page" : undefined}
            disabled={number === page}
            onClick={() => goToPage(number)}
            className={`w-10 h-10 rounded-full text-sm border transition-colors ${
              number === page
                ? "bg-[#323c2b] text-white border-[#323c2b]"
                : "border-[#e2e4dc] bg-white hover:border-[#323c2b]"
            }`}
          >
            {number}
          </button>
        </span>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => goToPage(page + 1)}
        className="w-10 h-10 border border-[#e2e4dc] bg-white rounded-full disabled:opacity-30 hover:border-[#323c2b]"
      >
        →
      </button>
    </nav>
  )
}
