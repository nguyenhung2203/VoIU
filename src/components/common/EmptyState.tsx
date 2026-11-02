import React, { ReactNode } from 'react';
import { FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-dashed border-strace-border my-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-strace-muted mb-3 border border-slate-100">
        {icon || <FolderSearch className="w-7 h-7 text-strace-muted" />}
      </div>
      <h4 className="text-base font-semibold text-strace-text mb-1">{title}</h4>
      {description && (
        <p className="text-sm text-strace-muted max-w-sm mb-4 leading-relaxed">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
