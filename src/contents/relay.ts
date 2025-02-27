import type { PlasmoCSConfig } from "plasmo"
import { Storage } from "@plasmohq/storage"
const storage = new Storage({area: "local"})


export const config: PlasmoCSConfig = {
    matches: ["https://relay.amazon.com/loadboard/*"],
  }
window.addEventListener('saveAllOrders', async (event: CustomEvent) => {
  console.log('saveAllOrders listener fired',  event.detail.orders)
    const orders = event.detail.orders
    await storage.set("orders", orders);
})

window.addEventListener('saveAllDrivers', async (event: CustomEvent) => {
  console.log('saveAllDrivers listener fired',  event.detail.drivers)
    const drivers = event.detail.drivers
    await storage.set("drivers", drivers);
})