import mongoose, { Document, Schema } from 'mongoose';

export interface ISnippet extends Document {
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  visibility: 'public' | 'private' | 'unlisted';
  forks: number;
  parentSnippet: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
  stats: {
    views: number;
    stars: number;
  };
  executionAllowed: boolean;
  attachments: Array<{
    filename: string;
    url: string;
  }>;
  license?: string;
}

const snippetSchema = new Schema<ISnippet>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    code: {
      type: String,
      required: true,
      maxlength: 100000, // 100KB limit
    },
    language: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10;
        },
        message: 'Maximum 10 tags allowed',
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'unlisted'],
      default: 'private',
      index: true,
    },
    forks: {
      type: Number,
      default: 0,
    },
    parentSnippet: {
      type: Schema.Types.ObjectId,
      ref: 'Snippet',
      default: null,
    },
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      stars: {
        type: Number,
        default: 0,
      },
    },
    executionAllowed: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        filename: String,
        url: String,
      },
    ],
    license: {
      type: String,
      enum: ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'CC0-1.0', null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
snippetSchema.index({ language: 1 });
snippetSchema.index({ tags: 1 });
snippetSchema.index({ visibility: 1, createdAt: -1 });
snippetSchema.index({ author: 1, createdAt: -1 });

// Text index for search
snippetSchema.index({
  title: 'text',
  description: 'text',
  code: 'text',
});

// Compound indexes
snippetSchema.index({ visibility: 1, language: 1 });
snippetSchema.index({ visibility: 1, tags: 1 });

export default mongoose.model<ISnippet>('Snippet', snippetSchema);
