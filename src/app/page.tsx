import Link from "next/link";

const PAGES = [
  {
    title: "0. Fan machine",
    href: "/fan",
  },
  {
    title: "1. Phone keypad machine",
    href: "/phone-keypad",
  },
];
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-start p-24">
      <h1 className="text-2xl font-bold">Machine List:</h1>
      {PAGES.map((page, index) => (
        <Link
          className="underline hover:opacity-40"
          key={index}
          href={page.href}
        >
          {page.title}
        </Link>
      ))}
    </main>
  );
}
