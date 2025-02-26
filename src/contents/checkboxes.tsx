import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"

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
  return document.getElementsByClassName("order-id")
}

// Plasmo will automatically call this function when the DOM changes
export const mount = async () => {
  // Simply return whether we're on the orders page
  return isOrdersPage()
}

export const getInlineAnchor = () => {
  return {
    element: getMountPoint(),
    insertPosition: "beforebegin"
  }
}

const AddCheckboxes = () => {
  const handleClick = () => {
    console.log("Process orders clicked!")
  }

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors">
      Checkbox
    </button>
  )
}

export default AddCheckboxes