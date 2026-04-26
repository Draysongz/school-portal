import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { ThemeProvider } from '@/providers/ThemeProvider';
import './globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const schoolId = headersList.get('x-school-id');

  let theme = { primary: '#000000', secondary: '#ffffff' };

  if (schoolId) {
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { primaryColor: true, secondaryColor: true }
    });
    if (school) {
      theme = {
        primary: school.primaryColor,
        secondary: school.secondaryColor
      };
    }
  }

  return (
    <html lang="en">
      <body>
        <ThemeProvider config={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
