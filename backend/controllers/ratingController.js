import pool from '../db.js';

// Submit or update rating
export const submitRating = async (req, res) => {
  try {
    const { user_id, store_id, rating } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be 1-5' });

    // Check if rating exists
    const exists = await pool.query('SELECT * FROM ratings WHERE user_id=$1 AND store_id=$2', [user_id, store_id]);
    if (exists.rows.length > 0) {
      await pool.query('UPDATE ratings SET rating=$1 WHERE user_id=$2 AND store_id=$3', [rating, user_id, store_id]);
      return res.json({ message: 'Rating updated' });
    }

    const result = await pool.query('INSERT INTO ratings (user_id, store_id, rating) VALUES ($1,$2,$3) RETURNING *', [user_id, store_id, rating]);
    res.status(201).json({ message: 'Rating submitted', rating: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get ratings for a store
export const getStoreRatings = async (req, res) => {
  try {
    const { store_id } = req.params;
    const result = await pool.query('SELECT * FROM ratings WHERE store_id=$1', [store_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
