import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
	session: { strategy: "jwt" },
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) return null;
				await connectToDatabase();
				const user = await User.findOne({ email: credentials.email.toLowerCase() });
				if (!user) return null;
				const isValid = await user.comparePassword(credentials.password);
				if (!isValid) return null;
				return {
					id: user._id.toString(),
					email: user.email,
					name: user.name,
					role: user.role,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = (user as { id?: string }).id;
				token.role = (user as { role?: string }).role;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				(session.user as { id?: string; role?: string }).id = token.id as string;
				(session.user as { role?: string }).role = token.role as string;
			}
			return session;
		},
	},
});
