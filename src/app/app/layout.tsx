import Link from "next/link";
import assets from "./defi-assets/assets";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="">
      <nav className="">
        <Link href="/app">Dashboard</Link>
        <span>DeFi Assets</span>
        {assets.map((x) => (
          <Link key={x.name} href={`/app/defi-assets/${x.name.toLowerCase()}`}>
            {x.name}
          </Link>
        ))}
      </nav>
      <section>{children}</section>
    </main>
  );
}
