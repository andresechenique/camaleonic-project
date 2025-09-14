import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string; // agregamos el id
		} & DefaultSession['user'];
	}
}
