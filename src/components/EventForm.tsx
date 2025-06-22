import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { eventOperations } from '../lib/supabase'
import { themes } from '../lib/themes'
import type { EventData, Speaker, WhyAttendItem } from '../types'
import { Plus, Minus, Save, Eye, Calendar } from 'lucide-react'

interface EventFormProps {
  initialData?: EventData
  onSave: (event: EventData) => void
}

export function EventForm({ initialData, onSave }: EventFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<EventData>({
    event_name: '',
    event_date: '',
    event_time: '',
    location: '',
    event_brief: '',
    agenda: [''],
    speakers: [{ name: '', title: '', bio: '' }],
    why_attend: [{ text: '' }],
    theme: 'light',
    registration_link: '',
    ...initialData
  })
  const [saving, setSaving] = useState(false)

  const updateField = (field: keyof EventData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateAgendaItem = (index: number, value: string) => {
    const newAgenda = [...formData.agenda]
    newAgenda[index] = value
    updateField('agenda', newAgenda)
  }

  const addAgendaItem = () => {
    updateField('agenda', [...formData.agenda, ''])
  }

  const removeAgendaItem = (index: number) => {
    updateField('agenda', formData.agenda.filter((_, i) => i !== index))
  }

  const updateSpeaker = (index: number, field: keyof Speaker, value: string | boolean) => {
    const newSpeakers = [...formData.speakers]
    newSpeakers[index] = { ...newSpeakers[index], [field]: value }
    updateField('speakers', newSpeakers)
  }

  const addSpeaker = () => {
    updateField('speakers', [...formData.speakers, { name: '', title: '', bio: '' }])
  }

  const removeSpeaker = (index: number) => {
    updateField('speakers', formData.speakers.filter((_, i) => i !== index))
  }

  const updateWhyAttend = (index: number, value: string) => {
    const newWhyAttend = [...formData.why_attend]
    newWhyAttend[index] = { ...newWhyAttend[index], text: value }
    updateField('why_attend', newWhyAttend)
  }

  const addWhyAttend = () => {
    updateField('why_attend', [...formData.why_attend, { text: '' }])
  }

  const removeWhyAttend = (index: number) => {
    updateField('why_attend', formData.why_attend.filter((_, i) => i !== index))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)

    try {
      const slug = initialData?.slug || generateSlug(formData.event_name)
      
      const eventData = {
        ...formData,
        user_id: user.id,
        slug,
        is_published: true,
        agenda: formData.agenda.filter(item => item.trim()),
        speakers: formData.speakers.filter(speaker => speaker.name.trim()),
        why_attend: formData.why_attend.filter(item => item.text.trim())
      }

      if (initialData?.id) {
        await eventOperations.updateEvent(initialData.id, eventData)
      } else {
        await eventOperations.createEvent(eventData)
      }

      onSave(eventData)
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Failed to save event. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {initialData ? 'Edit Event' : 'Create New Event'}
          </h1>
          <p className="text-gray-600">
            Fill in the details below to create your professional event landing page
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.event_name}
                  onChange={(e) => updateField('event_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your event name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => updateField('event_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => updateField('event_time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter event location"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Description *
                </label>
                <textarea
                  value={formData.event_brief}
                  onChange={(e) => updateField('event_brief', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 h-24 resize-none"
                  placeholder="Describe your event"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Link
                </label>
                <input
                  type="url"
                  value={formData.registration_link || ''}
                  onChange={(e) => updateField('registration_link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://your-registration-link.com"
                />
              </div>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">Theme</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(themes).map(([key, theme]) => (
                <label key={key} className="cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value={key}
                    checked={formData.theme === key}
                    onChange={(e) => updateField('theme', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    formData.theme === key 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: theme.colors.primary }}>
                      <div className="h-full rounded" style={{ 
                        background: `linear-gradient(to right, ${theme.colors.background}, ${theme.colors.accent})` 
                      }}></div>
                    </div>
                    <p className="text-sm font-medium text-center">{theme.name}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Agenda Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Agenda</h2>
              <button
                type="button"
                onClick={addAgendaItem}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.agenda.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateAgendaItem(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Agenda item"
                  />
                  {formData.agenda.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAgendaItem(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Speakers Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Speakers</h2>
              <button
                type="button"
                onClick={addSpeaker}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Speaker
              </button>
            </div>
            
            <div className="space-y-6">
              {formData.speakers.map((speaker, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Speaker {index + 1}</h3>
                    {formData.speakers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpeaker(index)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={speaker.name}
                        onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Speaker name"
                      />
                      
                      <input
                        type="text"
                        value={speaker.title}
                        onChange={(e) => updateSpeaker(index, 'title', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Title/Position"
                      />
                    </div>
                    
                    <textarea
                      value={speaker.bio}
                      onChange={(e) => updateSpeaker(index, 'bio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 h-20 resize-none"
                      placeholder="Speaker bio"
                    />
                    
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={speaker.isKeynote || false}
                        onChange={(e) => updateSpeaker(index, 'isKeynote', e.target.checked)}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      Keynote Speaker
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Attend Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Why Attend</h2>
              <button
                type="button"
                onClick={addWhyAttend}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Reason
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.why_attend.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateWhyAttend(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Reason to attend"
                  />
                  {formData.why_attend.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWhyAttend(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 font-semibold transition-colors"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Saving...' : (initialData ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}