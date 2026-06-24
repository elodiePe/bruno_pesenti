import express from 'express';
import BlogArticle from '../models/BlogArticle.js';

const router = express.Router();

// GET all blog articles
router.get('/', async (req, res) => {
  try {
    const articles = await BlogArticle.find().sort({ date: -1 });
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single blog article
router.get('/:id', async (req, res) => {
  try {
    const article = await BlogArticle.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE blog article (protected)
router.post('/', async (req, res) => {
  try {
    const article = new BlogArticle(req.body);
    const saved = await article.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// UPDATE blog article (protected)
router.put('/:id', async (req, res) => {
  try {
    const article = await BlogArticle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE blog article (protected)
router.delete('/:id', async (req, res) => {
  try {
    const article = await BlogArticle.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
