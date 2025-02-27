import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import { Checkbox } from "~components/ui/checkbox"
const storage = new Storage({area: "local"})

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


// This function returns a list of elements to inject content before
export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const anchors = document.querySelectorAll('.order-id')
  return Array.from(anchors).map((element) => ({
      element,
      insertPosition: "beforebegin",
  }))

};



// Function to hide original checkboxes
const hideOriginalCheckboxes = () => {
  document.querySelectorAll('label').forEach(label => {
    if (label.querySelector('[role="checkbox"]')) {
      label.style.display = 'none'; // Hide the label
    }
  })
}


const AddCheckboxes = ({ anchor }) => {
  hideOriginalCheckboxes();
  // Extract the order ID from the element text content
  const orderIdElement = anchor.element
  const orderId = orderIdElement.textContent.trim()
  
  // Use the storage hook to manage selected orders
  const [selectedOrders, setSelectedOrders] = useStorage({
    key: "selectedOrders",
    instance: new Storage({
      area: "local"
    }),
  }, [])
  
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
    <span className="inline-flex items-center">
      <Checkbox 
        checked={isChecked}
        onChange={handleChange}
      />
    </span>
  )
}

export default AddCheckboxes