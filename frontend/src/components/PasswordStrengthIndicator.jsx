import { validatePassword, getPasswordScore, PASSWORD_REQUIREMENTS } from '../utils/passwordValidator';

const PasswordStrengthIndicator = ({ password = '', showChecklist = true }) => {
    if (!password) return null;

    const checks = validatePassword(password);
    const scoreInfo = getPasswordScore(password);

    return (
        <div className="password-strength-box p-3 bg-light rounded-3 border mb-3">
            {/* Strength meter bar */}
            <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small fw-semibold text-secondary">Password Strength</span>
                <span className={`badge bg-${scoreInfo.color} rounded-pill px-2 py-1 small`}>
                    {scoreInfo.label}
                </span>
            </div>
            <div className="progress mb-2" style={{ height: '6px' }}>
                <div
                    className={`progress-bar bg-${scoreInfo.color} transition-all`}
                    role="progressbar"
                    style={{ width: `${scoreInfo.percent}%` }}
                    aria-valuenow={scoreInfo.percent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>

            {/* Live rules checklist */}
            {showChecklist && (
                <div className="mt-2 pt-1 border-top">
                    <ul className="list-unstyled mb-0 small">
                        {PASSWORD_REQUIREMENTS.map(req => {
                            const isMet = checks[req.id];
                            return (
                                <li
                                    key={req.id}
                                    className={`d-flex align-items-center gap-2 py-1 ${isMet ? 'text-success fw-medium' : 'text-muted'}`}
                                >
                                    <i
                                        className={`bi ${isMet ? 'bi-check-circle-fill text-success' : 'bi-dash-circle text-muted'}`}
                                        style={{ fontSize: '13px' }}
                                    ></i>
                                    <span>{req.label}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PasswordStrengthIndicator;
