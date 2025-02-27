import { Checkbox as MuiCheckbox } from "@mui/material"
import { styled } from "@mui/material/styles"

// Styled MUI Checkbox with custom colors
const StyledCheckbox = styled(MuiCheckbox)(({ theme }) => ({
  color: "#9ca3af", // Gray color for unchecked
  "&.Mui-checked": {
    color: "#3b82f6", // Blue color when checked
  },
  padding: "4px",
  "&:hover": {
    backgroundColor: "rgba(59, 130, 246, 0.04)",
  }
}))

interface CheckboxProps {
  id?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export const Checkbox = ({
  id,
  checked = false,
  onCheckedChange,
  className = ""
}: CheckboxProps) => {
  return (
    <StyledCheckbox
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={className}
      size="small"
      disableRipple
    />
  )
}

export default Checkbox