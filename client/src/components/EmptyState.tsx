import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="empty-state-box glass-card">
      <div className="empty-icon-wrap">
        <Icon size={36} className="text-sky-400" />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary mt-4">
          {actionText}
        </button>
      )}

      <style>{`
        .empty-state-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 64px 24px;
          margin: 24px 0;
        }
        .empty-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .empty-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .empty-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          max-width: 440px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};
