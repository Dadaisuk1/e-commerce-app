// src/app/components/layout/Footer.tsx
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-12 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
        <p>&copy; {currentYear} MyStore. All rights reserved.</p>
        {/* Add more footer links or info here if needed */}
      </div>
    </footer>
  );
}
