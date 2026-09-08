import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      { name: 'Maya Chen', email: 'maya.chen@example.com', avatar: 'MC', totalPoints: 1280 },
      { name: 'Jordan Rivera', email: 'jordan.rivera@example.com', avatar: 'JR', totalPoints: 1140 },
      { name: 'Sam Okafor', email: 'sam.okafor@example.com', avatar: 'SO', totalPoints: 980 },
      { name: 'Priya Shah', email: 'priya.shah@example.com', avatar: 'PS', totalPoints: 860 },
    ]);

    await Team.insertMany([
      {
        name: 'Peak Performers',
        motto: 'Small steps, strong finish.',
        members: [users[0]._id, users[1]._id],
        totalPoints: 2420,
      },
      {
        name: 'Trail Blazers',
        motto: 'Find your next summit.',
        members: [users[2]._id, users[3]._id],
        totalPoints: 1840,
      },
    ]);

    await Activity.insertMany([
      { user: users[0]._id, type: 'Strength training', durationMinutes: 45, calories: 360, points: 180, completedAt: new Date('2026-09-06') },
      { user: users[1]._id, type: 'Cycling', durationMinutes: 50, calories: 420, points: 210, completedAt: new Date('2026-09-05') },
      { user: users[2]._id, type: 'Running', durationMinutes: 30, calories: 290, points: 145, completedAt: new Date('2026-09-04') },
      { user: users[3]._id, type: 'Yoga', durationMinutes: 35, calories: 160, points: 80, completedAt: new Date('2026-09-03') },
    ]);

    await Leaderboard.insertMany([
      { user: users[0]._id, rank: 1, points: 1280, streakDays: 12 },
      { user: users[1]._id, rank: 2, points: 1140, streakDays: 9 },
      { user: users[2]._id, rank: 3, points: 980, streakDays: 7 },
      { user: users[3]._id, rank: 4, points: 860, streakDays: 5 },
    ]);

    await Workout.insertMany([
      {
        title: 'Foundation Strength',
        description: 'A full-body session built around controlled compound movements.',
        difficulty: 'Beginner',
        durationMinutes: 30,
        exercises: ['Bodyweight squat', 'Incline push-up', 'Dead bug'],
        tags: ['strength', 'full body'],
      },
      {
        title: 'Tempo Run Builder',
        description: 'A focused interval workout to improve running pace and stamina.',
        difficulty: 'Intermediate',
        durationMinutes: 40,
        exercises: ['Warm-up jog', 'Tempo intervals', 'Cool-down walk'],
        tags: ['cardio', 'running'],
      },
      {
        title: 'Mobility Reset',
        description: 'A gentle mobility flow for hips, shoulders, and lower back.',
        difficulty: 'Beginner',
        durationMinutes: 20,
        exercises: ['Cat-cow', 'Worlds greatest stretch', 'Child pose'],
        tags: ['mobility', 'recovery'],
      },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
