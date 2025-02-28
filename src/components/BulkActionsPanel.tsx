import React, { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import { cn } from "~/lib/utils"
import { useOrderSelection } from "~/lib/order-context"
import { TimePickerInput } from "~/components/ui/time-picker-input"
import { Button } from "~/components/ui/button"
import { format } from "date-fns"

// Define option types
type RadiusOption = 5 | 10 | 15 | 25 | 50 | 75 | 100
type StemTimeOption = 5 | 10 | 15 | 30 | 45 | 60 | 90 | 120 | 180 | 240 | 360 | 480 | 720 | 1440
type PanelMode = "none" | "edit" | "clone" | "delete" | "deleteAll"

interface BulkActionsPanelProps {
  initialMode?: PanelMode
  onClose: () => void
}

export const BulkActionsPanel: React.FC<BulkActionsPanelProps> = ({ 
  initialMode = "none", 
  onClose 
}) => {
  // States for the panel
  const [mode, setMode] = useState<PanelMode>(initialMode)
  const [activeTab, setActiveTab] = useState("dates")
  
  // Update mode when initialMode changes
  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])
  
  // Form states
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  
  const [minDistance, setMinDistance] = useState(0)
  const [maxDistance, setMaxDistance] = useState(0)
  const [minPayout, setMinPayout] = useState(0)
  const [minPricePerMile, setMinPricePerMile] = useState(0)
  
  const [maxStops, setMaxStops] = useState(0)
  const [stemTime, setStemTime] = useState<StemTimeOption>(60)
  const [originRadius, setOriginRadius] = useState<RadiusOption>(25)
  const [destinationRadius, setDestinationRadius] = useState<RadiusOption>(25)
  
  // Get selected orders from context
  const { selectedOrders, clearSelectedOrders } = useOrderSelection()
  
  // Get all orders from storage
  const [allOrders, setAllOrders] = useStorage({
    key: "orders",
    instance: new Storage({ area: "local" })
  })
  
  // Handle confirm delete
  const confirmDelete = () => {
    if (mode === "delete") {
      // Logic to delete selected orders
      alert(`Deleted ${selectedOrders?.length} selected orders`)
      clearSelectedOrders()
    } else if (mode === "deleteAll") {
      // Logic to delete all orders
      alert("Deleted all orders")
      setAllOrders([])
      clearSelectedOrders()
    }
    onClose()
  }
  
  // Handle save changes
  const saveChanges = () => {
    if (mode === "edit") {
      // Logic to save edits
      alert(`Edited ${selectedOrders?.length} orders`)
    } else if (mode === "clone") {
      // Logic to clone orders
      alert(`Cloned ${selectedOrders?.length} orders`)
    }
    onClose()
  }
  
  // Render the delete confirmation
  const renderDeleteConfirmation = () => (
    <div className="bg-background p-6 rounded-md shadow-md border border-input">
      <h3 className="text-lg font-bold text-amazon-red mb-4">
        {mode === "delete" 
          ? `Delete ${selectedOrders?.length} Selected Orders?` 
          : "Delete All Orders?"}
      </h3>
      <p className="mb-4 text-muted-foreground">
        {mode === "delete"
          ? "Are you sure you want to delete the selected orders? This action cannot be undone."
          : "Are you sure you want to delete ALL orders? This action cannot be undone."}
      </p>
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-amazon-gray hover:bg-amazon-gray-light text-foreground">
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={confirmDelete}
          className="bg-amazon-red hover:bg-amazon-red-dark text-white">
          Confirm Delete
        </Button>
      </div>
    </div>
  )
  
  // Render the edit/clone form
  const renderEditForm = () => (
    <div className="bg-background p-6 rounded-md shadow-md border border-input">
      <h3 className="text-lg font-bold text-amazon-blue mb-4">
        {mode === "edit" 
          ? `Edit ${selectedOrders?.length} Selected Orders` 
          : `Clone ${selectedOrders?.length} Selected Orders`}
      </h3>

      <Button 
          variant="ghost"
          onClick={onClose}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-full hover:bg-amazon-gray-light">
          ✕
        </Button>
      
      <Tabs defaultValue="dates" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 bg-amazon-gray-light rounded-sm mb-4">
          <TabsTrigger 
            value="dates" 
            className="data-[state=active]:bg-white data-[state=active]:text-amazon-blue data-[state=active]:shadow-sm rounded-sm">
            Dates
          </TabsTrigger>
          <TabsTrigger 
            value="distance" 
            className="data-[state=active]:bg-white data-[state=active]:text-amazon-blue data-[state=active]:shadow-sm rounded-sm">
            Distance & Payout
          </TabsTrigger>
          <TabsTrigger 
            value="stops" 
            className="data-[state=active]:bg-white data-[state=active]:text-amazon-blue data-[state=active]:shadow-sm rounded-sm">
            Stops & Radius
          </TabsTrigger>
        </TabsList>
        
        {/* Dates Tab */}
        <TabsContent value="dates" className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Move Start Date</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <TimePickerInput
                value={startTime}
                onTimeChange={setStartTime}
                className="rounded-md border-input"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Move End Date</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <TimePickerInput
                value={endTime}
                onTimeChange={setEndTime}
                className="rounded-md border-input"
              />
            </div>
          </div>
        </TabsContent>
        
        {/* Distance & Payout Tab */}
        <TabsContent value="distance" className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Distance (miles)</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-muted-foreground">Minimum</label>
                <input
                  type="number"
                  value={minDistance}
                  onChange={(e) => setMinDistance(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground">Maximum</label>
                <input
                  type="number"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Payout</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-muted-foreground">Minimum Payout ($)</label>
                <input
                  type="number"
                  value={minPayout}
                  onChange={(e) => setMinPayout(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground">Min Price/Mile ($)</label>
                <input
                  type="number"
                  value={minPricePerMile}
                  onChange={(e) => setMinPricePerMile(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Stops & Radius Tab */}
        <TabsContent value="stops" className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Maximum Stops</label>
            <input
              type="number"
              value={maxStops}
              onChange={(e) => setMaxStops(Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Stem Time (minutes)</label>
            <select
              value={stemTime}
              onChange={(e) => setStemTime(Number(e.target.value) as StemTimeOption)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {[5, 10, 15, 30, 45, 60, 90, 120, 180, 240, 360, 480, 720, 1440].map((time) => (
                <option key={time} value={time}>
                  {time} {time === 1440 ? "(24 hours)" : ""}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Origin Radius (miles)</label>
              <select
                value={originRadius}
                onChange={(e) => setOriginRadius(Number(e.target.value) as RadiusOption)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {[5, 10, 15, 25, 50, 75, 100].map((radius) => (
                  <option key={radius} value={radius}>{radius}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Destination Radius (miles)</label>
              <select
                value={destinationRadius}
                onChange={(e) => setDestinationRadius(Number(e.target.value) as RadiusOption)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {[5, 10, 15, 25, 50, 75, 100].map((radius) => (
                  <option key={radius} value={radius}>{radius}</option>
                ))}
              </select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-amazon-gray hover:bg-amazon-gray-light text-foreground">
          Cancel
        </Button>
        <Button
          variant="default"
          onClick={saveChanges}
          className="bg-amazon-blue hover:bg-amazon-blue-dark text-white">
          {mode === "edit" ? "Save Changes" : "Create Clones"}
        </Button>
      </div>
    </div>
  )
  
  // Determine which content to render based on mode
  const renderContent = () => {
    if (mode === "delete" || mode === "deleteAll") {
      return renderDeleteConfirmation()
    } else if (mode === "edit" || mode === "clone") {
      return renderEditForm()
    }
    return null
  }
  
  return (
      renderContent()
  )
}