
import React from 'react';

interface AvatarProps {
  children?: React.ReactNode; 
  className?: string; 
}

export default function AvatarUpload({ children, className }: AvatarProps) { 
     return (
        
        <div className={`w-48 h-48 rounded-full bg-gradient-to-br from-[#8f6f79] to-[#c3adb4] flex items-center justify-center shadow-lg ${className}`}>
          {children}
        </div>
      
    ); 
 }
