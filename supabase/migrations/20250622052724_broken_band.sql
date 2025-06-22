/*
  # Create events table

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `slug` (text, unique)
      - `event_name` (text)
      - `event_date` (text)
      - `event_time` (text)
      - `location` (text)
      - `event_brief` (text)
      - `agenda` (jsonb array)
      - `speakers` (jsonb array)
      - `why_attend` (jsonb array)
      - `banner_image` (text, optional)
      - `logo` (text, optional)
      - `registration_link` (text, optional)
      - `theme` (text, default 'light')
      - `is_published` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `events` table
    - Add policy for users to manage their own events
    - Add policy for public read access to published events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug text UNIQUE NOT NULL,
  event_name text NOT NULL,
  event_date text NOT NULL,
  event_time text NOT NULL,
  location text NOT NULL,
  event_brief text NOT NULL,
  agenda jsonb DEFAULT '[]'::jsonb,
  speakers jsonb DEFAULT '[]'::jsonb,
  why_attend jsonb DEFAULT '[]'::jsonb,
  banner_image text,
  logo text,
  registration_link text,
  theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'minimal', 'corporate')),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own events"
  ON events
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view published events"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(is_published);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON events 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();