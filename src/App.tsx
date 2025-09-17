import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { PatientManagement } from './components/PatientManagement';
import { DietPlanGenerator } from './components/DietPlanGenerator';
import { RecipeDatabase } from './components/RecipeDatabase';
import { ReportsGeneration } from './components/ReportsGeneration';
import { Sidebar } from './components/Sidebar';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Book, 
  FileText,
  Menu,
  X
} from 'lucide-react';
import { Button } from './components/ui/button';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patient Management', icon: Users },
  { id: 'diet-plans', label: 'Diet Plan Generator', icon: Calendar },
  { id: 'recipes', label: 'Recipe Database', icon: Book },
  { id: 'reports', label: 'Reports & PDF', icon: FileText },
];

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Scroll animation effect
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

      // Observe all elements with animate-on-scroll class
      const animateElements = document.querySelectorAll('.animate-on-scroll');
      animateElements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    };

    // Set up observer after a small delay to ensure elements are rendered
    const timer = setTimeout(observeElements, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, [activeSection]); // Re-run when section changes

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E1D1A5] via-[#F5C24D]/20 to-[#4C7A5A]/30 texture-overlay">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/90 backdrop-blur-md border-b border-[#9E7E3D]/20 p-4 flex items-center justify-between">
        <h1 className="text-[#9E7E3D] font-medium">Ayurvedic Diet Management</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-[#9E7E3D] hover:bg-[#F5C24D]/20"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          menuItems={menuItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <main className="p-4 lg:p-8">
            {renderActiveSection()}
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}