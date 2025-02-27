import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import { useRef, useEffect } from "react"

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
  
}

export default OrderManagementButton