
import { createClient } from '@supabase/supabase-js'


const supabaseUrl='https://yriwxwxrydfyoeslcubo.supabase.co'
const supabaseKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyaXd4d3hyeWRmeW9lc2xjdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNzcxMzcsImV4cCI6MjA3Mzg1MzEzN30.VRm9MhM4t-i3PvuTgwv9i_Nv_C0cZO0u9sc0DOxcJCI'

const supabase = createClient(supabaseUrl, supabaseKey)