const TELEGRAM_TIMEOUT_MS = 8000;

async function sendTelegramMessage(botToken: string, chatId: string, text: string) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
    // Node 18+/20+ поддерживает AbortSignal.timeout нативно
    signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Telegram API ответил ${res.status}: ${errText}`);
  }

  return res;
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json({ success: false, error: "Некорректный запрос" }, { status: 400 });
  }

  // Базовая проверка обязательных полей — на случай, если клиентская
  // валидация была обойдена или запрос пришёл не с сайта
  const required = ["chatId", "cafeName", "name", "phone", "address", "items", "total"];
  const missing = required.filter((key) => !body?.[key]);
  if (missing.length > 0) {
    return Response.json(
      { success: false, error: `Не заполнены поля: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN не задан в переменных окружения");
    return Response.json(
      { success: false, error: "Сервис временно недоступен" },
      { status: 500 }
    );
  }

  const cafeChatId = body.chatId;
  const courierChatId = "-5205495132";

  const cafeMessage = `
🍔 Новый заказ!

👤 Имя: ${body.name}
📞 Телефон: ${body.phone}
📍 Адрес: ${body.address}
💬 Комментарий: ${body.comment || "—"}
💳 Оплата: ${body.payment}

🛒 Заказ: ${body.items}
💰 Сумма: ${body.total} ₽
`;

  const courierMessage = `
🚗 Новый заказ на доставку!

🏠 Откуда: ${body.cafeName}
📍 Куда: ${body.address}
💰 Сумма: ${body.total} ₽
💳 Оплата: ${body.payment}

👤 Клиент: ${body.name}
📞 Телефон: ${body.phone}
`;

  // Сообщение в кафе — критично: если не ушло, заказ не выполнить
  try {
    await sendTelegramMessage(botToken, cafeChatId, cafeMessage);
  } catch (err) {
    console.error("Не удалось отправить заказ в чат кафе:", err);
    return Response.json(
      { success: false, error: "Не удалось передать заказ кафе. Попробуйте ещё раз." },
      { status: 502 }
    );
  }

  // Сообщение курьеру — важно, но если кафе уже получило заказ,
  // не будем валить весь запрос из-за этого; просто логируем
  try {
    await sendTelegramMessage(botToken, courierChatId, courierMessage);
  } catch (err) {
    console.error("Не удалось отправить заказ курьерам:", err);
  }

  return Response.json({ success: true });
}
