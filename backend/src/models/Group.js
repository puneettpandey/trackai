import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 40 },
  description: { type: String, trim: true, maxlength: 100, default: '' },
  isPrivate: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['Admin', 'Member'], required: true },
  }],
}, { timestamps: true })

groupSchema.index({ 'members.user': 1 })

export default mongoose.models.Group || mongoose.model('Group', groupSchema)
