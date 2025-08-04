import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

interface Token extends JWT {
  user?: {
    fullname: string;
    email: string;
  };
}

interface UserWithFullname {
  id: string;
  email: string;
  fullname: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const userFound = await User.findOne({ email: credentials!.email }).select("+password");
        if (!userFound) throw new Error("Invalid credentials");

        const passwordMatch = await bcrypt.compare(credentials!.password, userFound.password);
        if (!passwordMatch) throw new Error("Invalid credentials");

        return {
          id: userFound._id.toString(),
          email: userFound.email,
          fullname: userFound.fullname,
        };
        
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const typedToken = token as Token;

      if (user) {
        const typedUser = user as UserWithFullname;
        typedToken.user = {
          fullname: typedUser.fullname,
          email: typedUser.email,
        };
      }

      return typedToken;
    },
    async session({ session, token }) {
      const typedToken = token as Token;

      if (typedToken.user) {
        session.user = {
          ...session.user,
          name: typedToken.user.fullname,
          email: typedToken.user.email,
        };
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",    
  },
} satisfies NextAuthOptions);

export { handler as GET, handler as POST };
