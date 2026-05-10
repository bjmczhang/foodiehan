const features = [
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4zm0 4c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6zm0 28c-5 0-10-2.5-12-6 0-4 8-6 12-6s12 2 12 6c-2 3.5-7 6-12 6z"
          fill="white"
        />
      </svg>
    ),
    title: "Artisan craft",
    description:
      "Every loaf is shaped by hand using time-honoured techniques passed down through generations.",
  },
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M24 4L6 14v4c0 12.5 7.6 24 18 26 10.4-2 18-13.5 18-26v-4L24 4zm-2 12h4v4h-4v-4zm0 8h4v12h-4V24z"
          fill="white"
        />
      </svg>
    ),
    title: "Premium ingredients",
    description:
      "We source the finest flour, butter, and seasonal produce from trusted local farms.",
  },
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M24 6C14 6 6 14 6 24s8 18 18 18 18-8 18-18S34 6 24 6zm-2 10c3.3 0 6 2.7 6 6 0 1.1-.3 2.1-.8 3l3.6 3.6c1 1 1 2.6 0 3.6s-2.6 1-3.6 0l-3.6-3.6c-.9.5-1.9.8-3 .8-3.3 0-6-2.7-6-6s2.7-6 6-6z"
          fill="white"
        />
      </svg>
    ),
    title: "Baked fresh daily",
    description:
      "Our ovens run from dawn to dusk, so every bite tastes like it just left the bakery.",
  },
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M24 4C13 4 4 9.6 4 16.5V34c0 6.9 9 12.5 20 12.5S44 40.9 44 34V16.5C44 9.6 35 4 24 4zm0 6c5.5 0 10 2.9 10 6.5S29.5 23 24 23s-10-2.9-10-6.5S18.5 10 24 10zm-10 18c2.5 2.2 6 3.5 10 3.5s7.5-1.3 10-3.5V34c0 2.1-4.5 6.5-10 6.5S14 36.1 14 34v-6z"
          fill="white"
        />
      </svg>
    ),
    title: "Asian heritage",
    description:
      "Blending Eastern flavours with Western baking for pastries that tell a story of two worlds.",
  },
]

export default function BrandFeatures() {
  return (
    <section
      className="py-16 small:py-24"
      style={{ background: "var(--color-bg-dark)" }}
    >
      <div className="content-container">
        <div className="grid grid-cols-2 gap-10 text-center small:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-y-5">
              {f.icon}
              <div className="flex flex-col gap-y-2">
                <h2 className="text-base font-semibold text-white">
                  {f.title}
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-light)" }}
                >
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
