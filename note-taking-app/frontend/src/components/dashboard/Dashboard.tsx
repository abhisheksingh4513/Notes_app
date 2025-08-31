import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, BookOpen, Edit, Trash2, X, Calendar, LogOut, FileText } from 'lucide-react';
import './dashboard.css';
import ApiService from '../../services/api';
import { STORAGE_KEYS } from '../../utils/constants';
import { Note as ApiNote, User as ApiUser } from '../../types';

// Use shared types from ../../types

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<ApiNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<ApiNote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchNotes();
  }, []);

  const fetchUserData = async () => {
    try {
      const profile = await ApiService.getUserProfile();
      setUser(profile);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getNotes();
      setNotes(response);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    navigate('/login');
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsCreating(true);
    setNewNote({ title: '', content: '' });
    setModalOpen(true);
  };

  const handleEditNote = (note: ApiNote) => {
    setSelectedNote(note);
    setIsCreating(false);
    setNewNote({ title: note.title, content: note.content });
    setModalOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await ApiService.deleteNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleSaveNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    try {
      if (isCreating) {
        const created = await ApiService.createNote(newNote);
        setNotes([created, ...notes]);
      } else if (selectedNote) {
        const updated = await ApiService.updateNote(selectedNote.id, newNote);
        setNotes(notes.map(note => note.id === selectedNote.id ? updated : note));
      }
      
      setModalOpen(false);
      setNewNote({ title: '', content: '' });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modern-dashboard">
      {/* Modern Header */}
      <header className="modern-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <FileText size={16} />
            </div>
            <h1 className="logo-text">NoteCraft</h1>
          </div>
          
          <div className="user-section">
            {user && (
              <div className="user-info">
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-details">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
            )}
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-card">
          <div className="welcome-content">
            <h1>Welcome back, {user?.name || 'User'}!</h1>
            <p>Organize your thoughts and ideas with beautiful notes</p>
          </div>
          
          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-number">{notes.length}</div>
              <div className="stat-label">Total Notes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{filteredNotes.length}</div>
              <div className="stat-label">Filtered</div>
            </div>
            
            <button onClick={handleCreateNote} className="create-note-btn">
              <Plus size={16} />
              Create Note
            </button>
          </div>
        </div>

        {/* Search and Filter Toolbar */}
        <div className="toolbar">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ 
              position: 'absolute', 
              left: '0.75rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#6b7280' 
            }} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button className="filter-btn active">
            All Notes
          </button>
          <button className="filter-btn">
            Recent
          </button>
        </div>
      </div>

      {/* Notes Container */}
      <div className="notes-container">
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px' 
          }}>
            <div className="loading-spinner" style={{ width: '2rem', height: '2rem' }}></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <BookOpen size={24} />
            </div>
            <h3 className="empty-title">
              {searchTerm ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="empty-description">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Create your first note to get started'
              }
            </p>
            {!searchTerm && (
              <button onClick={handleCreateNote} className="create-note-btn">
                <Plus size={16} />
                Create Your First Note
              </button>
            )}
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <div key={note.id} className="note-card" onClick={() => handleEditNote(note)}>
                <div className="note-header">
                  <div>
                    <h3 className="note-title">{note.title}</h3>
                    <div className="note-date">
                      <Calendar size={12} style={{ marginRight: '0.25rem' }} />
                      {formatDate(note.updatedAt)}
                    </div>
                  </div>
                  <div className="note-actions" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => handleEditNote(note)}
                    className="note-action-btn edit-btn"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeleteNote(note.id)}
                    className="note-action-btn delete-btn"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="note-content">{note.content}</p>
            </div>
          ))}
        </div>
      )}
      </div>
      {/* Note Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {isCreating ? 'Create New Note' : 'Edit Note'}
              </h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="close-btn"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Enter note title..."
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Write your note content..."
                className="form-textarea"
              />
            </div>
            
            <div className="modal-actions">
              <button 
                onClick={() => setModalOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveNote}
                className="btn-primary"
                disabled={!newNote.title.trim() || !newNote.content.trim()}
              >
                {isCreating ? 'Create Note' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
