import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { EventForm } from '../components/EventForm'
import { PublicLandingPage } from '../components/PublicLandingPage'
import { eventOperations } from '../lib/supabase'
import type { EventData } from '../types'
import { ArrowLeft, Eye, Save } from 'lucide-react'

export function CreateEventPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(false)

  const editId = searchParams.get('edit')

  useEffect(() => {
    if (editId) {
      loadEventForEditing(editId)
    }
  }, [editId])

  const loadEventForEditing = async (id: string) => {
    setLoading(true)
    try {
      // In a real app, you'd have a getEventById function
      // For now, we'll simulate getting the event
      const { data: events } = await eventOperations.getUserEvents('')
      const event = events?.find(e => e.id === id)
      if (event) {
        setEditingEvent(event)
      }
    } catch (error) {
      console.error('Error loading event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEventSave = (data: EventData) => {
    setEventData(data)
    setStep(2)
  }

  const handlePublish = () => {
    setStep(3)
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
      {step === 1 && (
        <>
          <div className="bg-white border-b px-4 py-4">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
            </div>
          </div>
          <EventForm 
            initialData={editingEvent || undefined}
            onSave={handleEventSave} 
          />
        </>
      )}

      {step === 2 && eventData && (
        <div>
          <div className="bg-white border-b px-4 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Edit
                </button>
                <h2 className="text-lg font-semibold">Preview Your Event</h2>
              </div>
              <button
                onClick={handlePublish}
                className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                <Save className="h-4 w-4" />
                Publish Event
              </button>
            </div>
          </div>
          <PublicLandingPage event={eventData} />
        </div>
      )}

      {step === 3 && eventData && (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-lg shadow-sm border p-12">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Event {editingEvent ? 'Updated' : 'Published'}!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your event is now live and ready to share with the world.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-sm text-gray-600 mb-2">Public URL:</p>
              <div className="flex items-center gap-2 justify-center">
                <code className="text-lg bg-white px-4 py-2 rounded border">
                  {window.location.origin}/event/{eventData.slug}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/event/${eventData.slug}`)
                    alert('URL copied to clipboard!')
                  }}
                  className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`/event/${eventData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Eye className="h-5 w-5" />
                View Event Page
              </a>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}