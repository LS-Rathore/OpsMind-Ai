import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      enum: [
        'document_upload',
        'document_delete',
        'document_reindex',
        'document_visibility_change',
        'user_create',
        'user_deactivate',
        'user_activate',
        'user_password_reset',
      ],
      required: true,
    },
    targetType: { type: String, enum: ['document', 'user'], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ userId: 1 });

export default mongoose.model('AuditLog', auditLogSchema);
