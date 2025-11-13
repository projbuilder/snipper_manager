import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  targetType: string;
  targetId: mongoose.Types.ObjectId;
  timestamp: Date;
  ip: string;
  metadata: Record<string, any>;
}

const auditLogSchema = new Schema<IAuditLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'fork', 'execute', 'star', 'view', 'login', 'logout'],
  },
  targetType: {
    type: String,
    required: true,
    enum: ['snippet', 'collection', 'user'],
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  ip: {
    type: String,
    required: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

// Indexes for audit queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

export default mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
