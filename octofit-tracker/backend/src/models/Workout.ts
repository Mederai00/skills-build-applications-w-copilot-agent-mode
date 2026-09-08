import { Schema, model } from 'mongoose'

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    exercises: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true },
)

export default model('Workout', workoutSchema)