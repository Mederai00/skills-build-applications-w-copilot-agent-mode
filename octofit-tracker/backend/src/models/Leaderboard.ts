import { Schema, model } from 'mongoose'

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rank: { type: Number, required: true, min: 1 },
    points: { type: Number, required: true, min: 0 },
    streakDays: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
)

export default model('Leaderboard', leaderboardSchema)