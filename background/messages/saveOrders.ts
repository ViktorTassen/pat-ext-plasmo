import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

// Initialize storage
const storage = new Storage({area: "local"})

// Handler for the saveOrders message
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { orders } = req.body
  
  try {
    // Save orders to storage
    await storage.set("orders", orders)
    console.log("PAT3 Orders saved to storage using Plasmo messaging")
    
    // Send success response
    res.send({
      success: true,
      message: "Orders saved successfully"
    })
  } catch (error) {
    console.error("PAT3 Error saving orders:", error)
    
    // Send error response
    res.send({
      success: false,
      error: String(error)
    })
  }
}

export default handler