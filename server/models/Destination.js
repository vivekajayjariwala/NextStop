const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  Destination: { type: String, required: true },
  Region: { type: String, required: true },
  Country: { type: String, required: true },
  Category: { type: String, required: true },
  Latitude: { type: Number, required: true },
  Longitude: { type: Number, required: true },
  ApproximateAnnualTourists: { type: String, required: true },
  Currency: { type: String, required: true },
  MajorityReligion: { type: String, required: true },
  FamousFoods: { type: String, required: true },
  Language: { type: String, required: true },
  BestTimeToVisit: { type: String, required: true },
  CostOfLiving: { type: String, required: true },
  Safety: { type: String, required: true },
  CulturalSignificance: { type: String, required: true },
  Description: { type: String, required: true }
});

const Destination = mongoose.model('european_destinations', destinationSchema);

module.exports = Destination;
