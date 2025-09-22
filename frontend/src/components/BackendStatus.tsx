import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface BackendStatusProps {
  showLabel?: boolean;
  className?: string;
}

export const BackendStatus: React.FC<BackendStatusProps> = ({ 
  showLabel = true, 
  className = '' 
}) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/health');
        
        if (response.ok) {
          setStatus('connected');
        } else {
          setStatus('disconnected');
        }
      } catch (error) {
        setStatus('disconnected');
      }
    };

    checkBackendStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'checking':
        return {
          icon: <Loader2 className="w-3 h-3 animate-spin" />,
          text: 'Checking...',
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-600'
        };
      case 'connected':
        return {
          icon: <CheckCircle className="w-3 h-3" />,
          text: 'Backend Connected',
          variant: 'secondary' as const,
          className: 'bg-green-100 text-green-700 border-green-200'
        };
      case 'disconnected':
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          text: 'Local Mode',
          variant: 'secondary' as const,
          className: 'bg-orange-100 text-orange-700 border-orange-200'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className} flex items-center gap-1`}
    >
      {config.icon}
      {showLabel && <span className="text-xs">{config.text}</span>}
    </Badge>
  );
};

export default BackendStatus;