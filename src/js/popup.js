/**
 * Created by yunying on 2016/7/31.
 */
(function(){
    var LINKS = chrome.extension.getBackgroundPage().LINKS;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (oTabs) {
        var oTab = oTabs[0];
        var sLink =  LINKS[oTab.id];
        document.getElementById('link').innerText = sLink;

        var oQRCode = new QRCode(document.getElementById("QRCode"), {
            width : 200,
            height : 200
        });
        oQRCode.makeCode(sLink);

        fCopyToClipboard(sLink);
    });

    function fCopyToClipboard(sText) {
        var oTempTextArea = document.createElement("textarea");
        oTempTextArea.textContent = sText;
        document.body.appendChild(oTempTextArea);
        oTempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(oTempTextArea);
    }
})();