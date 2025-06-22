export interface EventData {
  id?: string
  user_id?: string
  slug?: string
  event_name: string
  event_date: string
  event_time: string
  location: string
  event_brief: string
  agenda: string[]
  speakers: Speaker[]
  why_attend: WhyAttendItem[]
  banner_image?: string
  logo?: string
  registration_link?: string
  theme: "light" | "dark" | "minimal" | "corporate"
  is_published?: boolean
  created_at?: string
  updated_at?: string
}

export interface Speaker {
  name: string
  title: string
  bio: string
  image?: string
  isKeynote?: boolean
}

export interface WhyAttendItem {
  text: string
  image?: string
}

export interface Theme {
  name: string
  colors: {
    primary: string
    background: string
    text: string
    accent: string
  }
  className: string
}