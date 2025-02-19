const statusTranslations: Record<string, string> = {
    pending: "Очікується",
    accepted: "Прийнято",
    money_sent: "Здійснюється оплата...",
    payed: "Оплачено",
    sent: "Відправлено",
    received: "Отримано",
  };
  
  // Функція для перекладу статусу
  export default function translateStatus(status: string): string {
    return statusTranslations[status] || status;
  }