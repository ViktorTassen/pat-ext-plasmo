import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"
import { Storage } from "@plasmohq/storage"
import { cn } from "~lib/utils"
import { Checkbox } from "~/components/ui/checkbox"
import { useEffect, useRef, useState } from "react"
import { ShadowDomPortalProvider } from "~/lib/shadcn-portal"
import { useOrderSelection } from "~/lib/order-context"

export const config: PlasmoCSConfig = {
  matches: ["https://relay.amazon.com/loadboard/*"],
  all_frames: true
}

// Export the style element for Plasmo to use
export const getStyle = () => {
  const styleElement = document.createElement("style")
  styleElement.textContent = cssText
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

// Function to hide original checkboxes - improved version
const hideOriginalCheckboxes = () => {
  document.querySelectorAll('label').forEach(label => {
    if (label.querySelector('[role="checkbox"]')) {
      label.style.display = 'none'; // Hide the label containing the checkbox
    }
  })
}

const AddCheckboxes = ({ anchor }) => {
  hideOriginalCheckboxes()
  
  // Extract the order ID from the element text content
  const orderIdElement = anchor.element
  const orderId = orderIdElement.textContent.trim()
  
  // Use the context for selected orders
  const { selectedOrders, toggleOrderSelection } = useOrderSelection()
  
  // Check if this order ID is in the array
  const isChecked = selectedOrders?.includes(orderId) || false
  
  // Handle checkbox changes
  const handleCheckedChange = (checked) => {
    console.log("Checkbox changed:", orderId, checked)
    toggleOrderSelection(orderId, checked)
  }

  return (
    <ShadowDomPortalProvider>
      <Checkbox 
        id={`checkbox-${orderId}`}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        className="cursor-pointer checkbox-unique"
      />
    </ShadowDomPortalProvider>
  )
}

export default AddCheckboxes