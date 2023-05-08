import Nav from './components/Nav';
import './globals.css';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import Hydrate from './components/Hydrate';
import { Roboto } from 'next/font/google';

// Defind main font
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin-ext']
})

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Fetch user
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={`mx-4 ${roboto.className}`}>
        <Hydrate>
          <Nav user={session?.user} expires={session?.expires as string} />
          {children}
        </Hydrate>
      </body>
    </html>
  );
}
