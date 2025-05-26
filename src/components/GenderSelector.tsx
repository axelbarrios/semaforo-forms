import React from 'react';
import { motion } from 'framer-motion';
import { User, UserRound } from 'lucide-react';

interface GenderSelectorProps {
  onSelectGender: (gender: 'husband' | 'wife') => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ onSelectGender }) => {
  return (
    <div className="flex items-center justify-center min-h-screen absolute inset-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#2d2d2d] p-8 rounded-lg shadow-lg max-w-2xl mx-auto text-white"
      >
        {/* Logo REM */}
        <div className="flex justify-center mb-6">
          <img 
            src="https://matrimoniosrem.com/wp-content/uploads/2021/07/REM_NUEVO-04-2048x825.png" 
            alt="Logo REM" 
            className="w-full max-w-md h-auto"
          />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Seleccione su género</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1f1f1f] p-6 rounded-lg cursor-pointer hover:bg-[#333333] transition-colors"
              onClick={() => onSelectGender('husband')}
            >
              <div className="flex justify-center mb-4">
                <User className="w-16 h-16 text-blue-500" />
              </div>
              <p className="text-xl font-medium">Esposo</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1f1f1f] p-6 rounded-lg cursor-pointer hover:bg-[#333333] transition-colors"
              onClick={() => onSelectGender('wife')}
            >
              <div className="flex justify-center mb-4">
                <UserRound className="w-16 h-16 text-pink-500" />
              </div>
              <p className="text-xl font-medium">Esposa</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GenderSelector;