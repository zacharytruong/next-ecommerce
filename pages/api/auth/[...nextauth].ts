import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/db';
import Stripe from 'stripe';


export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET as string,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  events: {
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: '2022-11-15'
      });

      if (user && user.name && user.email) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name
        });
        // Also update Prisma with Stripe customer id
        await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            stripeCustomerId: customer.id
          }
        });
      }
    }
  }
};

export default NextAuth(authOptions);
