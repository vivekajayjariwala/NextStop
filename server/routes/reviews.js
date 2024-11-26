const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const List = require('../models/List');

// Toggle review visibility (requires both auth and admin middleware)
router.put('/:listId/reviews/:reviewId/toggle-visibility', [auth, admin], async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) return res.status(404).send('List not found');

    const review = list.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).send('Review not found');

    // Toggle the hidden status
    review.hidden = !review.hidden;
    await list.save();

    res.send({ success: true, hidden: review.hidden });
  } catch (error) {
    console.error('Error toggling review visibility:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router; 