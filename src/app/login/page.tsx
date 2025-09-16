'use client';
import { AxiosError } from 'axios';
import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
	const [error, setError] = useState<string>();
	const [loading, setLoading] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(undefined);
		const formData = new FormData(e.currentTarget);
		const email = formData.get('email');
		const password = formData.get('password');
		try {
			const res = await signIn('credentials', {
				email,
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
					<h1 className="text-3xl font-semibold">Signin</h1>
					<input
						type="email"
						placeholder="Email"
						name="email"
						className="bg-gray-700 rounded-lg p-3 placeholder-white min-w-full"
						disabled={loading}
					/>

					{/* Password Input con icono */}
					<div className="relative w-full">
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder="Password"
							name="password"
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

					{error && <div className="text-red-400 text-xs">{error}</div>}
					<button
						type="submit"
						className="px-6 py-2 bg-purple-700 rounded-lg min-w-full flex items-center justify-center"
						disabled={loading}
					>
						{loading ? (
							<span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
						) : (
							'Login'
						)}
					</button>
					<div className="text-xs">
						{"You don't have an account, "}
						<a href="/register" className="hover:underline">
							register here
						</a>
					</div>
				</div>
			</form>
		</div>
	);
}
