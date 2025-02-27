"use client"

import * as React from "react"
import * as PortalPrimitive from "@radix-ui/react-portal"
import { ShadowPortal } from "~/lib/shadcn-portal"

const Portal = React.forwardRef<
  React.ElementRef<typeof PortalPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof PortalPrimitive.Root>
>(({ container = document.body, ...props }, ref) => {
  // Use our custom ShadowPortal instead of the default Radix Portal
  return <ShadowPortal container={container}>{props.children}</ShadowPortal>
})
Portal.displayName = PortalPrimitive.Root.displayName

export { Portal }