import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { PatientManagement } from './components/PatientManagement';
import { DietPlanGenerator } from './components/DietPlanGenerator';
import { RecipeDatabase } from './components/RecipeDatabase';
import { ReportsGeneration } from './components/ReportsGeneration';
import { Topbar } from './components/topbar';
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

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patient Management', icon: Users },
  { id: 'diet-plans', label: 'Diet Plan Generator', icon: Calendar },
  { id: 'recipes', label: 'Recipe Database', icon: Book },
  { id: 'reports', label: 'Reports & PDF', icon: FileText },
];

const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user, loading: authLoading } = useAuth();

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
        return <RecipeDatabase />;
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
