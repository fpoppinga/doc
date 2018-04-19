const version = "v3";

interface ExtendableEvent extends Event {
    waitUntil(fn: Promise<any>): void;
}

self.addEventListener("install", (event: Event) => {
    const installEvent = event as ExtendableEvent;

    console.info("Installed!");
    installEvent.waitUntil((async () => {
            const cache = await caches.open(version);
            await cache.addAll([
                "/bundle.js",
                "/index.html",
                "/bundle.css"
            ]);

            console.info("Cached!");
            (self as any).skipWaiting();
        })())

});

self.addEventListener("fetch", (event: Event) => {
    const fetchEvent = event as FetchEvent;

    console.info("fetch", fetchEvent);
    const request = fetchEvent.request.clone();
    fetchEvent.respondWith((async () => {
        if (request.method !== "GET") {
            return fetch(request);
        }

        const cache = await caches.open(version);

        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }

        const network = await fetch(request.clone());
        await cache.put(request.clone(), network.clone());
        return network;
    })());
});
