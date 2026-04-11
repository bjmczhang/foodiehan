import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import NewsletterForm from "./newsletter-form"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="w-full bg-[var(--color-bg-darker)] text-[var(--color-text-light)]">
      <div className="py-12 content-container">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 small:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <LocalizedClientLink
              href="/"
              className="text-2xl font-bold text-white uppercase"
            >
              FoodieHan
            </LocalizedClientLink>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              Artisan bakery crafting breads and pastries daily. Fresh
              ingredients, local suppliers.
            </p>
            <p className="mt-4 text-sm text-[var(--color-brand)]">
              Contact: +61 2 9000 0000
            </p>
          </div>

          {productCategories && productCategories?.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-white uppercase">
                Categories
              </h4>
              <ul
                className="grid grid-cols-1 gap-2"
                data-testid="footer-categories"
              >
                {productCategories?.slice(0, 6).map((c) => {
                  if (c.parent_category) return null
                  return (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-[var(--color-brand)] text-[var(--color-text-light)]"
                        href={`/categories/${c.handle}`}
                      >
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {collections && collections.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-white uppercase">
                Collections
              </h4>
              <ul className="grid grid-cols-1 gap-2">
                {collections?.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      className="hover:text-[var(--color-brand)] text-[var(--color-text-light)]"
                      href={`/collections/${c.handle}`}
                    >
                      {c.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white uppercase">
              Join The Club
            </h4>
            <p className="text-sm text-[var(--color-text-muted)] mb-3">
              Sign up for new arrivals &amp; special offers.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-bg-darkest)] py-6">
        <div className="content-container max-w-[1100px] mx-auto flex items-center justify-between">
          <Text className="text-sm text-[var(--color-text-faint)]">
            © {new Date().getFullYear()} FoodieHan. All rights reserved.
          </Text>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-[var(--color-text-light)] hover:text-[var(--color-brand)]"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-[var(--color-text-light)] hover:text-[var(--color-brand)]"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-[var(--color-text-light)] hover:text-[var(--color-brand)]"
            >
              Pinterest
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
