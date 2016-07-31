/**
 * Created by yunying on 2016/7/31.
 */
(function(){
    var sLink = chrome.extension.getBackgroundPage().LINK;
    
    document.getElementById('link').innerText = sLink;

    var oQRCode = new QRCode(document.getElementById("QRCode"), {
        width : 200,
        height : 200
    });
    oQRCode.makeCode(sLink);

    fCopyToClipboard(sLink);

    function fCopyToClipboard(sText) {
        var oTempTextArea = document.createElement("textarea");
        oTempTextArea.textContent = sText;
        document.body.appendChild(oTempTextArea);
        oTempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(oTempTextArea);
    }
    
})();