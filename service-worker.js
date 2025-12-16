self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch {}

  const title = data.title || "QR Taksi";
  const body  = data.body  || "Yeni çağrı var";
  const url   = data.url   || "./taxi.html";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      data: { url },
      vibrate: [100, 50, 100]
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "./taxi.html";

  event.waitUntil((async () => {
    const clientsArr = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of clientsArr) {
      if (c.url.includes("taxi.html")) return c.focus();
    }
    return clients.openWindow(url);
  })());
});
