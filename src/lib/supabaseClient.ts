import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://srlrsngjooanmwljsfon.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybHJzbmdqb29hbm13bGpzZm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTUzNDYsImV4cCI6MjA2NzQ3MTM0Nn0.9EZRWlKq30fGA1ZCGtJ1GBt1L5HNNBF8iiszUWrouc0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
