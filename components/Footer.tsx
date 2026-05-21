export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 px-6 py-10 mt-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* О ПРОЕКТЕ */}
        <div>
          <h3 className="text-green-400 font-extrabold text-lg tracking-widest mb-3">ELTEBIZ</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Сервис доставки еды из лучших кафе вашего района. Быстро, удобно, вкусно.
          </p>
        </div>

        {/* КОНТАКТЫ */}
        <div>
          <h3 className="text-white font-semibold mb-3">Контакты</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="tel:+79000000000" className="hover:text-green-400 transition">
                📞 +7 (928) 398-20-13
              </a>
            </li>
            <li>
              <a href="tel:+79000000000" className="hover:text-green-400 transition">
                📞 +7 (928) 659-01-40
              </a>
            </li>
            <li>
              <a href="https://t.me/eltebiz" className="hover:text-green-400 transition">
                ✈️ Telegram: @eltebiz
              </a>
            </li>
            <li className="text-zinc-600 text-xs mt-4">
              © 2025 Eltebiz. Все права защищены.
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}