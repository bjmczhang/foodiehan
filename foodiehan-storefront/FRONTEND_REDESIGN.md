# FoodieHan frontend redesign

The storefront uses a shared cream and olive design with responsive layouts, consistent forms, clear empty states and keyboard-accessible menus and dialogs. Existing Medusa and Stripe integrations are retained.

## Coverage

- Home, About Us, Shop, search, categories, collections and product details.
- Search dialog, mobile navigation, shopping bag preview and footer.
- Cart and four-step checkout, including delivery/pickup, discounts, payment and review.
- Sign-in/register, account overview, profile, addresses, order history and order details.
- Order confirmation and transfer review; transfer links now require an explicit action instead of mutating an order on a GET request.
- Contact, FAQs, loading, empty and error states. `/online-order` redirects to `/store`.

Navigation: **About Us · Shop · Contact Us**, followed by search, account and bag icons.

Design tokens live in `src/styles/globals.css`; shared storefront classes and responsive rules live in `src/styles/storefront.css`.

## Contact delivery

The previous contact form simulated success. The replacement validates and submits to `/api/contact`. Configure these server-only environment variables to deliver enquiries:

```dotenv
CONTACT_WEBHOOK_URL=https://your-support-service.example/contact
# Optional authentication for your receiver:
CONTACT_WEBHOOK_TOKEN=your-server-side-token
```

The endpoint sends JSON containing `name`, `email`, `topic`, `order`, `message` and `source: "foodiehan-contact"`. The receiver must accept a POST and acknowledge successful receipt with a 2xx response. Without a configured receiver, the form reports that the message was not sent; form contents remain available for retry. No enquiry receiver has been configured during this redesign.

## Validation

```sh
pnpm check:types
pnpm check:prices
pnpm build
# With the backend and frontend running:
pnpm check:routes
```

The route checks use live catalogue data and cover all configured categories, search, price sorting, pagination, signed-out account paths, cart/empty checkout, transfer review, 404s, image optimization and contact validation. They do not place orders, create accounts, change customer data or send customer messages.

Next's production build enforces TypeScript checks. The existing ESLint 8.10 / Next ESLint plugin combination fails during rule initialization, so the existing build-time lint skip is retained.

Verified on 7 September 2026: production build (107 generated pages), TypeScript, seven pricing edge cases, 25 live routes, branded 404, optimized hero image and contact rejection states. The unconfigured contact receiver was also checked separately and correctly returned 503 without sending a message.

Remaining acceptance checks: browser-based desktop/mobile visual and keyboard checks, an authenticated account session, and a payment test with the configured provider. Browser automation was unavailable in this environment. Sign-in email and password changes remain support-assisted because the original application has no working backend flow for those changes.
