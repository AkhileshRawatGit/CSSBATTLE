import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  code: string;
  score: number;
  similarity: number;
  codeLength: number;
  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    similarity: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    codeLength: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast leaderboard queries
SubmissionSchema.index({ challengeId: 1, score: -1 });
SubmissionSchema.index({ userId: 1, challengeId: 1 });

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
