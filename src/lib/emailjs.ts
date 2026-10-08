// Настройки отправки формы через EmailJS.
// Эти идентификаторы публичные по устройству сервиса: их видно в коде любого сайта с такой формой.
// Адрес получателя здесь не хранится: он задан в шаблоне письма в панели EmailJS.
// Библиотека EmailJS не подключается, форма шлёт запрос напрямую.

export const emailjs = {
  endpoint: 'https://api.emailjs.com/api/v1.0/email/send',
  serviceId: 'service_riekj1p',
  templateId: 'template_h9wbzar',
  publicKey: '4Hbv9ioIUHnaYyAyr',
};
