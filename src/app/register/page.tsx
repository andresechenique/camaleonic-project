"use client"
import axios, { AxiosError } from "axios"
import { FormEvent, useState } from "react"

export default function Register() {

  const [error, setError] =useState<string>();

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try{

      const res = await axios.post('/api/auth/signup', {
        email: formData.get('email'),
        password: formData.get('password'),
        fullname: formData.get('fullname')
      })
      console.log(res);
    } catch (error) {
      if(error instanceof AxiosError) {
        setError(error.response?.data.message)
      }
    }
  }

  return <div>
    <form className="my-4 bg-gray-600 max-w-60 p-4" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2">
      {error && <div className="bg-red-600 p-4 text-white">{error}</div>}
      <h1>Sign up</h1>
      <input type="text" placeholder="Name" name="fullname" className="bg-gray-400 border-radius-6 rounded p-2 text-black"/>
      <input type="email" placeholder="email" name="email" className="bg-gray-400 border-radius-6 rounded p-2 text-black"/>
      <input type="password" placeholder="********" name="password" className="bg-gray-400 border-radius-6 rounded p-2 text-black"/>
      <button type="submit" className="px-4 py-2 bg-gray-700">Register</button>
      </div>
    </form>
  </div> 
}