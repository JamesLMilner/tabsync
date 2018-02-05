// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    // The promise that skipWaiting() returns can be safely ignored.
    self.skipWaiting();
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  //console.log("Activate event")
});

self.addEventListener('fetch', event => {

});

self.addEventListener('message', function(event){
    var data = JSON.parse(event.data);
    //console.log("Message recieved in service worker:", data);
    self.syncTabState(data)
});


self.sendTabState = function(client, data){
    return new Promise(function(resolve, reject) {

        var channel = new MessageChannel();
        channel.port1.onmessage = function(event){
            if(event.data.error){
                reject(event.data.error);
            } else{
                resolve(event.data);
            }
        };

        console.log("Posting out data to client", client)
        client.postMessage(JSON.stringify(data), [channel.port2]);

    });
    
}

self.syncTabState = function(data){
    //console.log("syncTabState called");
    clients.matchAll().then(clients => {
        clients.forEach(client => {
            //console.log("client tab", client);
            if (client.visibilityState === "hidden") {
                self.sendTabState(client, data)
                    .then(m => console.log("SW Received Message: "+m))
                    .catch(e => console.log("Something went wrong", e));
            }
        })
    })
}