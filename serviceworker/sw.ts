const version = "v4";

declare interface ExtendableEvent extends Event {
    waitUntil(fn: Promise<any>): void;
}

self.addEventListener("install", (event: Event) => {
    const installEvent = event as ExtendableEvent;
    installEvent.waitUntil(preCache());
});

self.addEventListener("fetch", (event: Event) => {
    const fetchEvent = event as FetchEvent;
    const request = fetchEvent.request.clone();

    fetchEvent.respondWith((async () => {
        if (request.method !== "GET") {
            return proxy(request);
        }

        const cached = await fromCache(request);
        if (cached) {
            return cached;
        }

        return fetchAndUpdate(request.clone());
    })());
});

async function preCache(): Promise<void> {
    const cache = await caches.open(version);
    return cache.addAll([
        "/bundle.js",
        "/index.html",
        "/bundle.css"
    ]);
}

async function fromCache(request: Request): Promise<Response | undefined> {
    const cache = await caches.open(version);
    return cache.match(request);
}

async function fetchAndUpdate(request: Request): Promise<Response> {
    const fromNetwork = await fetch(request);

    if (fromNetwork.ok) {
        const cache = await caches.open(version);
        await cache.put(request.clone(), fromNetwork.clone());
    }

    return fromNetwork;
}

let queue: Request[] = [];
async function proxy(request: Request): Promise<Response> {
    if (navigator.onLine) {
        if (queue.length > 0) {
            for (const entry of queue) {
                await fetch(entry);
            }

            queue = [];
        }

        return fetch(request);
    }

    const url = new URL(request.url);

    if (request.method === "PUT" && url.pathname === "/event") {
        console.info("queueing!");
        queue.push(request.clone());
        return new Response(null, {status: 204})
    }

    return fetch(request);
}
