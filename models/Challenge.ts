import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  description: string;
  image: string;
  difficulty: 'easy' | 'medium' | 'hard';
  targetCode: string;
  colors: string[];
  tags: string[];
  isActive: boolean;
  timeLimit: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: [true, 'Image path is required'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    targetCode: {
      type: String,
      default: '',
    },
    colors: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    timeLimit: {
      type: Number,
      default: 30, // 30 minutes by default
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);
