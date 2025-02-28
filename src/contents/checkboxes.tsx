import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"
import { cn } from "~lib/utils"
import { Checkbox } from "~/components/ui/checkbox"
import { useEffect, useRef, useState } from "react"
import { ShadowDomPortalProvider } from "~/lib/shadcn-portal"
import { OrderSelectionProvider, useOrderSelection } from "~/lib/order-context"

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
  // Make sure our checkbox is visible and positioned correctly
  if (anchor.element.parentElement.querySelector(':scope > plasmo-csui')?.shadowRoot) {
    const shadowContainer = anchor.element.parentElement.querySelector(':scope > plasmo-csui').shadowRoot.querySelector('#plasmo-shadow-container');
    if (shadowContainer) {
      shadowContainer.style.zIndex = "1";
    }
  }
  
  hideOriginalCheckboxes()
  
  // Extract the order ID from the element text content
  const orderIdElement = anchor.element
  const orderId = orderIdElement.textContent.trim()
  
  return (
    <ShadowDomPortalProvider>
      <OrderSelectionProvider>
        <CheckboxWithContext orderId={orderId} />
      </OrderSelectionProvider>
    </ShadowDomPortalProvider>
  )
}

// Separate component to use context
const CheckboxWithContext = ({ orderId }) => {
  const { selectedOrders, toggleOrderSelection } = useOrderSelection()
  
  // Local state to track checkbox state
  const [isChecked, setIsChecked] = useState(false)
  
  // Sync with context on mount and when selectedOrders changes
  useEffect(() => {
    const isSelected = selectedOrders?.includes(orderId) || false
    setIsChecked(isSelected)
  }, [selectedOrders, orderId])
  
  // Handle checkbox changes
  const handleCheckedChange = (checked: boolean) => {
    setIsChecked(checked)
    toggleOrderSelection(orderId, checked)
  }

  return (
    <Checkbox 
      id={`checkbox-${orderId}`}
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
      className="cursor-pointer checkbox-unique"
    />
  )
}

export default AddCheckboxes