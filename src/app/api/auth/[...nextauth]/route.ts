import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/libs/mongodb';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';

// Extendemos el JWT para incluir el usuario
interface Token extends JWT {
	user?: {
		id: string;
		fullname: string;
		email: string;
	};
}

// Interface de usuario retornado por authorize
interface UserWithFullname {
	id: string;
	fullname: string;
	email: string;
}

// Callback session typing
interface SessionParams {
	session: Session;
	token: Token;
}

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				await connectDB();

				const userFound = await User.findOne({
					email: credentials!.email,
				}).select('+password');
				if (!userFound) throw new Error('Invalid credentials');

				const passwordMatch = await bcrypt.compare(
					credentials!.password,
					userFound.password,
				);
				if (!passwordMatch) throw new Error('Invalid credentials');

				return {
					id: userFound._id.toString(),
					email: userFound.email,
					fullname: userFound.fullname,
				} as UserWithFullname;
			},
		}),
	],
	callbacks: {
		// Guardamos el usuario en el JWT
		async jwt({ token, user }) {
			if (user) {
				const typedUser = user as UserWithFullname;
				token.user = {
					id: typedUser.id,
					fullname: typedUser.fullname,
					email: typedUser.email,
				};
			}
			return token;
		},

		// Agregamos id al session.user
		async session({ session, token }: { session: Session; token: Token }) {
			if (token.user) {
				session.user.id = token.user.id;
				session.user.name = token.user.fullname;
				session.user.email = token.user.email;
			}
			return session;
		},
	},
	pages: {
		signIn: '/login',
	},
} satisfies NextAuthOptions);

export { handler as GET, handler as POST };
