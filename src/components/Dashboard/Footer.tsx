
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gcm-600 text-white p-4 text-center">
      <p className="text-sm">Sistema de Gestão da Guarda Civil Municipal © {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;
