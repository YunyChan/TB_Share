var isMatch = false;
var HOST_LIST = [
    'taobao.com',
    'tmall.com'
];

chrome.tabs.onUpdated.addListener(function (nTabId, oChangeInfo, oTab) {
    if(fCheckUrl(oTab.url)){
        fOnUrlMatch(oTab);
    }else{
        fOnUrlNotMatch(oTab);
    }
});

chrome.pageAction.onClicked.addListener(function(oTab){
    console.log(fFilterUrl(oTab.url));
    fCopyToClipboard(fFilterUrl(oTab.url));
});

function fCheckUrl(sURL) {
    if(sURL){
        var sHostName = '';
        var oMatch = sURL.match(/.*:\/\/\/?([^\/]*).*/);
        if(oMatch){
            sHostName = oMatch[1];
            for(var cnt = 0, length = HOST_LIST.length; cnt < length; cnt ++){
                var oRegExp = new RegExp(HOST_LIST[cnt]);
                if(oRegExp.test(sHostName)){
                    return true;
                }
            }
        }
    }
    return false;
}

function fOnUrlMatch(oTab) {
    chrome.pageAction.show(oTab.id);
}

function fOnUrlNotMatch(oTab) {
    chrome.pageAction.hide(oTab.id);
}

function fFilterUrl(sURL) {
    var aURLSections = sURL.split('?');
    var sLocation = aURLSections[0];
    var sSearch = aURLSections[1];
    var sIDParam = sSearch.match(/(id=\d+)/);
    return sLocation + '?' + sIDParam[1];
}

function fCopyToClipboard(sText) {
    var oTempTextArea = document.createElement("textarea");
    oTempTextArea.textContent = sText;
    document.body.appendChild(oTempTextArea);
    oTempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(oTempTextArea);
}