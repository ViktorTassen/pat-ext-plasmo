import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import { useEffect, useState } from "react"
import { cn } from "~lib/utils"
import { Checkbox } from "~/components/Checkbox"
import { ThemeProvider } from "@mui/material/styles"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { theme } from "~/theme/mui-theme"

export const config: PlasmoCSConfig = {
  matches: ["https://relay.amazon.com/loadboard/*"],
  all_frames: true
}

// Create a style element for MUI styles
const styleElement = document.createElement("style")

// Create a cache specifically for MUI in the content script
const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement
})

// Export the style element for Plasmo to use
export const getStyle = () => styleElement

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
  // More specific selector to target only the Amazon checkboxes
  const checkboxes = document.querySelectorAll('label[for^="checkbox-"]')
  checkboxes.forEach(label => {
    if (label.querySelector('[role="checkbox"]')) {
      label.style.display = 'none'; // Hide the label containing the checkbox
    }
  })
  
  // Also hide any standalone checkboxes that might be present
  document.querySelectorAll('[role="checkbox"]').forEach(checkbox => {
    const parent = checkbox.closest('label:not([id^="checkbox-"])')
    if (parent) {
      parent.style.display = 'none';
    }
  })
}

const AddCheckboxes = ({ anchor }) => {
  // Ensure our custom checkbox container has proper z-index
  if (anchor.element.parentElement.querySelector('plasmo-csui')?.shadowRoot) {
    const container = anchor.element.parentElement.querySelector('plasmo-csui').shadowRoot.querySelector('#plasmo-shadow-container')
    if (container) {
      container.style.zIndex = "20"
      container.style.position = "relative"
      container.style.display = "inline-block"
    }
  }
  
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    // Apply the hiding of original checkboxes when component mounts
    hideOriginalCheckboxes()
    
    // Set up a mutation observer to hide checkboxes that might be added dynamically
    const observer = new MutationObserver((mutations) => {
      hideOriginalCheckboxes()
    })
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    })
    
    setMounted(true)
    
    // Clean up observer on component unmount
    return () => {
      observer.disconnect()
    }
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
  
  // Handle checkbox changes
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
    <CacheProvider value={styleCache}>
      <ThemeProvider theme={theme}>
        <span 
          className={cn(
            "inline-flex items-center -ml-4",
            "relative z-10" // Ensure our checkbox is above other elements
          )}
          onClick={(e) => {
            e.stopPropagation() // Prevent click from propagating
            e.preventDefault() // Prevent default behavior
          }}
        >
          <Checkbox 
            id={`checkbox-${orderId}`}
            checked={isChecked}
            onCheckedChange={handleCheckedChange}
            className="cursor-pointer"
          />
        </span>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default AddCheckboxes