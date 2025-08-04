import axios from "axios";

async function Register(email: string, password: string, fullname: string) {
    const response = await axios.post('/api/auth/signup', {
        email,
        password,
        fullname
      })
    return response.data;
}


export const AuthService = {
  Register,
};