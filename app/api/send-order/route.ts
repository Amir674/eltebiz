export async function POST(req: Request) {
  const body = await req.json();

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const cafeChatId = body.chatId;
  const courierChatId = "-5205495132";

  const cafeMessage = `
🍔 Новый заказ!

👤 Имя: ${body.name}
📞 Телефон: ${body.phone}
📍 Адрес: ${body.address}
💬 Комментарий: ${body.comment}
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

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: cafeChatId, text: cafeMessage }),
  });

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: courierChatId, text: courierMessage }),
  });

  return Response.json({ success: true });
}