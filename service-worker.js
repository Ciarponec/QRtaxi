self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {}

  const title = data.title || "QR Taksi";
  const body = data.body || "Yeni çağrı var";
  const url = data.url || "./taxi.html";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      data: { url },
      vibrate: [100, 50, 100],
      badge: undefined
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "./taxi.html";

  event.waitUntil((async () => {
    const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of allClients) {
      if (c.url.includes("taxi.html")) {
        await c.focus();
        return;
      }
    }
    await clients.openWindow(url);
  })());
});
