'use client'
import { useState } from 'react';
import styles from './AuthPage.module.scss';
import { login, signup } from '@/services/user/user.service';
import { useRouter } from 'next/navigation';
const AuthPage: React.FC = () => {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        // Validate on change if field has been touched
        if (touched[name as keyof typeof touched]) {
            validateField(name, value);
        }
    };

    const handleBlur = (fieldName: string) => {
        setTouched({
            ...touched,
            [fieldName]: true
        });
        validateField(fieldName, formData[fieldName as keyof typeof formData]);
    };

    const validateField = (fieldName: string, value: string) => {
        let error = '';

        if (fieldName === 'email') {
            if (!value) {
                error = 'Email is required';
            } else if (!validateEmail(value)) {
                error = 'Please enter a valid email address';
            }
        }

        if (fieldName === 'password') {
            if (!value) {
                error = 'Password is required';
            } else if (!validatePassword(value)) {
                error = 'Password must be at least 6 characters long';
            }
        }

        setErrors(prev => ({
            ...prev,
            [fieldName]: error
        }));
    };

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched({
            email: true,
            password: true
        });

        // Validate all fields
        const emailError = !formData.email ? 'Email is required' :
            !validateEmail(formData.email) ? 'Please enter a valid email address' : '';
        const passwordError = !formData.password ? 'Password is required' :
            !validatePassword(formData.password) ? 'Password must be at least 6 characters long' : '';

        setErrors({
            email: emailError,
            password: passwordError
        });

        // Only submit if no errors
        if (!emailError && !passwordError) {
            let toSignIn = isSignUp ? signup(formData).then(() => router.push(`list`)) : login(formData).then(() => router.push(`list`));
            console.log("🚀 ~ handleSubmit ~ toLogIn:", toSignIn)
            console.log('Form submitted:', formData);
            // Add your submission logic here
            // if (isSignUp) {
            //     router.push(`list`);
            // }
        }
    };

    return (
        <div className={styles.authContainer}>
            {/* Left Side - Visual/Branding */}
            <div className={styles.authVisual}>
                <div className={styles.visualContent}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect x="8" y="8" width="32" height="32" rx="8" fill="white" opacity="0.2" />
                                <rect x="12" y="16" width="24" height="3" rx="1.5" fill="white" />
                                <rect x="12" y="22" width="18" height="3" rx="1.5" fill="white" />
                                <rect x="12" y="28" width="20" height="3" rx="1.5" fill="white" />
                            </svg>
                        </div>
                        <h1 className={styles.logoText}>ProductivityHub</h1>
                    </div>

                    <div className={styles.visualMessage}>
                        <h2>Organize your life, amplify your productivity</h2>
                        <p>Track tasks, manage time, and achieve your goals with our intuitive dashboard designed for modern professionals.</p>
                    </div>

                    <div className={styles.featureBadges}>
                        <div className={styles.badge}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <span>Task Management</span>
                        </div>
                        <div className={styles.badge}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>Smart Calendar</span>
                        </div>
                        <div className={styles.badge}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="20" x2="18" y2="10" />
                                <line x1="12" y1="20" x2="12" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="14" />
                            </svg>
                            <span>Progress Analytics</span>
                        </div>
                    </div>

                    <div className={styles.decorativeElements}>
                        <div className={`${styles.circle} ${styles.circle1}`}></div>
                        <div className={`${styles.circle} ${styles.circle2}`}></div>
                        <div className={`${styles.circle} ${styles.circle3}`}></div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className={styles.authFormSide}>
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                        <p>{isSignUp ? 'Sign up to get started with ProductivityHub' : 'Sign in to continue to your dashboard'}</p>
                    </div>

                    <div className={styles.authForm}>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('email')}
                                placeholder="Enter your email"
                                className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
                            />
                            {errors.email && touched.email && (
                                <span className={styles.errorMessage}>{errors.email}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('password')}
                                placeholder="Enter your password"
                                className={`${styles.input} ${errors.password && touched.password ? styles.inputError : ''}`}
                            />
                            {errors.password && touched.password && (
                                <span className={styles.errorMessage}>{errors.password}</span>
                            )}
                        </div>

                        <button onClick={handleSubmit} className={styles.submitBtn}>
                            {isSignUp ? 'Create Account' : 'Sign In'}
                        </button>
                    </div>

                    <div className={styles.divider}>
                        <span>or continue with</span>
                    </div>

                    <div className={styles.socialAuth}>
                        <button className={styles.socialBtn}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M19.8 10.2c0-.7-.1-1.4-.2-2H10v3.8h5.5c-.2 1.2-1 2.3-2.1 3v2.5h3.4c2-1.8 3-4.5 3-7.3z" fill="#4285F4" />
                                <path d="M10 20c2.7 0 4.9-.9 6.5-2.4l-3.4-2.5c-.9.6-2.1 1-3.1 1-2.4 0-4.4-1.6-5.2-3.8H1.3v2.6C2.9 17.8 6.2 20 10 20z" fill="#34A853" />
                                <path d="M4.8 11.3c-.4-1.2-.4-2.4 0-3.6V5.1H1.3c-1.3 2.6-1.3 5.6 0 8.2l3.5-2z" fill="#FBBC04" />
                                <path d="M10 3.9c1.3 0 2.5.5 3.4 1.3l2.5-2.5C14.4.9 12.2 0 10 0 6.2 0 2.9 2.2 1.3 5.1l3.5 2.6C5.6 5.5 7.6 3.9 10 3.9z" fill="#EA4335" />
                            </svg>
                            <span>Google</span>
                        </button>
                        <button className={styles.socialBtn}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="#1877F2">
                                <path d="M20 10c0-5.5-4.5-10-10-10S0 4.5 0 10c0 5 3.7 9.1 8.4 9.9v-7H5.9V10h2.5V7.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V10h2.8l-.4 2.9h-2.3v7C16.3 19.1 20 15 20 10z" />
                            </svg>
                            <span>Facebook</span>
                        </button>
                    </div>

                    <div className={styles.toggleAuth}>
                        <p>
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;