
import React from 'react';

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-xl font-bold text-teal-700 mb-6 border-b-2 border-teal-200 pb-2">{children}</h3>
);
