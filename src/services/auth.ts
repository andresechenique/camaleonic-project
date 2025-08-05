import axios from "axios";

async function Register(email: FormDataEntryValue | null, password: FormDataEntryValue | null, fullname: FormDataEntryValue | null) {
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