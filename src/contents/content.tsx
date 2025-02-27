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

// Function to check if we're on the orders page
const isOrdersPage = () => {
  return (
    window.location.pathname === "/loadboard/orders" ||
    window.location.href.includes("/loadboard/orders")
  )
}

export const getMountPoint = () => {
  // Only proceed if we're on the orders page
  if (!isOrdersPage()) return null

  // Find the order table element
  return document.getElementById("show-order-table")
}

// Plasmo will automatically call this function when the DOM changes
export const mount = async () => {
  // Simply return whether we're on the orders page
  return isOrdersPage()
}

export const getInlineAnchor = () => {
  return {
    element: getMountPoint(),
    insertPosition: "afterbegin"
  }
}

const OrderManagementButton = () => {
  // State to control the visibility of the order management UI
  const [showOrderManagement, setShowOrderManagement] = useStorage({
    key: "showOrderManagement",
    instance: new Storage({
      area: "local"
    })
  }, false)

  // Get selected orders count
  const [selectedOrders] = useStorage({
    key: "selectedOrders",
    instance: new Storage({
      area: "local"
    })
  })

  const selectedCount = selectedOrders?.length || 0

  const toggleOrderManagement = () => {
    setShowOrderManagement(!showOrderManagement)
  }

  // Create a ref for the shadow root container
  const shadowRootRef = useRef<HTMLDivElement | null>(null)

  // Get the shadow root element
  useEffect(() => {
    // Find the shadow root container
    if (typeof document !== "undefined") {
      // The current element is already inside the shadow DOM
      const shadowHost = document.querySelector("plasmo-csui")
      if (shadowHost) {
        // Get the shadow root
        const shadowRoot = shadowHost.shadowRoot
        if (shadowRoot) {
          // Set the shadow root as the container
          shadowRootRef.current = shadowRoot as unknown as HTMLDivElement
        } else {
          // Fallback to the host element if shadow root is not available
          shadowRootRef.current = shadowHost as HTMLDivElement
        }
      }
    }
  }, [])

  return (
    <div className="mb-4">
      {showOrderManagement ? (
        <div className="relative z-50">
          <OrderManagement 
            onClose={() => setShowOrderManagement(false)} 
            shadowRoot={shadowRootRef.current}
          />
        </div>
      ) : (
        <button
          onClick={toggleOrderManagement}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-colors mb-2 flex items-center gap-2">
          Manage Orders
          {selectedCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {selectedCount}
            </span>
          )}
        </button>
      )}
    </div>
  )
}

export default OrderManagementButton