import React from 'react';
import { Plus, FileText } from 'lucide-react';
import { User } from '../../types';
import Button from '../common/Button';

interface WelcomeSectionProps {
  user: User;
  onCreateNote: () => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user, onCreateNote }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600">
            Organize your thoughts and ideas with ease
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center hidden sm:block">
            <FileText className="h-8 w-8 text-primary-600 mx-auto mb-1" />
            <p className="text-sm text-gray-500">Your digital notebook</p>
          </div>
          
          <Button
            onClick={onCreateNote}
            className="flex items-center"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Note
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
