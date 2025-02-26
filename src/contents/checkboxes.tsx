import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"
import { useStorage } from "@plasmohq/storage/hook"

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

// This function returns a list of elements to inject content before
export const getInlineAnchorList: PlasmoGetInlineAnchorList = () => {
  const orderIdElements = document.getElementsByClassName("order-id");
  hideOriginalCheckboxes();
  return Array.from(orderIdElements).map(element => ({
    element,
    position: "beforebegin"
  }))
}

// Plasmo will automatically call this function when the DOM changes
export const mount = async () => {
  // Only mount if we're on the orders page
  return isOrdersPage()
}



// Function to hide original checkboxes
const hideOriginalCheckboxes = () => {
  document.querySelectorAll('label').forEach(label => {
    if (label.querySelector('[role="checkbox"]')) {
      label.style.display = 'none'; // Hide the label
    }
  })
}


// Storage key for the array of selected order IDs
const SELECTED_ORDERS_KEY = "selectedOrders"

const Checkbox = ({ anchor }) => {
  // Extract the order ID from the element text content
  const orderIdElement = anchor.element
  const orderId = orderIdElement.textContent.trim()
  
  // Use the storage hook to manage selected orders
  const [selectedOrders, setSelectedOrders] = useStorage<string[]>(
    SELECTED_ORDERS_KEY,
    []
  )
  
  // Check if this order ID is in the array
  const isChecked = selectedOrders?.includes(orderId) || false
  
  const handleChange = (e) => {
    const newState = e.target.checked
    
    if (newState) {
      // Add order ID to array if not already present
      if (!selectedOrders?.includes(orderId)) {
        setSelectedOrders([...(selectedOrders || []), orderId])
      }
    } else {
      // Remove order ID from array
      setSelectedOrders((selectedOrders || []).filter(id => id !== orderId))
    }
  }

  return (
    <span className="inline-flex items-center mr-2">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        title={`Select order ${orderId}`}
      />
    </span>
  )
}

export default Checkbox