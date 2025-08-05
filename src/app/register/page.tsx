"use client";
import { AuthService } from "@/services";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Register() {
  const [error, setError] = useState<string>();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const fullname = formData.get("fullname");

    try {
      const signUpRes = await AuthService.Register(email, password, fullname);

      console.log(signUpRes);
      const res = await signIn("credentials", {
        email: signUpRes.data.email,
        password: formData.get("password"),
        redirect: false,
      });
      console.log(res);
      if (res?.ok) return router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      }
    }
  };

  return (
    <div className="col-start-3 col-end-11">
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
            className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
          />
          {error && <div className=" text-red-400 text-xs">{error}</div>}
          <button type="submit" className="px-6 py-2 bg-purple-700 rounded-lg">
            Register
          </button>
          <div className="text-xs">
            {"You already have an account, "}{" "}
            <a href="/login" className="hover:underline">
              login here
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
