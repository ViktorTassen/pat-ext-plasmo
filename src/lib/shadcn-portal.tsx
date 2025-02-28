import React, { useEffect, useState, useRef } from "react"
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
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)
  
  useEffect(() => {
    // Find the Plasmo shadow root
    const findShadowRoot = () => {
      const plasmoRoot = document.querySelector("plasmo-csui")
      if (plasmoRoot && plasmoRoot.shadowRoot) {
        setShadowRoot(plasmoRoot.shadowRoot)
        return plasmoRoot.shadowRoot
      }
      return null
    }
    
    // If the target is document.body, find the shadow root instead
    if (container === document.body) {
      const root = findShadowRoot()
      if (root) {
        setPortalContainer(root)
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
const ShadowDomContext = React.createContext<ShadowRoot | null>(null)

/**
 * Component that provides shadow DOM context
 */
export function ShadowDomPortalProvider({ children }: { children: React.ReactNode }) {
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)
  
  useEffect(() => {
    // Find the Plasmo shadow root
    const plasmoRoot = document.querySelector("plasmo-csui")
    if (plasmoRoot && plasmoRoot.shadowRoot) {
      setShadowRoot(plasmoRoot.shadowRoot)
    }
  }, [])
  
  return (
    <ShadowDomContext.Provider value={shadowRoot}>
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