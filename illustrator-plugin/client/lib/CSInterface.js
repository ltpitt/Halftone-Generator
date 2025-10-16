/**************************************************************************************************
*
* ADOBE SYSTEMS INCORPORATED
* Copyright 2013 Adobe Systems Incorporated
* All Rights Reserved.
*
* NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
* terms of the Adobe license agreement accompanying it.  If you have received this file from a
* source other than Adobe, then your use, modification, or distribution of it requires the prior
* written permission of Adobe.
*
**************************************************************************************************/

/** CSInterface - v9.4.0 */

// This is a minimal version of CSInterface.js for the halftone plugin
// Full version available at: https://github.com/Adobe-CEP/CEP-Resources

function CSInterface() {}

CSInterface.prototype.evalScript = function(script, callback) {
    if(callback === null || callback === undefined) {
        callback = function(result){};
    }
    window.__adobe_cep__.evalScript(script, callback);
};

CSInterface.prototype.getHostEnvironment = function() {
    this.hostEnvironment = JSON.parse(window.__adobe_cep__.getHostEnvironment());
    return this.hostEnvironment;
};

CSInterface.prototype.getOSInformation = function() {
    var userAgent = navigator.userAgent;
    return userAgent;
};

CSInterface.prototype.addEventListener = function(type, listener, obj) {
    window.__adobe_cep__.addEventListener(type, listener, obj);
};

CSInterface.prototype.dispatchEvent = function(event) {
    if (typeof event.data == "object") {
        event.data = JSON.stringify(event.data);
    }
    window.__adobe_cep__.dispatchEvent(event);
};

CSInterface.THEME_COLOR_CHANGED_EVENT = "com.adobe.csxs.events.ThemeColorChanged";

function CSEvent(type, scope, appId, extensionId) {
    this.type = type;
    this.scope = scope;
    this.appId = appId;
    this.extensionId = extensionId;
}

CSEvent.prototype.data = "";

// CSXSEvent is used in ExtendScript for dispatching events
function CSXSEvent() {
    this.type = "";
    this.scope = "APPLICATION";
    this.appId = "";
    this.extensionId = "";
    this.data = "";
}

CSXSEvent.prototype.dispatch = function() {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.dispatchEvent(this);
    }
};
