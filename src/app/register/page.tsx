"use client";
import { AuthService } from "@/services";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Register() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const fullname = formData.get("fullname");

    try {
      const signUpRes = await AuthService.Register(email, password, fullname);
      const res = await signIn("credentials", {
        email: signUpRes.email,
        password,
        redirect: false,
      });

      if (res?.ok) return router.push("/");
      setError("Authentication failed.");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      } else {
        setError("Something went wrong.");
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
              "Register"
            )}
          </button>
          <div className="text-xs">
            {"You already have an account, "}
            <a href="/login" className="hover:underline">
              login here
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
