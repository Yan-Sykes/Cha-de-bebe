import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_purchased: boolean;
  purchased_by: string | null;
  purchased_at: string | null;
  created_at: string;
}

export interface RSVP {
  id: string;
  guest_name: string;
  email: string;
  phone: string | null;
  will_attend: boolean;
  number_of_guests: number;
  dietary_restrictions: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  guest_name: string;
  message: string;
  created_at: string;
  is_approved: boolean;
}
