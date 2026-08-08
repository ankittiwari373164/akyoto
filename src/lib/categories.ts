import {
  Bell, Wind, AlertCircle, Flame, Layers, Volume2, Smartphone, DoorClosed, Cpu, LucideIcon,
} from 'lucide-react'

export interface SiteCategory {
  name: string
  slug: string
  description: string
  icon: LucideIcon
}

export const categories: SiteCategory[] = [
  { name: 'Security Alarm System', slug: 'security-alarm-system', description: 'Intrusion & burglar alarm systems, panels and sensors.', icon: Bell },
  { name: 'Gas Alarm', slug: 'gas-alarm', description: 'Gas leakage detection and alarm devices.', icon: Wind },
  { name: 'Carbon Monoxide Alarm', slug: 'carbon-monoxide-alarm', description: 'Carbon monoxide detection and alarm devices.', icon: AlertCircle },
  { name: 'Smoke Alarm', slug: 'smoke-alarm', description: 'Smoke detectors and fire alarm panels.', icon: Flame },
  { name: 'Composite Alarm', slug: 'composite-alarm', description: 'Multi-sensor composite alarm devices.', icon: Layers },
  { name: 'Audible and Visual Alarm', slug: 'audible-and-visual-alarm', description: 'Sirens, sounders and flashers.', icon: Volume2 },
  { name: 'Wireless Intelligent Doorbell', slug: 'wireless-intelligent-doorbell', description: 'App-connected wireless video and audio doorbells.', icon: Smartphone },
  { name: 'Door Magnet Sensor', slug: 'door-magnet-sensor', description: 'Wired & wireless magnetic door/window contact sensors.', icon: DoorClosed },
  { name: 'Intelligent Single Product', slug: 'intelligent-single-product', description: 'Access control, networking, cameras and other smart devices.', icon: Cpu },
]