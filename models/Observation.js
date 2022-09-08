const mongoose = require('mongoose');

const ObservationSchema2 = new mongoose.Schema(
  {
    createdDate: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'public',
      enum: ['public', 'private'],
    },
    commonName: {
      type: String,
      trim: true,
    },
    generalTaxa: {
      type: String,
      default: 'Mammal',
      enum: [
        'mammal',
        'bird',
        'reptile',
        'amphibian',
        'bony fish',
        'cartilaginous fish',
        'insect',
        'spider',
        'plants',
      ],
    },
    genus: {
      type: String,
      trim: true,
    },
    species: {
      type: String,
      trim: true,
    },
    details: {
      type: String,
      required: false,
      trim: true,
    },
    number: {
      type: Number,
      required: false,
    },
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    accuracy: {
      type: Number,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// exporting the model from above. To be referenced elsewhere as 'Observation' and placed in the observations collection in our MongoDB
module.exports = mongoose.model('Observation2', ObservationSchema2);
