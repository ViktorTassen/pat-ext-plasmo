import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import { useRef, useEffect, useState } from "react"
import { ShadowDomPortalProvider } from "~/lib/shadcn-portal"
import { BulkActionsPanel } from "~/components/BulkActionsPanel"
import { OrderSelectionProvider, useOrderSelection } from "~/lib/order-context"
import { Button } from "~/components/ui/button"
import { Calendar } from "~components/ui/calendar"
import { DatePicker } from "~components/DatePicker"

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

const OrderManagementButtonsInner = () => {
  const [activePanel, setActivePanel] = useState<"none" | "edit" | "clone" | "delete" | "deleteAll">("none")
  const { selectedOrders, clearSelectedOrders } = useOrderSelection()
  const [date, setDate] = useState<Date | undefined>(new Date())

  const [allOrders, setAllOrders] = useStorage({
    key: "orders",
    instance: new Storage({ area: "local" })
  })
  
  // Listen for URL changes to reset panel state
  useEffect(() => {
    const resetPanelOnNavigation = () => {
      setActivePanel("none")
    }
    
    window.addEventListener('popstate', resetPanelOnNavigation)
    
    return () => {
      window.removeEventListener('popstate', resetPanelOnNavigation)
    }
  }, [])
  
  // Handle edit button click
  const handleEdit = () => {
    if (!selectedOrders || selectedOrders.length === 0) {
      alert("No orders selected for editing")
      return
    }
    setActivePanel("edit")
  }
  
  // Handle clone button click
  const handleClone = () => {
    if (!selectedOrders || selectedOrders.length === 0) {
      alert("No orders selected for cloning")
      return
    }
    setActivePanel("clone")
  }
  
  // Handle delete selected button click
  const handleDeleteSelected = () => {
    if (!selectedOrders || selectedOrders.length === 0) {
      alert("No orders selected for deletion")
      return
    }
    setActivePanel("delete")
  }
  
  // Handle delete all button click
  const handleDeleteAll = () => {
    if (!allOrders || allOrders.length === 0) {
      alert("No orders to delete")
      return
    }
    setActivePanel("deleteAll")
  }
  
  return (
    <div className="p-2 relative font-ember">
      <div className="flex flex-row space-x-2">
        <DatePicker />
        <Button 
          onClick={handleEdit}>
          Edit Selected {selectedOrders?.length ? `(${selectedOrders.length})` : ""}
        </Button>
        
        <Button 
          onClick={handleClone}>
          Clone Selected {selectedOrders?.length ? `(${selectedOrders.length})` : ""}
        </Button>
        
        <Button 
          onClick={handleDeleteSelected}
          variant="destructive">
          Delete Selected {selectedOrders?.length ? `(${selectedOrders.length})` : ""}
        </Button>
        
        <Button 
          onClick={handleDeleteAll}
          variant="destructive">
          Delete All
        </Button>
      </div>
      
      {activePanel !== "none" && (
        <div className="absolute left-0 mt-2 z-50 ">
          <BulkActionsPanel 
            initialMode={activePanel} 
            onClose={() => setActivePanel("none")} 
          />
        </div>
      )}
    </div>
  )
}

const OrderManagementButtons = () => {
  return (
    <ShadowDomPortalProvider>
      <OrderSelectionProvider>
        <OrderManagementButtonsInner />
      </OrderSelectionProvider>
    </ShadowDomPortalProvider>
  )
}

export default OrderManagementButtons