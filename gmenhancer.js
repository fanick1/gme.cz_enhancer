// ==UserScript==
// @name         GMEnhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.gme.cz/*
// @grant        GM_xmlhttpRequest
// @connect      self
// ==/UserScript==

/** GME - Skladem Brno  */
(function() {
    'use strict';

    // Your code here...
    console.log('TamperMonkey script GME Skladem Brno - running');


    var storeInfoNodes = Array.from(document.getElementsByClassName('store-info'));
   // debugger;
    try{
    for(let node of storeInfoNodes){
        var link = node.children[0].dataset.modalUrl;                                
        if(!link){
            console.debug('TamperMonkey script GME Skladem Brno - issue with link on node', node);

            break;
        }
       // GM_xmlhttpRequest({
        AJAX({
            headers:{
                accept: 'application/json'
            },
            method:'GET',
            url:link,
            timeout:30000,
            onload: function(a1, a2, a3, a4){
                var resultScratch = document.createElement('span');
                resultScratch.innerHTML = a1.response;                
                var stores = Array.from(resultScratch.getElementsByClassName('store'));
                
                var Brno = stores.find(function(element, index, array){
                    return element.getElementsByClassName('info')[0].textContent.indexOf('Brno') !== -1;
                });
       //         debugger;
                var z = document.createElement('span');
                z.classList.toggle('container');
                var avail = Brno.children[1].children[0];
                var ks = Brno.children[1].children[1];
                avail = avail ? avail.textContent : ' '; 
                ks = ks ? ks.textContent : ' ';
                z.textContent = avail + ks;
                node.appendChild(z);
            },
            onerror: function(a1, a2, a3, a4){
                console.error('Loading error', node, link, a1, a2, a3, a4);
            },
            ontimeout: function(a1, a2, a3, a4){
                console.error('Loading timeout', node, link, a1, a2, a3, a4);
            },
        });
    }
    }catch(e){
        console.error(e);
    }
})();

function AJAX(details){
    let {url, timeout, onload, onerror, ontimeout} = details;
    var xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.timeout = timeout;
    xhr.onload = onload.bind(null, xhr);
    xhr.onerror = onerror.bind(null, xhr);
    xhr.ontimeout = ontimeout.bind(null, xhr);
    xhr.send();
}
