/*
  # Baby Shower Website Database Schema

  1. New Tables
    - `gifts`
      - `id` (uuid, primary key)
      - `name` (text) - Gift name
      - `description` (text) - Gift description
      - `price` (numeric) - Fixed price in BRL
      - `image_url` (text) - Gift image URL
      - `is_purchased` (boolean) - Whether gift has been purchased
      - `purchased_by` (text, nullable) - Name of person who purchased
      - `purchased_at` (timestamptz, nullable) - When it was purchased
      - `created_at` (timestamptz) - Record creation time
    
    - `rsvps`
      - `id` (uuid, primary key)
      - `guest_name` (text) - Guest's full name
      - `email` (text) - Guest's email
      - `phone` (text, nullable) - Guest's phone number
      - `will_attend` (boolean) - Attendance confirmation
      - `number_of_guests` (integer) - Number of people attending
      - `dietary_restrictions` (text, nullable) - Any dietary needs
      - `created_at` (timestamptz) - Record creation time
    
    - `messages`
      - `id` (uuid, primary key)
      - `guest_name` (text) - Name of message author
      - `message` (text) - The kind note/message
      - `created_at` (timestamptz) - When message was posted
      - `is_approved` (boolean) - Moderation flag
  
  2. Security
    - Enable RLS on all tables
    - Allow public read access to gifts and approved messages
    - Allow public insert for RSVPs and messages
    - Restrict gift purchases to prevent race conditions
*/

-- Create gifts table
CREATE TABLE IF NOT EXISTS gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price > 0),
  image_url text NOT NULL,
  is_purchased boolean DEFAULT false,
  purchased_by text,
  purchased_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  email text NOT NULL,
  phone text,
  will_attend boolean NOT NULL,
  number_of_guests integer DEFAULT 1 CHECK (number_of_guests > 0),
  dietary_restrictions text,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_approved boolean DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gifts table
CREATE POLICY "Anyone can view gifts"
  ON gifts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can mark gift as purchased"
  ON gifts FOR UPDATE
  USING (NOT is_purchased)
  WITH CHECK (is_purchased = true AND purchased_by IS NOT NULL);

-- RLS Policies for rsvps table
CREATE POLICY "Anyone can submit RSVP"
  ON rsvps FOR INSERT
  WITH CHECK (true);

-- RLS Policies for messages table
CREATE POLICY "Anyone can view approved messages"
  ON messages FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Anyone can post messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gifts_is_purchased ON gifts(is_purchased);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_approved ON messages(is_approved);
