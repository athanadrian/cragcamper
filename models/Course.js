const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add course title.'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add course description.']
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks.']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add tuition cost.']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add minimum skill.'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createAt: {
    type: Date,
    default: Date.now
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

// Static method to get average and total cost of course tuitions
CourseSchema.statics.getAverageAndTotalCost = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
        totalCost: { $sum: '$tuition' }
      }
    }
  ]);
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      totalCost: Math.ceil(obj[0].totalCost / 10) * 10,
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (error) {}
};

// Call getAverageCost after save
CourseSchema.post('save', function() {
  this.constructor.getAverageAndTotalCost(this.bootcamp);
});

// Call getAverageCost before save
CourseSchema.pre('remove', function() {
  this.constructor.getAverageAndTotalCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
