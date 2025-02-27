import { CountButton } from "~features/count-button"
import { ShadowDomPortalProvider } from "~/lib/shadcn-portal"

import "~style.css"

function IndexPopup() {
  return (
    <ShadowDomPortalProvider>
      <div className="flex items-center justify-center h-16 w-40">
        <CountButton />
      </div>
    </ShadowDomPortalProvider>
  )
}

export default IndexPopup