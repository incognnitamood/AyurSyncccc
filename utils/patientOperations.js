import { createClient } from '@supabase/supabase-js';

// **IMPORTANT: Replace with your own unique keys from your Supabase project**
const supabaseUrl = 'https://yriwxwxrydfyoeslcubo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyaXd4d3hyeWRmeW9lc2xjdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNzcxMzcsImV4cCI6MjA3Mzg1MzEzN30.VRm9MhM4t-i3PvuTgwv9i_Nv_C0cZO0u9sc0DOxcJCI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to save a new patient to the database
export const savePatientToDatabase = async (newPatientData: any) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .insert([newPatientData])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Supabase Error: ${error.message}`);
    }

    console.log('Patient saved successfully:', data);
    return data[0];
  } catch (err) {
    console.error('Failed to save patient:', err);
    throw err;
  }
};

// Function to fetch all patients from the database
export const fetchPatientsFromDatabase = async () => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*');

    if (error) {
      console.error('Supabase fetch error:', error);
      throw new Error(`Supabase Error: ${error.message}`);
    }

    console.log('Patients fetched successfully:', data);
    return data;
  } catch (err) {
    console.error('Failed to fetch patients:', err);
    throw err;
  }
};
