import React from 'react'
import { getTheme } from '../lib/themes'
import type { EventData } from '../types'
import { Calendar, MapPin, Clock, ExternalLink, Star } from 'lucide-react'

interface PublicLandingPageProps {
  event: EventData
}

export function PublicLandingPage({ event }: PublicLandingPageProps) {
  const theme = getTheme(event.theme)

  const themeVars = {
    '--primary-color': theme.colors.primary,
    '--bg-color': theme.colors.background,
    '--text-color': theme.colors.text,
    '--accent-color': theme.colors.accent
  } as React.CSSProperties

  return (
    <div 
      className={`min-h-screen ${theme.className}`} 
      style={themeVars}
    >
      {/* Hero Section */}
      <div 
        className="relative py-20 lg:py-32 px-4 text-white"
        style={{ backgroundColor: 'var(--primary-color)' }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {event.event_name}
          </h1>
          
          <div className="flex flex-wrap justify-center gap-6 text-lg md:text-xl mb-8 opacity-90">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {event.event_date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {event.event_time}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {event.location}
            </div>
          </div>
          
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-8 opacity-90 leading-relaxed">
            {event.event_brief}
          </p>
          
          {event.registration_link && (
            <a
              href={event.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Register Now
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Agenda Section */}
          {event.agenda.length > 0 && event.agenda[0] && (
            <div className="space-y-6">
              <h2 
                className="text-3xl font-bold"
                style={{ color: 'var(--text-color)' }}
              >
                Agenda
              </h2>
              <div className="space-y-4">
                {event.agenda.map((item, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-lg border-l-4 hover:shadow-md transition-shadow"
                    style={{ 
                      backgroundColor: 'var(--accent-color)',
                      borderLeftColor: 'var(--primary-color)'
                    }}
                  >
                    <p 
                      className="font-medium"
                      style={{ color: 'var(--text-color)' }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speakers Section */}
          {event.speakers.length > 0 && event.speakers[0].name && (
            <div className="space-y-6">
              <h2 
                className="text-3xl font-bold"
                style={{ color: 'var(--text-color)' }}
              >
                Speakers
              </h2>
              <div className="space-y-6">
                {event.speakers.map((speaker, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-lg hover:shadow-md transition-shadow"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                  >
                    <div className="flex items-start gap-4">
                      {speaker.image ? (
                        <img 
                          src={speaker.image} 
                          alt={speaker.name}
                          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                          style={{ backgroundColor: 'var(--primary-color)' }}
                        >
                          {speaker.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 
                            className="text-xl font-semibold"
                            style={{ color: 'var(--text-color)' }}
                          >
                            {speaker.name}
                          </h3>
                          {speaker.isKeynote && (
                            <span 
                              className="px-2 py-1 text-xs font-medium rounded-full text-white"
                              style={{ backgroundColor: 'var(--primary-color)' }}
                            >
                              <Star className="h-3 w-3 inline mr-1" />
                              Keynote
                            </span>
                          )}
                        </div>
                        <p 
                          className="text-sm font-medium mb-2 opacity-75"
                          style={{ color: 'var(--text-color)' }}
                        >
                          {speaker.title}
                        </p>
                        <p 
                          className="text-sm leading-relaxed"
                          style={{ color: 'var(--text-color)' }}
                        >
                          {speaker.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why Attend Section */}
          {event.why_attend.length > 0 && event.why_attend[0].text && (
            <div className="space-y-6">
              <h2 
                className="text-3xl font-bold"
                style={{ color: 'var(--text-color)' }}
              >
                Why Attend
              </h2>
              <div className="space-y-4">
                {event.why_attend.map((item, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-lg hover:shadow-md transition-shadow"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                  >
                    <p 
                      className="font-medium leading-relaxed"
                      style={{ color: 'var(--text-color)' }}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Call to Action */}
      {event.registration_link && (
        <div 
          className="py-16 px-4"
          style={{ backgroundColor: 'var(--accent-color)' }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ color: 'var(--text-color)' }}
            >
              Ready to Join Us?
            </h2>
            <p 
              className="text-lg mb-8 opacity-75"
              style={{ color: 'var(--text-color)' }}
            >
              Don't miss out on this incredible event. Reserve your spot today!
            </p>
            <a
              href={event.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg text-white hover:opacity-90 transition-opacity shadow-lg"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              Register for This Event
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}