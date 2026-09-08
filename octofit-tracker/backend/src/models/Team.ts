import { Schema, model } from 'mongoose'

const teamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    motto: { type: String, required: true, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    totalPoints: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
)

export default model('Team', teamSchema)