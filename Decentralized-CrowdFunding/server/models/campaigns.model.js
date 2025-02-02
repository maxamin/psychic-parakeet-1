import mongoose from 'mongoose'

const CampaignSchema = new mongoose.Schema(
  {
    campaignId: {
      type: Number,
      required: [true, 'campaignId is missing'],
      unique: [true, 'campaignId must be unique'],
      immutable: true
    },
    desc: {
      type: String,
      required: [true, 'description is missing']
    },
    category: {
      type: String,
      required: [true, 'category is missing']
    },
    message: {
      type: String
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export default mongoose.model('Campaign', CampaignSchema)
