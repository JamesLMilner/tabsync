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
    //console.log("Message recieved in service worker:", event);
    var data = event.data;
    var clientId = event.source.id
    self.syncTabState(data, clientId);
});


self.sendTabState = function(client, data){
    client.postMessage(data);
}

self.syncTabState = function(data, clientId){
    clients.matchAll().then(clients => {
        clients.forEach(client => {

            // No need to update the tab that 
            // sent the data
            if (client.id !== clientId) {
                self.sendTabState(client, data)
            }
           
        })
    })
}