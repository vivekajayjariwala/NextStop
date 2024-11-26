const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
    hidden: { type: Boolean, default: false }
});

const listSchema = new mongoose.Schema({
    listName: { type: String, required: true },
    description: { type: String },
    isPublic: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    destinationIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'Destination', default: [] },
    createdAt: { type: Date, default: Date.now },
    lastEdited: { type: Date },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 }
});

// Method to update average rating
listSchema.methods.updateAverageRating = function() {
    if (this.reviews.length === 0) {
        this.averageRating = 0;
    } else {
        const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        this.averageRating = sum / this.reviews.length;
    }
};

const List = mongoose.model('lists', listSchema);
module.exports = List;
