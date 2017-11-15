// ==UserScript==
// @name         GMEnhancer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  GMEnhancer
// @author       fanick1@users.noreply.github.com
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
    var godStruct = {ids:[]};
    godStruct = storeInfoNodes.reduce( (obj,node) =>{ var id = node.children[0].dataset.modalUrl.split('?id_product=')[1]; obj[id]={id:id, node: node}; obj.ids.push(id); return obj;}, godStruct);

    try{
       var link = "https://gme.emfire.cz/products?ids[]=" + godStruct.ids.join('&ids[]=');
        AJAX({
            headers:{
                accept: 'application/json'
            },
            method:'GET',
            url:link,
            timeout:30000,
            onload: function(a1, a2, a3, a4){

                var responseArray = JSON.parse(a1.response);
                responseArray.forEach( (product) => {
                    var z = document.createElement('span');
                    z.classList.toggle('container');
                    // TODO Add picker for selecting the store
                    var Brno = product.StoreAvailability.find( (store) => store.Store.Name == "MO prodejna Brno" ); 
                    var avail = Brno.Available;
                    var ks = Brno.Amount;
                    avail = avail ? 'Skladem ' + ks + ' ks': ' Není ';
                    z.textContent = avail;
                    var node = godStruct[product.Id].node;
                    node.appendChild(z);
                });
            },
            onerror: function(a1, a2, a3, a4){
                console.error('Loading error', node, link, a1, a2, a3, a4);
            },
            ontimeout: function(a1, a2, a3, a4){
                console.error('Loading timeout', node, link, a1, a2, a3, a4);
            },
        });
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
