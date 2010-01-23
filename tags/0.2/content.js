chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
            if (request.idekey){
                idekey = request.idekey;
            }

            if(request.cmd == "status"){
                result = xdebugCheckStatus();
            }else if(request.cmd == "toggle"){
                result = xdebugToggle();
            }
            sendResponse({result: result});
});

function xdebugCheckStatus() {
    var isEnabled = (xdebugGetCookie('XDEBUG_SESSION')==idekey);
    return isEnabled;
}

function xdebugToggle(){
    var isEnabled = xdebugCheckStatus();
    xdebugSetCookie('XDEBUG_SESSION',isEnabled?null:idekey,isEnabled?-60:60);
    return xdebugCheckStatus();
}

function xdebugSetCookie(cookieName, cookieVal,minutes) {
    var exp=new Date();
    exp.setTime(exp.getTime()+(minutes*60*1000));
    document.cookie=cookieName+"="+cookieVal+"; expires="+exp.toGMTString()+"; path=/";
}

function xdebugGetCookie(name) {
    var prefix = name + "=";
    var cookieStartIndex = document.cookie.indexOf(prefix);
    if (cookieStartIndex == -1)
            return null;
    var cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length);
    if (cookieEndIndex == -1)
            cookieEndIndex = document.cookie.length;
    return unescape(document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex));
}