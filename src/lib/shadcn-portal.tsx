import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"

/**
 * A custom portal component that works with Plasmo's shadow DOM.
 * This redirects portals to the shadow root instead of document.body.
 */
export const ShadowPortal = ({ 
  children, 
  container = document.body 
}: { 
  children: React.ReactNode
  container?: Element | DocumentFragment
}) => {
  const [portalContainer, setPortalContainer] = useState<Element | DocumentFragment | null>(null)
  
  useEffect(() => {
    // If the target is document.body, find the shadow root instead
    if (container === document.body) {
      const plasmoRoot = document.querySelector("plasmo-csui")
      if (plasmoRoot && plasmoRoot.shadowRoot) {
        setPortalContainer(plasmoRoot.shadowRoot)
        return
      }
    }
    
    // Otherwise use the provided container
    setPortalContainer(container)
  }, [container])
  
  // Only render the portal when we have a container
  if (!portalContainer) return null
  
  return createPortal(children, portalContainer)
}

/**
 * Context provider for shadow DOM portals
 */
const ShadowDomContext = React.createContext<boolean>(false)

/**
 * Component that provides shadow DOM context
 */
export function ShadowDomPortalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ShadowDomContext.Provider value={true}>
      {children}
    </ShadowDomContext.Provider>
  )
}

/**
 * Hook to use shadow DOM context
 */
export function useShadowDom() {
  return React.useContext(ShadowDomContext)
}