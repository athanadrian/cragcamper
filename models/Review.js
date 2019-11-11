const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title to the review!'],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'Please add a some text!']
  },
  rating: {
    type: Number,
    required: [true, 'Please add a reating from 1 to 10!'],
    max: 10,
    min: 1
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

// Make sure to prevent user submitting more than one preview per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get average rating of a bootcamp
ReviewSchema.statics.getAverageRating = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageRating before remove
ReviewSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
