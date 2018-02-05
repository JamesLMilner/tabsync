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
    var data = JSON.parse(event.data);
    var clientId = event.source.id
    self.syncTabState(data, clientId);
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

        // console.log("Posting out data to client", client)
        client.postMessage(JSON.stringify(data), [channel.port2]);

    });
    
}

self.syncTabState = function(data, clientId){
    clients.matchAll().then(clients => {
        clients.forEach(client => {

            // No need to update the tab that 
            // sent the data
            if (client.id !== clientId) {
                self.sendTabState(client, data)
                    .then(function(message) { 
                        console.log("Message was recieved "+ message )
                    })
                    .catch(function(error) {
                            console.log("There was an error sending tab state", error)
                    });
            }
           
        })
    })
}