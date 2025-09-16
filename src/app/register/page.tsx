'use client';
import { AuthService } from '@/app/services';
import { AxiosError } from 'axios';
import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
	const [error, setError] = useState<string>();
	const [loading, setLoading] = useState<boolean>(false);

	// estados para contraseñas
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const passwordsMatch = password === confirmPassword && password.length > 0;

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!passwordsMatch) return;

		setLoading(true);
		setError(undefined);

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const fullname = formData.get('fullname') as string;

		try {
			const signUpRes = await AuthService.Register(email, password, fullname);
			await signIn('credentials', {
				email: signUpRes.email,
				password,
				redirect: true,
			});
			// if (res?.ok) return router.push('/');
		} catch (error) {
			if (error instanceof AxiosError) {
				setError(error.response?.data.message);
			} else {
				setError('Something went wrong.');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="col-start-3 col-end-11 lg:col-start-5 lg:col-end-9">
			<form
				className="my-4 bg-gray-800 px-8 py-6 rounded-lg border border-gray-600"
				onSubmit={handleSubmit}
			>
				<div className="flex flex-col items-center gap-4">
					<h1 className="text-3xl font-semibold">Sign up</h1>

					<input
						type="text"
						placeholder="Name"
						name="fullname"
						className="bg-gray-700 rounded-lg p-3 placeholder-white min-w-full"
						disabled={loading}
					/>
					<input
						type="email"
						placeholder="Email"
						name="email"
						className="bg-gray-700 rounded-lg p-3 placeholder-white min-w-full"
						disabled={loading}
					/>

					{/* Password */}
					<div className="relative w-full">
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder="Password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="bg-gray-700 rounded-lg p-3 placeholder-white min-w-full pr-10"
							disabled={loading}
						/>
						<button
							type="button"
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
							onClick={() => setShowPassword((prev) => !prev)}
							tabIndex={-1}
						>
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</button>
					</div>

					{/* Confirm Password */}
					<div className="relative w-full">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="bg-gray-700 rounded-lg p-3 placeholder-white min-w-full pr-10"
							disabled={loading}
						/>
						<button
							type="button"
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
							onClick={() => setShowConfirmPassword((prev) => !prev)}
							tabIndex={-1}
						>
							{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
						</button>
					</div>

					{/* Error de contraseñas */}
					{!passwordsMatch && confirmPassword.length > 0 && (
						<div className="text-red-400 text-xs">Passwords do not match</div>
					)}

					{error && <div className="text-red-400 text-xs">{error}</div>}

					<button
						type="submit"
						className="px-6 py-2 bg-purple-700 rounded-lg min-w-full flex items-center justify-center"
						disabled={loading || !passwordsMatch}
					>
						{loading ? (
							<span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
						) : (
							'Register'
						)}
					</button>

					<div className="text-xs">
						{'You already have an account, '}
						<a href="/login" className="hover:underline">
							login here
						</a>
					</div>
				</div>
			</form>
		</div>
	);
}
