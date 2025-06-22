import { createClient } from '@supabase/supabase-js'
import type { EventData } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export const eventOperations = {
  async createEvent(eventData: EventData) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
    return { data, error }
  },

  async getUserEvents(userId: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async getEventBySlug(slug: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    return { data, error }
  },

  async updateEvent(id: string, updates: Partial<EventData>) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  },

  async deleteEvent(id: string) {
    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    return { data, error }
  }
}