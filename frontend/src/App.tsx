import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { PatientManagement } from './components/PatientManagement';
import { DietPlanGenerator } from './components/DietPlanGenerator';
import { RecipeDatabase } from './components/RecipeDatabase';
import { ReportsGeneration } from './components/ReportsGeneration';
import { Topbar } from './components/Topbar';
import { LoginForm } from './components/LoginForm';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Book, 
  FileText,
  Loader2
} from 'lucide-react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// IMPORTANT: Replace with your actual Supabase project URL and anon key.
const SUPABASE_URL = 'https://yriwxwxrydfyoeslcubo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyaXd4d3hyeWRmeW9lc2xjdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNzcxMzcsImV4cCI6MjA3Mzg1MzEzN30.VRm9MhM4t-i3PvuTgwv9i_Nv_C0cZO0u9sc0DOxcJCI';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patient Management', icon: Users },
  { id: 'diet-plans', label: 'Diet Plan Generator', icon: Calendar },
  { id: 'recipes', label: 'Recipe Database', icon: Book },
  { id: 'reports', label: 'Reports & PDF', icon: FileText },
];

const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [recipesData, setRecipesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*');

        if (error) {
          throw error;
        }

        setRecipesData(data);
      } catch (err) {
        setError(err);
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    const observeElements = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      const animateElements = document.querySelectorAll('.animate-on-scroll');
      animateElements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    };

    const timer = setTimeout(observeElements, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, [activeSection]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientManagement />;
      case 'diet-plans':
        return <DietPlanGenerator />;
      case 'recipes':
        return <RecipeDatabase recipes={recipesData} loading={loading} error={error} />;
      case 'reports':
        return <ReportsGeneration />;
      default:
        return <Dashboard />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8E4] via-[#F5F1E4] to-[#E1D1A5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#9E7E3D] mx-auto mb-4" />
          <p className="text-[#4C7A5A]">Loading AyurSync...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEFEFE] via-[#D5D8AB]/30 to-[#84A15D]/20 texture-overlay" style={{ fontFamily: 'Georgia, serif' }}>
      <Topbar
        menuItems={menuItems}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        user={user}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
