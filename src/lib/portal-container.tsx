import React, { useEffect, useState } from "react"

// This component creates a portal container within the Plasmo shadow DOM
export function createPortalContainer(id: string = "plasmo-portal-container") {
  // Check if we're in a content script context
  if (typeof document === "undefined") return null

  // Find the Plasmo shadow root
  const plasmoRoot = document.querySelector("plasmo-csui")?.shadowRoot
  
  if (!plasmoRoot) {
    console.warn("Plasmo shadow root not found")
    return null
  }
  
  // Check if container already exists
  let container = plasmoRoot.getElementById(id)
  
  // Create container if it doesn't exist
  if (!container) {
    container = document.createElement("div")
    container.id = id
    container.style.position = "relative"
    container.style.zIndex = "9999"
    plasmoRoot.appendChild(container)
  }
  
  return container
}

// Hook to get the portal container
export function usePortalContainer(id: string = "plasmo-portal-container") {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  
  useEffect(() => {
    const portalContainer = createPortalContainer(id)
    setContainer(portalContainer)
    
    return () => {
      // Cleanup if needed
    }
  }, [id])
  
  return container
}