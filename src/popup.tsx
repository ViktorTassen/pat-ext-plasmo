import { ShadowDomPortalProvider } from "~/lib/shadcn-portal"

import "~style.css"

function IndexPopup() {
  return (
    <ShadowDomPortalProvider>
      <div className="w-96 p-4">
        <h1 className="text-xl font-bold mb-4">Time Picker Components</h1>
      </div>
    </ShadowDomPortalProvider>
  )
}

export default IndexPopup