const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

// @route   GET api/news/trending
// @desc    Get trending/top news
// @access  Public (or Private depending on requirements)
router.get('/trending', async (req, res) => {
  try {
    const { category = 'general', max = 10, page = 1 } = req.query;
    
    const url = `${BASE_URL}/top-headlines?country=us&category=${category}&pageSize=${max}&page=${page}&apiKey=${NEWS_API_KEY}`;
    
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('News fetch error:', err.response?.data || err.message);
    res.status(500).json({ msg: 'Failed to fetch news', details: err.response?.data });
  }
});

// @route   GET api/news/search
// @desc    Search for news
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q = '', max = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ msg: 'Search query is required' });
    }

    const url = `${BASE_URL}/everything?q=${encodeURIComponent(q)}&pageSize=${max}&apiKey=${NEWS_API_KEY}`;
    
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('News search error:', err.response?.data || err.message);
    res.status(500).json({ msg: 'Failed to search news', details: err.response?.data });
  }
});

module.exports = router;
