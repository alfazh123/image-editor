import Link from "next/link";


export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '20%' }} className="relative">
      <h1 className="absolute right-50 left-50 text-6xl md:text-9xl font-bold bg-gradient-to-t from-slate-300 to-slate-100 bg-clip-text text-transparent">
        404
      </h1>
      <p className="absolute z-10 right-50 left-50 top-30 font-bold bg-gradient-to-t from-slate-400 via-slate-300 to-slate-200 bg-clip-text text-transparent">Sorry, the page you are looking for does not exist.</p>
      <Link href="/" className="absolute right-50 left-50 top-40 font-bold bg-gradient-to-t from-slate-400 via-slate-300 to-slate-200 bg-clip-text text-transparent underline underline-offset-1">Go back to Home</Link>
    </div>
  );
}