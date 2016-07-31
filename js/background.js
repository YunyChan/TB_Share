var DOMAIN_LIST = [
    'taobao.com',
    'tmall.com'
];
var SUB_DOMAIN_LIST = [
    'item',
    'detail'
];

var LINK = '';
var LINKS = {};

chrome.tabs.onUpdated.addListener(function (nTabId, oChangeInfo, oTab) {
    if(fCheckUrl(oTab.url)){
        fOnUrlMatch(oTab);
    }else{
        fOnUrlNotMatch(oTab);
    }
});

// chrome.pageAction.onClicked.addListener(function(oTab){
//     fCopyToClipboard(fFilterUrl(oTab.url));
// });

function fCheckUrl(sURL) {
    if(sURL){
        var sHostName = '';
        var sSearch = /\?/.test(sURL) ? sURL.split('?')[1] : '';
        var oMatch = sURL.match(/.*:\/\/\/?([^\/]*)/);
        if(oMatch){
            sHostName = oMatch[1];
            if(fCheckDomain(sHostName) && fCheckSubDomain(sHostName) && fCheckSearch(sSearch)){
                return true
            }
        }
    }
    return false;
}

function fCheckDomain(sHostName){
    for(var cnt = 0, length = SUB_DOMAIN_LIST.length; cnt < length; cnt ++){
        var oRegExp = new RegExp(SUB_DOMAIN_LIST[cnt]);
        if(oRegExp.test(sHostName)){
            return true;
        }
    }
    return false;
}

function fCheckSubDomain(sHostName) {
    for(var cnt = 0, length = DOMAIN_LIST.length; cnt < length; cnt ++){
        var oRegExp = new RegExp(DOMAIN_LIST[cnt]);
        if(oRegExp.test(sHostName)){
            return true;
        }
    }
    return false;
}

function fCheckSearch(sSearch) {
    return /id=\d/.test(sSearch);
}

function fOnUrlMatch(oTab) {
    chrome.pageAction.show(oTab.id);
    var sFilteredLink = fFilterUrl(oTab.url);
    LINKS[oTab.id] = sFilteredLink;
    LINK = sFilteredLink;
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