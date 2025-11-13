import mongoose, { Document, Schema } from 'mongoose';

export interface ICollection extends Document {
  name: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  snippetIds: mongoose.Types.ObjectId[];
  visibility: 'private' | 'shared' | 'public';
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    snippetIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Snippet',
      },
    ],
    visibility: {
      type: String,
      enum: ['private', 'shared', 'public'],
      default: 'private',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
collectionSchema.index({ owner: 1, createdAt: -1 });
collectionSchema.index({ visibility: 1 });

export default mongoose.model<ICollection>('Collection', collectionSchema);
