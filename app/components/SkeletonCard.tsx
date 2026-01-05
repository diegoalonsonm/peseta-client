const SkeletonCard = () => {
  return (
    <div className="skeleton-card mb-2 p-3 border-top border-dark-subtle">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center flex-grow-1">
          <div className="skeleton skeleton-icon me-3"></div>
          <div className="flex-grow-1">
            <div className="skeleton skeleton-text mb-2" style={{ width: '60%' }}></div>
            <div className="skeleton skeleton-text-sm" style={{ width: '40%' }}></div>
          </div>
        </div>
        <div className="skeleton skeleton-amount"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
