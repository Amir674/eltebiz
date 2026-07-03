"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCafe } from "@/lib/cafes";
import Footer from "@/components/Footer";

// Простая проверка российского номера: 10-11 цифр, начинается на 7/8/9
function isValidPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return true;
  }
  if (digits.length === 10 && digits.startsWith("9")) {
    return true;
  }
  return false;
}

type Errors = {
  name?: string;
  phone?: string;
  address?: string;
};

export default function CafePage() {
  const params = useParams();
  const cafe = getCafe(params.slug as string);

  const [cart, setCart] = useState<Record<number, { item: any; qty: number }>>({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [payment, setPayment] = useState("СБП");
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [sentTotal, setSentTotal] = useState(0);

  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

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

  const addToCart = (item: any) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: { item, qty: (prev[item.id]?.qty || 0) + 1 },
    }));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const qty = prev[id]?.qty || 0;
      if (qty <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { ...prev[id], qty: qty - 1 } };
    });
  };

  const cartItems = Object.values(cart);
  const totalPrice = cartItems.reduce((sum, { item, qty }) => sum + item.price * qty, 0);
  const totalCount = cartItems.reduce((sum, { qty }) => sum + qty, 0);

  function validate(): boolean {
    const next: Errors = {};

    if (name.trim().length < 2) {
      next.name = "Введите имя (минимум 2 символа)";
    }

    if (!isValidPhone(phone)) {
      next.phone = "Введите корректный номер, например +7 928 000-00-00";
    }

    if (address.trim().length < 5) {
      next.address = "Укажите адрес доставки";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const sendOrder = async () => {
    setSendError(null);

    if (!validate()) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: cafe.chatId,
          cafeName: cafe.name,
          name,
          phone,
          address,
          comment,
          payment,
          items: cartItems.map(({ item, qty }) => `${item.name} x${qty}`).join(", "),
          total: totalPrice,
        }),
      });

      if (!res.ok) {
        throw new Error(`Сервер ответил ошибкой: ${res.status}`);
      }

      setSentTotal(totalPrice);
      setOrderSent(true);
      setCart({});
      setShowCheckout(false);
      setShowMobileCart(false);
      setName("");
      setPhone("");
      setAddress("");
      setComment("");
      setErrors({});
    } catch (err) {
      setSendError("Не удалось отправить заказ. Проверьте интернет и попробуйте ещё раз, либо позвоните нам.");
    } finally {
      setSending(false);
    }
  };

  // Shared cart items list (used in both desktop sidebar and mobile drawer)
  const CartItemsList = () => (
    <>
      {cartItems.map(({ item, qty }) => (
        <div key={item.id} className="flex justify-between items-center border-b border-zinc-700 pb-2">
          <div className="flex-1">
            <p className="text-sm text-white">{item.name}</p>
            <p className="text-green-400 text-xs font-bold">{item.price * qty} ₽</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-zinc-600 hover:bg-zinc-500 text-white w-7 h-7 rounded-lg text-sm transition"
            >
              −
            </button>
            <span className="text-white text-sm w-4 text-center">{qty}</span>
            <button
              onClick={() => addToCart(item)}
              className="bg-green-500 hover:bg-green-400 text-white w-7 h-7 rounded-lg text-sm transition"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </>
  );

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

      {/* CONTENT: menu + desktop sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:grid lg:grid-cols-4 lg:gap-8">

        {/* MENU */}
        <div className="lg:col-span-3">
          {cafe.menu.map((category) => (
            <div key={category.id} className="mb-8">
              <h2 className="text-lg font-bold text-green-400 uppercase tracking-widest mb-3">
                {category.name}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 items-start">
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-800 rounded-2xl overflow-hidden hover:ring-2 hover:ring-green-400 transition"
                  >
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

        {/* DESKTOP CART SIDEBAR */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-zinc-800 rounded-2xl p-4 sticky top-20">
            <h2 className="text-lg font-bold text-white mb-4">Корзина</h2>
            {cartItems.length === 0 ? (
              <p className="text-zinc-400 text-sm">Корзина пуста</p>
            ) : (
              <>
                <div className="flex flex-col gap-3 mb-4">
                  <CartItemsList />
                </div>
                <div className="border-t border-zinc-700 pt-3 mb-4">
                  <div className="flex justify-between text-white font-bold">
                    <span>Итого</span>
                    <span>{totalPrice} ₽</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-green-500 hover:bg-green-400 text-white py-3 rounded-xl font-semibold transition"
                >
                  Оформить заказ
                </button>
              </>
            )}
          </div>
        </div>

      </div>

      {/* MOBILE CART BUTTON */}
      {totalCount > 0 && (
        <div className="lg:hidden fixed bottom-6 left-4 right-4 z-40">
          <button
            onClick={() => setShowMobileCart(true)}
            className="w-full bg-green-500 hover:bg-green-400 text-white py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-between px-6 transition"
          >
            <span>🛒 {totalCount} товара</span>
            <span>{totalPrice} ₽</span>
          </button>
        </div>
      )}

      {/* MOBILE CART DRAWER */}
      {showMobileCart && (
        <div className="lg:hidden fixed inset-0 bg-black/70 flex items-end justify-center z-50">
          <div className="bg-zinc-800 w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Корзина</h2>
              <button
                onClick={() => setShowMobileCart(false)}
                className="text-zinc-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-3 mb-4">
              <CartItemsList />
            </div>
            <div className="border-t border-zinc-700 pt-3 mb-4">
              <div className="flex justify-between text-white font-bold">
                <span>Итого</span>
                <span>{totalPrice} ₽</span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowMobileCart(false);
                setShowCheckout(true);
              }}
              className="w-full bg-green-500 hover:bg-green-400 text-white py-3 rounded-xl font-semibold transition"
            >
              Оформить заказ
            </button>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
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

            <input
              className={`w-full bg-zinc-700 text-white border p-3 rounded-xl mb-1 placeholder-zinc-400 ${
                errors.name ? "border-red-500" : "border-zinc-600"
              }`}
              placeholder="Имя"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            {errors.name && <p className="text-red-400 text-xs mb-2">{errors.name}</p>}

            <input
              className={`w-full bg-zinc-700 text-white border p-3 rounded-xl mb-1 placeholder-zinc-400 ${
                errors.phone ? "border-red-500" : "border-zinc-600"
              }`}
              placeholder="Телефон, например +7 928 000-00-00"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
            />
            {errors.phone && <p className="text-red-400 text-xs mb-2">{errors.phone}</p>}

            <input
              className={`w-full bg-zinc-700 text-white border p-3 rounded-xl mb-1 placeholder-zinc-400 ${
                errors.address ? "border-red-500" : "border-zinc-600"
              }`}
              placeholder="Адрес"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
              }}
            />
            {errors.address && <p className="text-red-400 text-xs mb-2">{errors.address}</p>}

            <textarea
              className="w-full bg-zinc-700 text-white border border-zinc-600 p-3 rounded-xl mb-2 placeholder-zinc-400"
              placeholder="Комментарий"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <select
              className="w-full bg-zinc-700 text-white border border-zinc-600 p-3 rounded-xl mb-4"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            >
              <option>СБП</option>
              <option>Наличка</option>
              <option>Перевод</option>
            </select>

            {sendError && (
              <div className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-xl px-3 py-2">
                {sendError}
              </div>
            )}

            <button
              onClick={sendOrder}
              disabled={sending}
              className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition"
            >
              {sending ? "Отправляем..." : "Отправить заказ"}
            </button>
          </div>
        </div>
      )}

      {/* ORDER SUCCESS MODAL */}
      {orderSent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-800 p-6 rounded-2xl w-full max-w-md text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-2">Заказ принят!</h2>

            {payment === "СБП" && (
              <>
                <p className="text-zinc-400 mb-4">Отсканируйте QR код для оплаты</p>
                <div className="bg-white p-4 rounded-xl mb-4 inline-block">
                  <img src="/sbp-qr.png" alt="QR СБП" className="w-48 h-48" />
                </div>
                <div className="bg-zinc-700 rounded-xl p-3 mb-4">
                  <p className="text-green-400 text-2xl font-bold">{sentTotal} ₽</p>
                </div>
              </>
            )}

            {payment === "Перевод" && (
              <>
                <p className="text-zinc-400 mb-4">Переведите на номер телефона</p>
                <div className="bg-zinc-700 rounded-xl p-4 mb-4">
                  <p className="text-zinc-400 text-sm mb-1">Номер телефона</p>
                  <p className="text-white text-xl font-bold">+7 928 659-01-40</p>
                </div>
                <div className="bg-zinc-700 rounded-xl p-3 mb-4">
                  <p className="text-zinc-400 text-sm mb-1">Сумма</p>
                  <p className="text-green-400 text-2xl font-bold">{sentTotal} ₽</p>
                </div>
              </>
            )}

            {payment === "Наличка" && (
              <p className="text-zinc-400 mb-6">Оплата наличными курьеру при доставке</p>
            )}

            <button
              onClick={() => setOrderSent(false)}
              className="w-full bg-green-500 hover:bg-green-400 text-white py-3 rounded-xl font-semibold transition"
            >
              Готово
            </button>
          </div>
        </div>
      )}

      <Footer />

    </main>
  );
}
