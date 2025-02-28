import React, { createContext, useContext, useState, useEffect } from "react"

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

// Create a global state to share between context instances
let globalSelectedOrders: string[] = [];
const listeners: Set<(orders: string[]) => void> = new Set();

// Function to update global state and notify all listeners
const updateGlobalOrders = (orders: string[]) => {
  globalSelectedOrders = [...orders];
  listeners.forEach(listener => listener(globalSelectedOrders));
};

// Create a provider component
export const OrderSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>(globalSelectedOrders);
  
  // Register this component as a listener for global state changes
  useEffect(() => {
    const listener = (orders: string[]) => {
      setSelectedOrders(orders);
    };
    
    listeners.add(listener);
    
    return () => {
      listeners.delete(listener);
    };
  }, []);
  
  // Toggle order selection
  const toggleOrderSelection = (orderId: string, isSelected: boolean) => {
    const newSelectedOrders = isSelected
      ? [...globalSelectedOrders, orderId]
      : globalSelectedOrders.filter(id => id !== orderId);
    
    updateGlobalOrders(newSelectedOrders);
  };
  
  // Clear all selected orders
  const clearSelectedOrders = () => {
    updateGlobalOrders([]);
  };
  
  // Listen for URL changes to clear selection when user changes tabs
  useEffect(() => {
    const clearSelectionOnNavigation = () => {
      updateGlobalOrders([]);
    };
    
    // Use the popstate event to detect navigation
    window.addEventListener('popstate', clearSelectionOnNavigation);
    
    return () => {
      window.removeEventListener('popstate', clearSelectionOnNavigation);
    };
  }, []);
  
  return (
    <OrderSelectionContext.Provider value={{ 
      selectedOrders, 
      toggleOrderSelection,
      clearSelectedOrders
    }}>
      {children}
    </OrderSelectionContext.Provider>
  );
};

// Create a hook to use the context
export const useOrderSelection = () => useContext(OrderSelectionContext);