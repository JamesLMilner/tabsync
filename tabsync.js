


// We use localstorage but easily could use IndexDB!
if (localStorage.getItem("counter") !== undefined && localStorage.getItem("counter") !== "NaN") {
    var count = parseInt(localStorage.getItem("counter"));
    setCounter(count)
}

document.getElementById("increment").addEventListener("click", function(event){
    var count = parseInt(document.getElementById("counter").innerHTML) + 1;
    setCounter(count, false)
    stateToServiceWorker({property: "counter", state: count })
});

document.getElementById("decrement").addEventListener("click", function(event){
    var count = parseInt(document.getElementById("counter").innerHTML) - 1;
    setCounter(count, false)
    stateToServiceWorker({property: "counter", state: count })
})

if ('serviceWorker' in navigator) {
    //tabSyncReady = new Promise(); 
    navigator.serviceWorker.register('service-worker.js')
        .then(function() {
            return navigator.serviceWorker.ready;
        })
        .then(function(reg) {
            console.log('Service Worker is ready', reg);
            navigator.serviceWorker.addEventListener('message', function(event){
                var data;
                if (event.data) {
                    data = JSON.parse(event.data);
                    if (data.property === "counter" && data.state !== undefined) {
                        setCounter(data.state, true);
                    }
                }
            });
        }).catch(function(error) {
            console.log('Error : ', error);
        });
}

function setCounter(count, fromOtherTab) {
    document.getElementById("counter").innerHTML = parseInt(count);
    if (!fromOtherTab) {
        localStorage.setItem("counter", count);
    }
}

function stateToServiceWorker(data){
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller
            .postMessage(JSON.stringify(data));
    }
}
