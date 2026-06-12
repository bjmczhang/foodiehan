import { useEffect } from "react"
import type { WidgetConfig } from "@medusajs/admin-sdk"

const LoginLogo = () => {
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      svg[viewBox="0 0 400 400"] {
        display: none;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="flex justify-center pb-4">
      <img
        src="/logo.svg"
        alt="Foodiehan"
        style={{
          height: "48px",
          filter: "invert(1)",
        }}
      />
    </div>
  )
}

export const config: WidgetConfig = {
  zone: "login.before",
}

export default LoginLogo
