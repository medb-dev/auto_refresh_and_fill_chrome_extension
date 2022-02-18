
const btn_refresh = document.querySelector('#refresh');
const time_interval = document.querySelector('#interval');

btn_refresh.addEventListener('click', ()=>{
    
        setInterval(()=>{
            chrome.tabs.getSelected(null, function(tab) {
                    var code = 'window.location.reload();';
                    chrome.tabs.executeScript(tab.id, {code: code});
                })
            chrome.tabs.executeScript({code: 'console.log(`hit`)'});
            },time_interval.value);
        //    chrome.extension.getBackgroundPage().console.log(`${i} hit`);
});

if (document.readyState === "complete") { 
    // init(); 
    // Fill the Forum
}