"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Login() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) {
      setError(res.error as string);
      setLoading(false);
      return;
    }
    if (res?.ok) return router.push("/");
    setLoading(false);
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
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="bg-gray-700 rounded-lg p-3 placeholder-white min-w-full"
            disabled={loading}
          />
          {error && <div className="text-red-400 text-xs">{error}</div>}
          <button
            type="submit"
            className="px-6 py-2 bg-purple-700 rounded-lg min-w-full flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              "Login"
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
