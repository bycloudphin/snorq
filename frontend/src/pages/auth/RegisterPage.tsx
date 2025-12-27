import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register, isAuthenticated, isLoading: authLoading } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Password strength indicators
    const passwordChecks = {
        length: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
    };

    const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password strength
        if (passwordStrength < 3) {
            setError('Please use a stronger password');
            return;
        }

        setIsLoading(true);

        const result = await register(email, password, name || undefined);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Registration failed');
        }

        setIsLoading(false);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left side - Decorative */}
            <div className="hidden lg:flex flex-1 bg-slate-900 items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <div className="w-24 h-24 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <MessageSquare className="w-12 h-12 text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Join thousands of businesses
                    </h2>
                    <p className="text-slate-400">
                        Start managing all your social conversations in one unified inbox. Free to get started.
                    </p>

                    {/* Plan info */}
                    <div className="mt-8 p-6 bg-slate-800/50 rounded-2xl text-left">
                        <h3 className="text-white font-semibold mb-3">Free Plan Includes:</h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                1 team member
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                3 platform connections
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                Unlimited conversations
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                Basic analytics
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-8">
                        <Link to="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">SNORQ</span>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
                        <p className="text-slate-500">
                            Get started with your free workspace today
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Full name <span className="text-slate-400">(optional)</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="mt-3 space-y-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength >= level
                                                        ? passwordStrength <= 2
                                                            ? 'bg-red-400'
                                                            : passwordStrength === 3
                                                                ? 'bg-amber-400'
                                                                : 'bg-green-400'
                                                        : 'bg-slate-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-1 text-xs">
                                        <div className={`flex items-center gap-1 ${passwordChecks.length ? 'text-green-600' : 'text-slate-400'}`}>
                                            <Check className="w-3 h-3" /> 8+ characters
                                        </div>
                                        <div className={`flex items-center gap-1 ${passwordChecks.hasUppercase ? 'text-green-600' : 'text-slate-400'}`}>
                                            <Check className="w-3 h-3" /> Uppercase
                                        </div>
                                        <div className={`flex items-center gap-1 ${passwordChecks.hasLowercase ? 'text-green-600' : 'text-slate-400'}`}>
                                            <Check className="w-3 h-3" /> Lowercase
                                        </div>
                                        <div className={`flex items-center gap-1 ${passwordChecks.hasNumber ? 'text-green-600' : 'text-slate-400'}`}>
                                            <Check className="w-3 h-3" /> Number
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Confirm password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all ${confirmPassword && confirmPassword !== password
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-slate-200 focus:border-green-500'
                                        }`}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            {confirmPassword && confirmPassword !== password && (
                                <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || Boolean(confirmPassword && confirmPassword !== password)}
                            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-8 text-center text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
                            Sign in
                        </Link>
                    </p>

                    {/* Terms */}
                    <p className="mt-6 text-center text-xs text-slate-500">
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-slate-700 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-slate-700 hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
