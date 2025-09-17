import React from 'react';
import { Button } from './ui/button';
import { cn } from './ui/utils';
import { Leaf } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  menuItems: MenuItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ 
  menuItems, 
  activeSection, 
  onSectionChange, 
  isOpen, 
  onClose 
}: SidebarProps) {
  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#9E7E3D] to-[#4C7A5A] border-r border-[#E1D1A5]/10 transform transition-all duration-500 ease-out lg:translate-x-0 shadow-2xl",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-[#E1D1A5]/10">
        <div className="flex items-center space-x-3 animate-fade-in-up">
          <div className="w-12 h-12 bg-gradient-to-br from-[#F5C24D] to-[#D39A7A] rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
            <Leaf className="w-7 h-7 text-[#9E7E3D]" />
          </div>
          <div>
            <h2 className="text-[#E1D1A5] font-semibold">Ayurvedic Diet</h2>
            <p className="text-[#F5C24D] text-sm">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start space-x-3 h-12 rounded-lg transition-all duration-300 group",
                isActive 
                  ? "bg-gradient-to-r from-[#F5C24D] to-[#D39A7A] text-[#9E7E3D] border border-[#F5C24D]/30 shadow-lg transform scale-105" 
                  : "text-[#E1D1A5] hover:bg-[#4C7A5A]/30 hover:text-[#F5C24D] hover:scale-105 hover:shadow-md"
              )}
              onClick={() => {
                onSectionChange(item.id);
                onClose();
              }}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E1D1A5]/10">
        <div className="text-center text-sm text-[#F5C24D]">
          <p>Healthcare Practitioner Portal</p>
          <p className="text-xs mt-1 text-[#D39A7A]">Version 2.1.0</p>
        </div>
      </div>
    </div>
  );
}