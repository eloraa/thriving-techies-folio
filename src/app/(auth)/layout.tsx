import { Canvas } from './canvas';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas></Canvas>
      <div className="relative z-10 h-full w-full light text-black">{children}</div>
    </div>
  );
}
