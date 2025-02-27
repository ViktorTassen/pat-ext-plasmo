import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground, sendToBackgroundViaRelay } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["https://relay.amazon.com/loadboard/*"],
  all_frames: true,
  world: "MAIN",
  run_at: "document_start"
}





const Fetch = () => {
  // Intercept fetch requests
  const originalFetch = window.fetch
  window.fetch = async function (input: RequestInfo, init?: RequestInit) {
    const response = await originalFetch(input, init)

    // Check if the URL matches our pattern
    const url = typeof input === "string" ? input : input.url
    if (url.includes("api/drivers")) {
      try {
        // Clone and parse JSON directly
        const json = await response.clone().json()
        console.log("PAT3 Response data drivers:", json.data)
      } catch (error) {
        console.error("PAT3 Error processing fetch response:", error)
      }
    }

    if (url.includes("/api/loadboard/orders/get")) {
      try {
        // Clone and parse JSON directly
        const json = await response.clone().json()
        console.log("PAT3 Intercepted fetch response from:", url)
        console.log("PAT3 Response data orders:", json.truckCapacityOrders)

        // Use Plasmo messaging to send orders data to background
        try {
          window.dispatchEvent(new CustomEvent('saveAllOrders', {
            detail: { 
              orders: json.truckCapacityOrders
            }
          }))
          console.log("PAT3 Orders saved")
        } catch (error) {
          console.error("PAT3 Error saving orders:", error)
        }
      } catch (error) {
        console.error("PAT3 Error processing fetch response:", error)
      }
    }

    return response
  }
}
export default Fetch