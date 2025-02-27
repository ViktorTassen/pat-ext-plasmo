import React, { useState, useEffect, useRef } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import { sendToBackground } from "@plasmohq/messaging"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { DateTimePicker } from "~/components/ui/date-time-picker"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Trash2, Calendar, DollarSign, Truck, MapPin, Clock, Users, Copy } from "lucide-react"

// Type definitions
interface Order {
  id: string
  alias: string
  startTime: string
  endTime: string
  minDistance: {
    value: number
    unit: string
  }
  maxDistance: {
    value: number
    unit: string
  }
  totalCost: {
    value: number
    unit: string
  }
  costPerDistance: {
    value: number
    distanceUnit: string
    currencyUnit: string
  }
  maxNumberOfStops: number | null
  originCityRadius: {
    value: number
    unit: string
  }
  destinationCityRadius: {
    value: number
    unit: string
  }
  minPickUpBufferInMinutes: number
  // Add other fields as needed
}

interface OrderManagementProps {
  onClose?: () => void
  shadowRoot?: HTMLElement | null
}

const OrderManagement: React.FC<OrderManagementProps> = ({ onClose, shadowRoot }) => {
  // Create a ref for the portal container
  const portalContainerRef = useRef<HTMLDivElement | null>(null)
  
  // Get selected orders from storage
  const [selectedOrders, setSelectedOrders] = useStorage({
    key: "selectedOrders",
    instance: new Storage({ area: "local" }),
  })

  // Get all orders from storage
  const [allOrders, setAllOrders] = useStorage({
    key: "orders",
    instance: new Storage({ area: "local" }),
  })

  // State for filtered orders (orders that are selected)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])

  // State for bulk edit options
  const [activeTab, setActiveTab] = useState("timing")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [minPayout, setMinPayout] = useState<string>("")
  const [ppm, setPpm] = useState<string>("")
  const [minDistance, setMinDistance] = useState<string>("")
  const [maxDistance, setMaxDistance] = useState<string>("")
  const [maxStops, setMaxStops] = useState<string>("")
  const [stemTime, setStemTime] = useState<string>("")
  const [originRadius, setOriginRadius] = useState<string>("")
  const [destinationRadius, setDestinationRadius] = useState<string>("")
  const [drivers, setDrivers] = useState<string[]>([])
  const [selectedDriver, setSelectedDriver] = useState<string>("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [operationSummary, setOperationSummary] = useState<string>("")

  // Constants for dropdown options
  const stemTimeOptions = ["5", "15", "30", "45", "60", "90", "120", "150", "180", "210", "240", "480", "720", "1440"]
  const radiusOptions = ["5", "10", "15", "20", "25", "50", "75", "100"]

  // Effect to initialize the portal container ref
  useEffect(() => {
    // Set the portal container to the shadow root if available
    if (shadowRoot) {
      portalContainerRef.current = shadowRoot;
    }
  }, [shadowRoot]);

  // Filter orders when selectedOrders or allOrders change
  useEffect(() => {
    if (selectedOrders && allOrders) {
      const filtered = allOrders.filter((order: Order) => 
        selectedOrders.includes(order.alias || order.id)
      )
      setFilteredOrders(filtered)
    }
  }, [selectedOrders, allOrders])

  // Load drivers from storage
  useEffect(() => {
    const loadDrivers = async () => {
      const storage = new Storage({ area: "local" })
      const savedDrivers = await storage.get("drivers")
      if (savedDrivers) {
        setDrivers(savedDrivers)
      }
    }
    loadDrivers()
  }, [])

  // Function to handle saving changes
  const handleSaveChanges = () => {
    // Build operation summary
    let summary = "You are about to apply the following changes to " + 
                  filteredOrders.length + " selected orders:\n\n"
    
    if (startDate) summary += `• Change start time to: ${startDate.toLocaleString()}\n`
    if (endDate) summary += `• Change end time to: ${endDate.toLocaleString()}\n`
    if (minPayout) summary += `• Change minimum payout to: $${minPayout}\n`
    if (ppm) summary += `• Change price per mile to: $${ppm}\n`
    if (minDistance) summary += `• Change minimum distance to: ${minDistance} miles\n`
    if (maxDistance) summary += `• Change maximum distance to: ${maxDistance} miles\n`
    if (maxStops) summary += `• Change maximum stops to: ${maxStops}\n`
    if (stemTime) summary += `• Change stem time to: ${stemTime} minutes\n`
    if (originRadius) summary += `• Change origin radius to: ${originRadius} miles\n`
    if (destinationRadius) summary += `• Change destination radius to: ${destinationRadius} miles\n`
    if (selectedDriver) summary += `• Assign driver: ${selectedDriver}\n`
    
    setOperationSummary(summary)
    setShowConfirmDialog(true)
  }

  // Function to apply changes to orders
  const applyChanges = () => {
    // Clone the orders array to avoid direct mutation
    const updatedOrders = [...allOrders]
    
    // Find and update each selected order
    selectedOrders.forEach(selectedId => {
      const orderIndex = updatedOrders.findIndex(
        (order: Order) => order.id === selectedId || order.alias === selectedId
      )
      
      if (orderIndex !== -1) {
        const order = { ...updatedOrders[orderIndex] }
        
        // Apply changes based on what was set
        if (startDate) order.startTime = startDate.toISOString()
        if (endDate) order.endTime = endDate.toISOString()
        
        if (minPayout) order.totalCost.value = parseFloat(minPayout)
        
        if (ppm) order.costPerDistance.value = parseFloat(ppm)
        
        if (minDistance) order.minDistance.value = parseFloat(minDistance)
        if (maxDistance) order.maxDistance.value = parseFloat(maxDistance)
        
        if (maxStops) order.maxNumberOfStops = parseInt(maxStops, 10)
        
        if (stemTime) order.minPickUpBufferInMinutes = parseInt(stemTime, 10)
        
        if (originRadius) order.originCityRadius.value = parseInt(originRadius, 10)
        if (destinationRadius) order.destinationCityRadius.value = parseInt(destinationRadius, 10)
        
        // Update the order in the array
        updatedOrders[orderIndex] = order
      }
    })
    
    // Save updated orders to storage
    setAllOrders(updatedOrders)
    
    // Save to background
    sendToBackground({
      name: "saveAllOrders",
      body: {
        orders: updatedOrders
      }
    })
    
    // Close dialog
    setShowConfirmDialog(false)
    
    // Reset form
    resetForm()
  }

  // Function to delete selected orders
  const handleDeleteOrders = () => {
    const updatedOrders = allOrders.filter(
      (order: Order) => !selectedOrders.includes(order.id) && !selectedOrders.includes(order.alias)
    )
    
    setAllOrders(updatedOrders)
    setSelectedOrders([])
    
    // Save to background
    sendToBackground({
      name: "saveAllOrders",
      body: {
        orders: updatedOrders
      }
    })
  }

  // Function to clone orders
  const handleCloneOrders = () => {
    if (!startDate) {
      alert("Please select a start date for the cloned orders")
      return
    }
    
    // Clone the orders array
    const updatedOrders = [...allOrders]
    
    // Find each selected order and create a clone
    selectedOrders.forEach(selectedId => {
      const originalOrder = allOrders.find(
        (order: Order) => order.id === selectedId || order.alias === selectedId
      )
      
      if (originalOrder) {
        // Create a deep copy of the order
        const clonedOrder = JSON.parse(JSON.stringify(originalOrder))
        
        // Generate a new ID and alias
        clonedOrder.id = crypto.randomUUID()
        clonedOrder.alias = `CLONE-${originalOrder.alias || originalOrder.id}`
        
        // Set the new start time
        if (startDate) {
          clonedOrder.startTime = startDate.toISOString()
          
          // If end date is not specified, maintain the same duration
          if (!endDate) {
            const originalStart = new Date(originalOrder.startTime)
            const originalEnd = new Date(originalOrder.endTime)
            const durationMs = originalEnd.getTime() - originalStart.getTime()
            
            const newEndDate = new Date(startDate.getTime() + durationMs)
            clonedOrder.endTime = newEndDate.toISOString()
          } else {
            clonedOrder.endTime = endDate.toISOString()
          }
        }
        
        // Add the cloned order to the array
        updatedOrders.push(clonedOrder)
      }
    })
    
    // Save updated orders to storage
    setAllOrders(updatedOrders)
    
    // Save to background
    sendToBackground({
      name: "saveAllOrders",
      body: {
        orders: updatedOrders
      }
    })
    
    // Reset form
    resetForm()
  }

  // Function to reset the form
  const resetForm = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setMinPayout("")
    setPpm("")
    setMinDistance("")
    setMaxDistance("")
    setMaxStops("")
    setStemTime("")
    setOriginRadius("")
    setDestinationRadius("")
    setSelectedDriver("")
  }

  return (
    <div className="bg-background text-foreground p-4 rounded-lg shadow-lg max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Bulk Order Management</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {filteredOrders.length} orders selected
          </span>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No orders selected. Please select orders using the checkboxes.</p>
        </div>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="timing" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Timing</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>Pricing</span>
              </TabsTrigger>
              <TabsTrigger value="distance" className="flex items-center gap-1">
                <Truck className="h-4 w-4" />
                <span>Distance</span>
              </TabsTrigger>
              <TabsTrigger value="other" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Other</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <DateTimePicker 
                    date={startDate} 
                    setDate={setStartDate} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <DateTimePicker 
                    date={endDate} 
                    setDate={setEndDate} 
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Minimum Payout ($)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 2000"
                    value={minPayout}
                    onChange={(e) => setMinPayout(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price Per Mile ($)</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 2.2"
                    value={ppm}
                    onChange={(e) => setPpm(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="distance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Distance (miles)</label>
                  <Input
                    type="number"
                    placeholder="Minimum distance"
                    value={minDistance}
                    onChange={(e) => setMinDistance(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Distance (miles)</label>
                  <Input
                    type="number"
                    placeholder="Maximum distance"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Stops</label>
                  <Input
                    type="number"
                    placeholder="Maximum stops"
                    value={maxStops}
                    onChange={(e) => setMaxStops(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="other" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stem Time (minutes)</label>
                  <Select value={stemTime} onValueChange={setStemTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stem time" />
                    </SelectTrigger>
                    <SelectContent container={portalContainerRef.current}>
                      {stemTimeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option} minutes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Origin Radius (miles)</label>
                  <Select value={originRadius} onValueChange={setOriginRadius}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin radius" />
                    </SelectTrigger>
                    <SelectContent container={portalContainerRef.current}>
                      {radiusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option} miles
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Destination Radius (miles)</label>
                  <Select value={destinationRadius} onValueChange={setDestinationRadius}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination radius" />
                    </SelectTrigger>
                    <SelectContent container={portalContainerRef.current}>
                      {radiusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option} miles
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Assign Driver</label>
                  <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent container={portalContainerRef.current}>
                      {drivers.length > 0 ? (
                        drivers.map((driver) => (
                          <SelectItem key={driver} value={driver}>
                            {driver}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-drivers" disabled>
                          No drivers available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteOrders}
                className="flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloneOrders}
                className="flex items-center gap-1">
                <Copy className="h-4 w-4" />
                Clone
              </Button>
            </div>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>

          {/* Create a container for the portal */}
          <div ref={portalContainerRef} className="portal-container" />

          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent container={portalContainerRef.current}>
              <DialogHeader>
                <DialogTitle>Confirm Changes</DialogTitle>
                <DialogDescription className="whitespace-pre-line">
                  {operationSummary}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={applyChanges}>Apply Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

export default OrderManagement