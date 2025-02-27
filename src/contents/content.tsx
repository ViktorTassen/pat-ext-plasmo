import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import { useRef, useEffect } from "react"
import { ShadowDomPortalProvider } from "~/lib/shadcn-portal"

export const config: PlasmoCSConfig = {
  matches: ["https://relay.amazon.com/loadboard/*"],
  all_frames: true
}

export const getStyle = (): HTMLStyleElement => {
  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
  const styleElement = document.createElement("style")
  styleElement.textContent = updatedCssText
  return styleElement
}

export const getInlineAnchor = () => {
  return {
    element: document.getElementById("show-order-table"),
    insertPosition: "afterbegin"
  }
}

const OrderManagementButton = () => {
  return (
    <ShadowDomPortalProvider>
      <div>3</div>
    </ShadowDomPortalProvider>
  )
}

export default OrderManagementButton