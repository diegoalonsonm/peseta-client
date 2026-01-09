interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const calculateStrength = (pass: string): { strength: 'weak' | 'medium' | 'strong' | null, text: string } => {
    if (!pass) return { strength: null, text: '' };

    let score = 0;

    // Length check
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;

    // Character variety checks
    if (/[a-z]/.test(pass)) score++;  // lowercase
    if (/[A-Z]/.test(pass)) score++;  // uppercase
    if (/[0-9]/.test(pass)) score++;  // numbers
    if (/[^a-zA-Z0-9]/.test(pass)) score++;  // special characters

    if (score <= 2) return { strength: 'weak', text: 'Contraseña débil' };
    if (score <= 4) return { strength: 'medium', text: 'Contraseña media' };
    return { strength: 'strong', text: 'Contraseña fuerte' };
  };

  const { strength, text } = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="password-strength-bar">
        {strength && <div className={`password-strength-fill ${strength}`}></div>}
      </div>
      <div className="password-strength-text">{text}</div>
    </div>
  );
};

export default PasswordStrength;
