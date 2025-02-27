import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import { Checkbox } from "~components/ui/checkbox"
import { useEffect, useState } from "react"
import { cn } from "~/lib/utils"

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
}

// Function to hide original checkboxes
const hideOriginalCheckboxes = () => {
  document.querySelectorAll('label').forEach(label => {
    if (label.querySelector('[role="checkbox"]')) {
      label.style.display = 'none'; // Hide the label
    }
  })
}

const AddCheckboxes = ({ anchor }) => {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    hideOriginalCheckboxes()
    setMounted(true)
  }, [])
  
  // Extract the order ID from the element text content
  const orderIdElement = anchor.element
  const orderId = orderIdElement.textContent.trim()
  
  // Use the storage hook to manage selected orders
  const [selectedOrders, setSelectedOrders] = useStorage({
    key: "selectedOrders",
    instance: new Storage({
      area: "local"
    }),

  })
  
  // Check if this order ID is in the array
  const isChecked = selectedOrders?.includes(orderId) || false
  
  // This is the correct way to handle checkbox changes with Radix UI
  const handleCheckedChange = (checked) => {
    console.log("Checkbox changed:", orderId, checked)
    
    if (checked) {
      // Add order ID to array if not already present
      if (!selectedOrders?.includes(orderId)) {
        const newSelectedOrders = [...(selectedOrders || []), orderId]
        console.log("Adding to selected orders:", newSelectedOrders)
        setSelectedOrders(newSelectedOrders)
      }
    } else {
      // Remove order ID from array
      const newSelectedOrders = (selectedOrders || []).filter(id => id !== orderId)
      console.log("Removing from selected orders:", newSelectedOrders)
      setSelectedOrders(newSelectedOrders)
    }
  }

  if (!mounted) return null

  return (
    <span 
      className={cn(
        "inline-flex items-center",
        "z-10 relative" // Ensure our checkbox is above other elements
      )}
      onClick={(e) => e.stopPropagation()} // Prevent click from propagating
    >
      <Checkbox 
        id={`checkbox-${orderId}`}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        className="cursor-pointer"
      />
    </span>
  )
}

export default AddCheckboxes