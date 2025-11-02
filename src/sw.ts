/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute((self as any).__WB_MANIFEST || []);

self.addEventListener('push', (event: Event) => {
  const pushEvent = event as PushEvent;
  const data = pushEvent.data ? (pushEvent.data.json() as Record<string, any>) : {};

  const title = data.title || 'Alerta de Criptomonedas';
  const options: NotificationOptions = {
    body: data.body || '¡El precio ha cambiado! Toca para ver.',
    icon: data.icon || '/favicon.svg',
    data: {
      url: data.url || '/',
    }
  };
  pushEvent.waitUntil((self as unknown as ServiceWorkerGlobalScope).registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event: Event) => {
  const notificationEvent = event as NotificationEvent;
  notificationEvent.notification.close();

  const targetUrl = (notificationEvent.notification?.data as any)?.url || '/';

  notificationEvent.waitUntil(
    (self as unknown as ServiceWorkerGlobalScope).clients
      .matchAll({ type: 'window' })
      .then((clientList) => {
        for (const client of clientList as readonly WindowClient[]) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        if ('openWindow' in (self as unknown as ServiceWorkerGlobalScope).clients) {
          return ((self as unknown as ServiceWorkerGlobalScope).clients as Clients).openWindow(targetUrl);
        }
        return null;
      })
  );
});