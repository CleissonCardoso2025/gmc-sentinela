
import React from "react";

export const LoginBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black overflow-hidden relative">
      {/* Background lighting effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[100px]" />
      
      <div className="z-10 w-full max-w-md px-8 py-10">
        {children}
      </div>
    </div>
  );
};
