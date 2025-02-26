import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://relay.amazon.com/loadboard/*"],
  all_frames: true
}

export const getStyle = (): HTMLStyleElement => {
  const baseFontSize = 16

  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize
    return `${pixelsValue}px`
  })

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

// Set up a MutationObserver to handle SPA navigation and tab changes
let observer = null

export const mount = async () => {
  // Set up observer to watch for DOM changes
  if (!observer) {
    observer = new MutationObserver((mutations, obs) => {
      // Check if we're on the orders page and the table exists
      if (isOrdersPage()) {
        const mountPoint = getMountPoint()
        if (mountPoint) {
          // Keep observing to handle tab changes
          return true
        }
      }
      return false
    })

    // Observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  // Initial check
  return isOrdersPage()
}

export const getInlineAnchor = () => {
  return {
    element: getMountPoint(),
    insertPosition: "afterbegin"
  }
}

const ProcessOrdersButton = () => {
  const handleClick = () => {
    console.log("Process orders clicked!")
  }

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors ml-4">
      Process Orders
    </button>
  )
}

export default ProcessOrdersButton