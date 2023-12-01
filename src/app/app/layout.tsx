import type { Metadata } from "next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className=" flex">
      <nav className=" w-64 h-screen">this is nave</nav>
      <section>{children}</section>
    </main>
  );
}
