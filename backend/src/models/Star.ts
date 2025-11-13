import mongoose, { Document, Schema } from 'mongoose';

export interface IStar extends Document {
  userId: mongoose.Types.ObjectId;
  snippetId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const starSchema = new Schema<IStar>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  snippetId: {
    type: Schema.Types.ObjectId,
    ref: 'Snippet',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Composite unique index to prevent duplicate stars
starSchema.index({ userId: 1, snippetId: 1 }, { unique: true });
starSchema.index({ snippetId: 1, createdAt: -1 });

export default mongoose.model<IStar>('Star', starSchema);
