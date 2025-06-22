import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PublicLandingPage } from '../components/PublicLandingPage'
import { eventOperations } from '../lib/supabase'
import type { EventData } from '../types'
import { AlertCircle } from 'lucide-react'

export function PublicEventPage() {
  const { slug } = useParams<{ slug: string }>()
  const [event, setEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slug) {
      loadEvent(slug)
    }
  }, [slug])

  const loadEvent = async (slug: string) => {
    try {
      const { data, error } = await eventOperations.getEventBySlug(slug)
      if (error) throw error
      setEvent(data)
    } catch (err: any) {
      setError(err.message || 'Event not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center p-8">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-8">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return <PublicLandingPage event={event} />
}