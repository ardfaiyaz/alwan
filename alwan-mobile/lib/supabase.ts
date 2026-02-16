import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqlxlaovkehnuimcogrr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbHhsYW92a2VobnVpbWNvZ3JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTE2NjYsImV4cCI6MjA4NjY2NzY2Nn0.bllI-mhUrxG3_HeZXh9aqhjkHD72l8dXBkJx3ucvQjw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
