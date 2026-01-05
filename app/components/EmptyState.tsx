import Link from "next/link";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  actionText: string;
  actionLink: string;
}

const EmptyState = ({ icon, title, message, actionText, actionLink }: EmptyStateProps) => {
  return (
    <div className="empty-state text-center py-5 my-4">
      <div className="empty-state-icon mb-3">
        {icon}
      </div>
      <h4 className="empty-state-title mb-2">{title}</h4>
      <p className="mb-4">{message}</p>
      <Link href={actionLink} className="btn btn-info text-white">
        {actionText}
      </Link>
    </div>
  );
};

export default EmptyState;
