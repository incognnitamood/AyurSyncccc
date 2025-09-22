import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Patient {
  id: string | number;
  fullName: string;
  name?: string;
  age: number;
  email: string;
  phone: string;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  primaryDosha: string;
  dosha?: string;
  lastVisit?: string;
  status: string;
  avatar?: string;
  goals?: string;
  progress?: number;
  occupation?: string;
  dob?: string;
  doshaAnswers?: Array<{ question: string; answer: string }>;
  primaryConcerns?: string;
  currentSymptoms?: string[];
  medications?: string;
  allergies?: string;
  mealFrequency?: string;
  waterIntake?: string;
  cookingSkills?: string;
  cookingTime?: string;
  familySize?: number;
  dietType?: string;
  preferredCuisines?: string;
}

interface PatientContextType {
  patients: Patient[];
  selectedPatient: Patient | null;
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string | number, patient: Partial<Patient>) => void;
  deletePatient: (id: string | number) => void;
  selectPatient: (patient: Patient | null) => void;
  refreshPatients: () => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

interface PatientProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'ayursync_patients';

export const PatientProvider: React.FC<PatientProviderProps> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Load patients from localStorage on component mount
  useEffect(() => {
    loadPatientsFromStorage();
    // Also try to fetch from backend immediately
    fetchFromBackend();
  }, []);

  // Save patients to localStorage whenever patients array changes
  useEffect(() => {
    if (patients.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('patientsUpdated', { detail: patients }));
    }
  }, [patients]);

  const loadPatientsFromStorage = () => {
    try {
      const storedPatients = localStorage.getItem(STORAGE_KEY);
      if (storedPatients) {
        const parsedPatients = JSON.parse(storedPatients);
        setPatients(parsedPatients);
      } else {
        // Initialize with default patients if none exist
        const defaultPatients: Patient[] = [
          {
            id: 1,
            fullName: "Sarah Johnson",
            age: 34,
            email: "sarah.j@email.com",
            phone: "+1 (555) 123-4567",
            primaryDosha: "Vata-Pitta",
            lastVisit: "2024-01-15",
            status: "Active",
            avatar: "/api/placeholder/32/32",
            goals: "Weight management, digestive health",
            progress: 78,
            gender: "female",
            weight: 65,
            height: 165
          },
          {
            id: 2,
            fullName: "Michael Chen",
            age: 42,
            email: "m.chen@email.com",
            phone: "+1 (555) 234-5678",
            primaryDosha: "Pitta",
            lastVisit: "2024-01-12",
            status: "Follow-up",
            avatar: "/api/placeholder/32/32",
            goals: "Energy balance, stress management",
            progress: 85,
            gender: "male",
            weight: 78,
            height: 180
          },
          {
            id: 3,
            fullName: "Emma Davis",
            age: 28,
            email: "emma.davis@email.com",
            phone: "+1 (555) 345-6789",
            primaryDosha: "Kapha",
            lastVisit: "2024-01-10",
            status: "Active",
            avatar: "/api/placeholder/32/32",
            goals: "Metabolism boost, immunity",
            progress: 62,
            gender: "female",
            weight: 70,
            height: 170
          }
        ];
        setPatients(defaultPatients);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPatients));
      }
    } catch (error) {
      console.error('Error loading patients from storage:', error);
    }
  };

  const addPatient = (patient: Patient) => {
    const newPatient = {
      ...patient,
      id: Date.now().toString(), // Generate unique ID
      status: patient.status || 'Active',
      lastVisit: new Date().toISOString().split('T')[0]
    };
    
    setPatients(prev => [...prev, newPatient]);
    
    // Also try to sync with backend if available
    syncWithBackend('create', newPatient);
  };

  const updatePatient = (id: string | number, updatedData: Partial<Patient>) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === id ? { ...patient, ...updatedData } : patient
      )
    );
    
    // Sync with backend
    syncWithBackend('update', { id, ...updatedData });
  };

  const deletePatient = (id: string | number) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
    
    // Clear selected patient if it was deleted
    if (selectedPatient?.id === id) {
      setSelectedPatient(null);
    }
    
    // Sync with backend
    syncWithBackend('delete', { id });
  };

  const selectPatient = (patient: Patient | null) => {
    setSelectedPatient(patient);
  };

  const refreshPatients = () => {
    loadPatientsFromStorage();
    // Also try to fetch from backend if available
    fetchFromBackend();
  };

  // Backend synchronization functions
  const syncWithBackend = async (action: 'create' | 'update' | 'delete', data: any) => {
    try {
      console.log(`Attempting to sync ${action} with backend...`);
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      let response;
      
      switch (action) {
        case 'create':
          response = await fetch(`${baseUrl}/api/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          break;
        case 'update':
          response = await fetch(`${baseUrl}/api/patients/${data.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          break;
        case 'delete':
          response = await fetch(`${baseUrl}/api/patients/${data.id}`, {
            method: 'DELETE'
          });
          break;
      }
      
      if (response && response.ok) {
        console.log(`✅ Backend sync successful for ${action}`);
      } else {
        console.log(`⚠️ Backend sync failed for ${action}:`, response?.status);
      }
    } catch (error) {
      console.log(`❌ Backend sync failed for ${action}:`, error);
      console.log('Data saved locally only');
    }
  };

  const fetchFromBackend = async () => {
    try {
      console.log('Attempting to fetch patients from backend...');
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/patients`);
      console.log('Backend response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backend data received:', data);
        
        if (data.success && data.data.patients) {
          // Merge backend patients with local patients, avoiding duplicates
          const backendPatients = data.data.patients;
          setPatients(prev => {
            const merged = [...prev];
            backendPatients.forEach((backendPatient: any) => {
              const exists = merged.find(p => p.id === backendPatient._id || p.email === backendPatient.email);
              if (!exists) {
                merged.push({
                  id: backendPatient._id,
                  fullName: backendPatient.fullName,
                  age: backendPatient.age,
                  email: backendPatient.email,
                  phone: backendPatient.phone,
                  primaryDosha: backendPatient.primaryDosha,
                  status: backendPatient.status,
                  gender: backendPatient.gender
                });
              }
            });
            return merged;
          });
          console.log('✅ Backend connection successful! Patients loaded.');
        }
      } else {
        console.log('Backend responded with error status:', response.status);
      }
    } catch (error) {
      console.log('❌ Backend connection failed:', error);
      console.log('Using local storage data only');
    }
  };

  const value: PatientContextType = {
    patients,
    selectedPatient,
    addPatient,
    updatePatient,
    deletePatient,
    selectPatient,
    refreshPatients
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};

export default PatientContext;