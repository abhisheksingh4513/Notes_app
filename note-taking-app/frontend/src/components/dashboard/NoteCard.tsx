import React from 'react';
import { Edit2, Trash2, Calendar } from 'lucide-react';
import { Note } from '../../types';
import { formatDate, truncateText } from '../../utils/validation';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
          {truncateText(note.title, 50)}
        </h3>
        <div className="flex space-x-1 ml-2">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit note"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {truncateText(note.content, 150)}
        </p>
      </div>

      <div className="flex items-center text-xs text-gray-500">
        <Calendar className="h-3 w-3 mr-1" />
        <span>{formatDate(note.updatedAt)}</span>
      </div>
    </div>
  );
};

export default NoteCard;
