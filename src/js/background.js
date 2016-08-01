var DOMAIN_LIST = [
    'taobao.com',
    'tmall.com'
];
var SUB_DOMAIN_LIST = [
    'item',
    'detail'
];

var LINKS = {};

chrome.tabs.onUpdated.addListener(function (nTabId, oChangeInfo, oTab) {
    if(fCheckUrl(oTab.url)){
        fOnUrlMatch(oTab);
    }else{
        fOnUrlNotMatch(oTab);
    }
});

function fCheckUrl(sURL) {
    if(sURL){
        return fCheckDomain(fGetUrlHostName(sURL));
    }
    return false;
}

function fCheckDomain(sHostName){
    for(var cnt = 0, length = DOMAIN_LIST.length; cnt < length; cnt ++){
        var oRegExp = new RegExp(DOMAIN_LIST[cnt]);
        if(oRegExp.test(sHostName)){
            return true;
        }
    }
    return false;
}

function fIsShop(sURL){
    return /\/shop\/view_shop\.htm/.test(sURL);
}

function fIsGoodsDetail(sURL){
    return fCheckSubDomain(fGetUrlHostName(sURL)) && fCheckSearch(fGetUrlSearch(sURL));
}

function fCheckSubDomain(sHostName) {
    for(var cnt = 0, length = SUB_DOMAIN_LIST.length; cnt < length; cnt ++){
        var oRegExp = new RegExp(SUB_DOMAIN_LIST[cnt]);
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
    var sRawUrl = oTab.url;
    if(fIsShop(sRawUrl)){
        LINKS[oTab.id] = fFilterShopUrl(sRawUrl);
    }else if(fIsGoodsDetail(sRawUrl)){
        LINKS[oTab.id] = fFilterGoodsUrl(sRawUrl);
    }else{
        LINKS[oTab.id] = fFilterCommonUrl(sRawUrl);
    }
}

function fOnUrlNotMatch(oTab) {
    chrome.pageAction.hide(oTab.id);
}

function fGetUrlHostName(sURL){
    var oMatch = sURL.match(/.*:\/\/\/?([^\/]*)/);
    if(oMatch){
        return oMatch[1];
    }
    return '';
}

function fGetUrlSearch(sURL){
    return /\?/.test(sURL) ? sURL.split('?')[1] : '';
}

function fFilterShopUrl(sURL) {
    return sURL.split('/shop/')[0];
}

function fFilterGoodsUrl(sURL) {
    var aURLSections = sURL.split('?');
    var sLocation = aURLSections[0];
    var sSearch = aURLSections[1];
    var sIDParam = sSearch.match(/(id=\d+)/);
    return sLocation + '?' + sIDParam[1];
}

function fFilterCommonUrl(sRawURL) {
    sRawURL = sRawURL.replace(/[&\?]?spm=[\w\.\-]*/, '');
    sRawURL = sRawURL.replace(/[&\?]?t=\d*/, '');
    // 来源个人中心的店铺点击
    sRawURL = sRawURL.replace(/[&\?]?user_number_id=\d*/, '');
    return sRawURL;
}