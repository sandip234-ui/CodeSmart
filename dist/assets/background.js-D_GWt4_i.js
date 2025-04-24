chrome.runtime.onMessage.addListener((e,n,o)=>{e.action==="openPopup"&&chrome.action.openPopup()});
