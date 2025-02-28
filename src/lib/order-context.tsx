import React, { createContext, useContext, useState, useEffect } from "react"
import { Storage } from "@plasmohq/storage"

// Define the context type
interface OrderSelectionContextType {
  selectedOrders: string[]
  toggleOrderSelection: (orderId: string, isSelected: boolean) => void
  clearSelectedOrders: () => void
}

// Create the context with default values
const OrderSelectionContext = createContext<OrderSelectionContextType>({
  selectedOrders: [],
  toggleOrderSelection: () => {},
  clearSelectedOrders: () => {}
})

// Create a provider component
export const OrderSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const storage = new Storage({ area: "local" })
  
  // Load initial state from storage
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const storedOrders = await storage.get("selectedOrders")
        if (storedOrders && Array.isArray(storedOrders)) {
          setSelectedOrders(storedOrders)
        }
      } catch (error) {
        console.error("Error loading selected orders:", error)
      }
    }
    
    loadInitialState()
  }, [])
  
  // Toggle order selection
  const toggleOrderSelection = (orderId: string, isSelected: boolean) => {
    setSelectedOrders(prev => {
      let newSelectedOrders: string[]
      
      if (isSelected) {
        // Add order ID if not already present
        newSelectedOrders = prev.includes(orderId) ? prev : [...prev, orderId]
      } else {
        // Remove order ID
        newSelectedOrders = prev.filter(id => id !== orderId)
      }
      
      // Update storage
      storage.set("selectedOrders", newSelectedOrders).catch(error => {
        console.error("Error saving selected orders:", error)
      })
      
      return newSelectedOrders
    })
  }
  
  // Clear all selected orders
  const clearSelectedOrders = () => {
    setSelectedOrders([])
    storage.set("selectedOrders", []).catch(error => {
      console.error("Error clearing selected orders:", error)
    })
  }
  
  return (
    <OrderSelectionContext.Provider value={{ 
      selectedOrders, 
      toggleOrderSelection,
      clearSelectedOrders
    }}>
      {children}
    </OrderSelectionContext.Provider>
  )
}

// Create a hook to use the context
export const useOrderSelection = () => useContext(OrderSelectionContext)