import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user', required: true },
    avatar: { type: String, required: false },
    totalPoints: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
)

export default model('User', userSchema)