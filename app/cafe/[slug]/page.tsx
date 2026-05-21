"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCafe } from "@/lib/cafes";
import Footer from "@/components/Footer";

export default function CafePage() {
  const params = useParams();
  const cafe = getCafe(params.slug as string);

  const [cart, setCart] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [payment, setPayment] = useState("СБП");

  const [showMobileCart, setShowMobileCart] = useState(false);

  if (!cafe) {
    return (
      <main className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-zinc-400 mb-4">Кафе не найдено</p>
          <Link href="/" className="bg-green-500 text-white px-4 py-2 rounded-xl">
            На главную
          </Link>
        </div>
      </main>
    );
  }

  const addToCart = (item: any) => setCart([...cart, item]);
  const removeFromCart = (index: number) => setCart(cart.filter((_, i) => i !== index));
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const sendOrder = async () => {
    try {
      await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: cafe.chatId, // ← добавь это
          name,
          phone,
          address,
          comment,
          payment,
          items: cart.map((i) => i.name).join(", "),
          total: totalPrice,
        }),
      });

      alert("Заказ отправлен!");
      setCart([]);
      setShowCheckout(false);
    } catch (err) {
      alert("Ошибка отправки");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-white">

      {/* NAVBAR */}
      <div className="bg-zinc-950 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="text-green-400 font-extrabold tracking-widest text-xl">
          ELTEBIZ
        </Link>
        <span className="text-zinc-400 text-sm">{cafe.name}</span>
      </div>

      {/* HERO */}
      <div className="relative">
        <img
          src={cafe.image}
          alt={cafe.name}
          className="w-full h-48 object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-4 bg-gradient-to-t from-zinc-900 to-transparent">
          <h1 className="text-3xl font-extrabold text-white">{cafe.name}</h1>
          <p className="text-zinc-400 text-sm">{cafe.description}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 px-4 py-6 max-w-7xl mx-auto">

        {/* MENU */}
        <div className="lg:col-span-3">
          {cafe.menu.map((category) => (
            <div key={category.id} className="mb-8">
              <h2 className="text-lg font-bold text-green-400 uppercase tracking-widest mb-3">
                {category.name}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 items-start">
                {category.items.map((item) => (
                  <div key={item.id} className="bg-zinc-800 rounded-2xl overflow-hidden hover:ring-2 hover:ring-green-400 transition">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-cover opacity-90"
                    />
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                      <p className="text-green-400 text-sm font-bold mt-1">{item.price} ₽</p>
                      <button
                        onClick={() => addToCart(item)}
                        className="mt-2 w-full bg-green-500 hover:bg-green-400 text-white py-1.5 rounded-xl text-sm font-semibold transition"
                      >
                        Добавить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CART — только на десктопе */}
        <div className="hidden lg:block bg-zinc-800 p-4 rounded-2xl h-fit sticky top-20 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-4">🛒 Корзина</h2>
          {cart.length === 0 ? (
            <p className="text-zinc-500 text-sm">Корзина пустая</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-zinc-700 pb-2">
                  <div>
                    <p className="text-sm text-white">{item.name}</p>
                    <p className="text-green-400 text-xs font-bold">{item.price} ₽</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(i)}
                    className="bg-red-500 hover:bg-red-400 text-white w-7 h-7 rounded-lg text-xs transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="flex justify-between font-bold text-white pt-1">
                <span>Итого:</span>
                <span className="text-green-400">{totalPrice} ₽</span>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-green-500 hover:bg-green-400 text-white py-3 rounded-xl font-semibold transition"
              >
                Оформить заказ
              </button>
            </div>
          )}
        </div>
        
        {/* ПЛАВАЮЩАЯ КНОПКА — только на телефоне */}
        {cart.length > 0 && (
          <div className="lg:hidden fixed bottom-6 left-4 right-4 z-40">
            <button
              onClick={() => setShowMobileCart(true)}
              className="w-full bg-green-500 hover:bg-green-400 text-white py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-between px-6 transition"
            >
              <span>🛒 {cart.length} товара</span>
              <span>{totalPrice} ₽</span>
            </button>
          </div>
        )}

        {/* МОБИЛЬНАЯ КОРЗИНА */}
        {showMobileCart && (
          <div className="lg:hidden fixed inset-0 bg-black/70 z-50 flex items-end">
            <div className="bg-zinc-800 w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">🛒 Корзина</h2>
                <button
                  onClick={() => setShowMobileCart(false)}
                  className="text-zinc-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-zinc-700 pb-2">
                    <div>
                      <p className="text-sm text-white">{item.name}</p>
                      <p className="text-green-400 text-xs font-bold">{item.price} ₽</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(i)}
                      className="bg-red-500 hover:bg-red-400 text-white w-7 h-7 rounded-lg text-xs transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-white pt-1">
                  <span>Итого:</span>
                  <span className="text-green-400">{totalPrice} ₽</span>
                </div>
                <button
                  onClick={() => { setShowMobileCart(false); setShowCheckout(true); }}
                  className="w-full bg-green-500 hover:bg-green-400 text-white py-3 rounded-xl font-semibold transition"
                >
                  Оформить заказ
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CHECKOUT */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-800 p-6 rounded-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white text-2xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Оформление</h2>
            <input className="w-full bg-zinc-700 text-white border border-zinc-600 p-3 rounded-xl mb-2 placeholder-zinc-400" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="w-full bg-zinc-700 text-white border border-zinc-600 p-3 rounded-xl mb-2 placeholder-zinc-400" placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className="w-full bg-zinc-700 text-white border border-zinc-600 p-3 rounded-xl mb-2 placeholder-zinc-400" placeholder="Адрес" value={address} onChange={(e) => setAddress(e.target.value)} />
            <textarea className="w-full bg-zinc-700 text-white border border-zinc-600 p-3 rounded-xl mb-2 placeholder-zinc-400" placeholder="Комментарий" value={comment} onChange={(e) => setComment(e.target.value)} />
            <select className="w-full bg-zinc-700 text-white border border-zinc-600 p-3 rounded-xl mb-4" value={payment} onChange={(e) => setPayment(e.target.value)}>
              <option>СБП</option>
              <option>Наличка</option>
              <option>Перевод</option>
            </select>
            <button onClick={sendOrder} className="w-full bg-green-500 hover:bg-green-400 text-white py-3 rounded-xl font-semibold transition">
              Отправить заказ
            </button>
          </div>
        </div>
      )}
      
      <Footer />

    </main>
  );
}