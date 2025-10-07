import pool from '../db.js';

// Get all stores
export const getStores = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stores ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add a store (admin only)
export const addStore = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    if (!name) return res.status(400).json({ message: 'Store name required' });

    const result = await pool.query(
      'INSERT INTO stores (name, email, address) VALUES ($1,$2,$3) RETURNING *',
      [name, email, address]
    );
    res.status(201).json({ message: 'Store added', store: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
