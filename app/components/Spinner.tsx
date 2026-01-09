interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'white';
}

const Spinner = ({ size = 'md', color = 'primary' }: SpinnerProps) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';

  return (
    <div className={`spinner-border text-${color} ${sizeClass}`} role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  );
};

export default Spinner;
