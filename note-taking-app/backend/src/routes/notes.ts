import { Router } from 'express';
import { pool } from '../config/database.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all notes for the authenticated user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    
    const result = await pool.query(
      'SELECT id, title, content, user_id, created_at, updated_at FROM notes WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
});

// Get a specific note
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await pool.query(
      'SELECT id, title, content, user_id, created_at, updated_at FROM notes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Failed to fetch note' });
  }
});

// Create a new note
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    if (title.length > 500) {
      return res.status(400).json({ message: 'Title must be less than 500 characters' });
    }

    const result = await pool.query(
      'INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING id, title, content, user_id, created_at, updated_at',
      [title.trim(), content.trim(), userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Failed to create note' });
  }
});

// Update a note
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!title && !content) {
      return res.status(400).json({ message: 'Title or content is required' });
    }

    // Check if note exists and belongs to user
    const existingNote = await pool.query(
      'SELECT id FROM notes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingNote.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      if (title.length > 500) {
        return res.status(400).json({ message: 'Title must be less than 500 characters' });
      }
      updates.push(`title = $${paramCount}`);
      values.push(title.trim());
      paramCount++;
    }

    if (content !== undefined) {
      updates.push(`content = $${paramCount}`);
      values.push(content.trim());
      paramCount++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, userId);

    const query = `
      UPDATE notes 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING id, title, content, user_id, created_at, updated_at
    `;

    const result = await pool.query(query, values);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Failed to update note' });
  }
});

// Delete a note
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Failed to delete note' });
  }
});

export default router;
