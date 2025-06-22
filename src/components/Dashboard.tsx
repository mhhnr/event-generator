import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { eventOperations } from '../lib/supabase'
import type { EventData } from '../types'
import { Calendar, Plus, ExternalLink, Edit3, Trash2, LogOut, Eye } from 'lucide-react'

export function Dashboard() {
  const { user, signOut } = useAuth()
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadEvents()
    }
  }, [user])

  const loadEvents = async () => {
    if (!user) return
    
    try {
      const { data, error } = await eventOperations.getUserEvents(user.id)
      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, eventName: string) => {
    if (!confirm(`Are you sure you want to delete "${eventName}"? This action cannot be undone.`)) return
    
    try {
      await eventOperations.deleteEvent(id)
      setEvents(events.filter(event => event.id !== id))
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Calendar className="h-8 w-8 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
                <p className="text-gray-600">Welcome back, {user?.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href="/create"
                className="inline-flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Event
              </a>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No events yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first event to get started. It only takes a few minutes to build a professional landing page.
            </p>
            <a
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Your First Event
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {event.event_name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.is_published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {event.event_date} • {event.event_time}
                    </p>
                    <p className="line-clamp-1">{event.location}</p>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-6 line-clamp-3">
                    {event.event_brief}
                  </p>
                  
                  <div className="flex gap-2">
                    {event.is_published && (
                      <a
                        href={`/event/${event.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </a>
                    )}
                    <a
                      href={`/create?edit=${event.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </a>
                    <button
                      onClick={() => handleDelete(event.id!, event.event_name)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {event.is_published && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Public URL:</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-white px-2 py-1 rounded border flex-1 truncate">
                          {window.location.origin}/event/{event.slug}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/event/${event.slug}`)
                            alert('URL copied to clipboard!')
                          }}
                          className="text-gray-500 hover:text-gray-700"
                          title="Copy URL"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}