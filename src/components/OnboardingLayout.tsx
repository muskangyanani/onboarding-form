import React from 'react';
import type { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <div className="mb-8 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
