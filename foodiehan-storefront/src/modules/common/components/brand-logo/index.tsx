import Image from "next/image"

export default function BrandLogo({ priority = false }: { priority?: boolean }) {
  return (
    <Image
      src="/logo-en.svg"
      alt="FoodieHan"
      width={541}
      height={473}
      className="brand-logo"
      priority={priority}
    />
  )
}
