import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import NorthEastIcon from '@mui/icons-material/NorthEast'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

const icons = {
  'arrow-back': ArrowBackIcon,
  'arrow-downward': ArrowDownwardIcon,
  'arrow-forward': ArrowForwardIcon,
  close: CloseIcon,
  'dark-mode': DarkModeIcon,
  'light-mode': LightModeIcon,
  'north-east': NorthEastIcon,
  pause: PauseIcon,
  'play-arrow': PlayArrowIcon,
}

export type IconName = keyof typeof icons

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Component = icons[name]

  return (
    <span className={className} aria-hidden='true'>
      <Component fontSize='inherit' />
    </span>
  )
}
