import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-white/40">Solvus Demo</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
          Runtime dashboard visual demo.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
          This starter project is ready to upload to GitHub and import into Vercel.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/run"
            className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/15"
          >
            Open /run demo
          </Link>
        </div>
      </div>
    </main>
  );
}
