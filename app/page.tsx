import Link from "next/link";
import { cafes } from "@/lib/cafes";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white">

      {/* NAVBAR */}
      <div className="bg-zinc-950 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-green-400 tracking-widest">ELTEBIZ</h1>
        <span className="text-zinc-400 text-sm">Доставка еды</span>
      </div>

      {/* HERO */}
      <div className="relative bg-zinc-800 overflow-hidden">
        <img
          src="/hero.jpg"
          alt="hero"
          className="w-full h-72 object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <h2 className="text-4xl font-extrabold text-white mb-2">
            <span className="text-green-400">eltebiz </span>Быстро доставит <span className="text-green-400">еду</span> по Малокарачаевскому району
          </h2>
          <p className="text-zinc-300 text-lg">Прямо к вашей двери</p>
        </div>
      </div>

      {/* CAFES */}
      <div className="px-4 py-8 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-zinc-300 mb-4 uppercase tracking-widest">
          Рестораны
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(cafes).map((cafe) => (
            <Link key={cafe.slug} href={`/cafe/${cafe.slug}`}>
              <div className="bg-zinc-800 rounded-2xl overflow-hidden hover:ring-2 hover:ring-green-400 transition">
                <div className="relative">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className="w-full h-36 object-cover opacity-80"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <h3 className="font-bold text-white text-lg">{cafe.name}</h3>
                    <p className="text-zinc-300 text-xs">{cafe.description}</p>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <span className="text-green-400 text-sm font-semibold">
                    Открыть меню →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />

    </main>
  );
}