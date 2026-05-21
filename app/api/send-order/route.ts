export async function POST(req: Request) {
  const body = await req.json();

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = body.chatId;

  console.log("TOKEN:", botToken);
  console.log("CHAT ID:", chatId);
  console.log("BODY:", body);

  const message = `
🍔 Новый заказ (${body.name})

👤 Имя: ${body.name}
📞 Телефон: ${body.phone}
📍 Адрес: ${body.address}
💬 Комментарий: ${body.comment}
💳 Оплата: ${body.payment}

🛒 Заказ: ${body.items}
💰 Сумма: ${body.total} ₽
`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  console.log("URL:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  });

  const data = await res.json();
  console.log("TELEGRAM RESPONSE:", JSON.stringify(data));

  return Response.json({ success: data.ok });
}