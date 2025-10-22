/**************************************************************************************************/**************************************************************************************************

**

* ADOBE SYSTEMS INCORPORATED* ADOBE SYSTEMS INCORPORATED

* Copyright 2013 Adobe Systems Incorporated* Copyright 2013 Adobe Systems Incorporated

* All Rights Reserved.* All Rights Reserved.

**

* NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the* NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the

* terms of the Adobe license agreement accompanying it.  If you have received this file from a* terms of the Adobe license agreement accompanying it.  If you have received this file from a

* source other than Adobe, then your use, modification, or distribution of it requires the prior* source other than Adobe, then your use, modification, or distribution of it requires the prior

* written permission of Adobe.* written permission of Adobe.

**

**************************************************************************************************/**************************************************************************************************/



/** CSInterface - v9.4.0 *//** CSInterface - v9.4.0 */



/**// This is a minimal version of CSInterface.js for the halftone plugin

 * Stores constants for the window types supported by the CSXS infrastructure.// Full version available at: https://github.com/Adobe-CEP/CEP-Resources

 */

function CSXSWindowType()function CSInterface() {}

{

}CSInterface.prototype.evalScript = function(script, callback) {

    if(callback === null || callback === undefined) {

/** Constant for the CSXS window type Panel. */        callback = function(result){};

CSXSWindowType._PANEL = "Panel";    }

    window.__adobe_cep__.evalScript(script, callback);

/** Constant for the CSXS window type Modeless. */};

CSXSWindowType._MODELESS = "Modeless";

CSInterface.prototype.getHostEnvironment = function() {

/** Constant for the CSXS window type ModalDialog. */    this.hostEnvironment = JSON.parse(window.__adobe_cep__.getHostEnvironment());

CSXSWindowType._MODAL_DIALOG = "ModalDialog";    return this.hostEnvironment;

};

/** EvalScript error message */

EvalScript_ErrMessage = "EvalScript error.";CSInterface.prototype.getOSInformation = function() {

    return window.__adobe_cep__.getOSInformation();

//------------------------------ CSInterface ----------------------------------};



/**CSInterface.prototype.getApplications = function() {

 * @class CSInterface    return JSON.parse(window.__adobe_cep__.getApplications());

 * This is the entry point to the CEP extensibility infrastructure.};

 * Instantiate this object and use it to:

 * <ul>CSInterface.prototype.addEventListener = function(type, listener, obj) {

 * <li>Access information about the host application in which an extension is running</li>    window.__adobe_cep__.addEventListener(type, listener, obj);

 * <li>Launch an extension</li>};

 * <li>Register interest in event notifications, and dispatch events</li>

 * </ul>CSInterface.prototype.dispatchEvent = function(event) {

 *    if (typeof event.data == "object") {

 * @return A new \c CSInterface object        event.data = JSON.stringify(event.data);

 */    }

function CSInterface()    window.__adobe_cep__.dispatchEvent(event);

{};

}

CSInterface.THEME_COLOR_CHANGED_EVENT = "com.adobe.csxs.events.ThemeColorChanged";

/**

 * User can add this event listener to handle native application theme color changes.function CSEvent(type, scope, appId, extensionId) {

 * Callback function gives extensions ability to fine-tune their theme color after the    this.type = type;

 * global theme color has been changed.    this.scope = scope;

 * The callback function should be like below:    this.appId = appId;

 *    this.extensionId = extensionId;

 * @example}

 * // event is a CSEvent object, but user can ignore it.

 * function OnAppThemeColorChanged(event)CSEvent.prototype.data = "";

 * {
 *    // Should get a latest HostEnvironment object from application.
 *    var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
 *    // Gets the style information such as color info from the skinInfo,
 *    // and redraw all UI controls of your extension according to the style info.
 * }
 */
CSInterface.THEME_COLOR_CHANGED_EVENT = "com.adobe.csxs.events.ThemeColorChanged";

/** The host environment data object. */
CSInterface.prototype.hostEnvironment = window.__adobe_cep__ ? JSON.parse(window.__adobe_cep__.getHostEnvironment()) : null;

/** Retrieves information about the host environment in which the
 *  extension is currently running.
 *
 *   @return A \c #HostEnvironment object.
 */
CSInterface.prototype.getHostEnvironment = function()
{
    this.hostEnvironment = JSON.parse(window.__adobe_cep__.getHostEnvironment());
    return this.hostEnvironment;
};

/**
 * Closes this extension.
 */
CSInterface.prototype.closeExtension = function()
{
    window.__adobe_cep__.closeExtension();
};

/**
 * Retrieves a path for which a constant is defined in the system.
 *
 * @param pathType The path-type constant defined in \c #SystemPath ,
 *
 * @return The platform-specific system path string.
 */
CSInterface.prototype.getSystemPath = function(pathType)
{
    var path = decodeURI(window.__adobe_cep__.getSystemPath(pathType));
    var OSVersion = this.getOSInformation();
    if (OSVersion.indexOf("Windows") >= 0)
    {
        path = path.replace("file:///", "");
    }
    else if (OSVersion.indexOf("Mac") >= 0)
    {
        path = path.replace("file://", "");
    }
    return path;
};

/**
 * Evaluates a JavaScript script, which can use the JavaScript DOM
 * of the host application.
 *
 * @param script    The JavaScript script.
 * @param callback  Optional. A callback function that receives the result of execution.
 *                  If execution fails, the callback function receives the error message \c EvalScript_ErrMessage.
 */
CSInterface.prototype.evalScript = function(script, callback)
{
    if(callback === null || callback === undefined)
    {
        callback = function(result){};
    }
    window.__adobe_cep__.evalScript(script, callback);
};

/**
 * Retrieves the unique identifier of the application.
 * in which the extension is currently running.
 *
 * @return The unique ID string.
 */
CSInterface.prototype.getApplicationID = function()
{
    var appId = this.hostEnvironment.appId;
    return appId;
};

/**
 * Retrieves host capability information for the application
 * in which the extension is currently running.
 *
 * @return A \c #HostCapabilities object.
 */
CSInterface.prototype.getHostCapabilities = function()
{
    var hostCapabilities = JSON.parse(window.__adobe_cep__.getHostCapabilities() );
    return hostCapabilities;
};

/**
 * Triggers a CEP event programmatically. You can use it to dispatch
 * an event of a predefined type, or of a type you have defined.
 *
 * @param event A \c CSEvent object.
 */
CSInterface.prototype.dispatchEvent = function(event)
{
    if (typeof event.data == "object")
    {
        event.data = JSON.stringify(event.data);
    }

    window.__adobe_cep__.dispatchEvent(event);
};

/**
 * Registers an interest in a CEP event of a particular type, and
 * assigns an event handler.
 * The event infrastructure notifies your extension when events of this type occur,
 * passing the event object to the registered handler function.
 *
 * @param type     The name of the event type of interest.
 * @param listener The JavaScript handler function or method.
 * @param obj      Optional, the object containing the handler method, if any.
 *                 Default is null.
 */
CSInterface.prototype.addEventListener = function(type, listener, obj)
{
    window.__adobe_cep__.addEventListener(type, listener, obj);
};

/**
 * Removes a registered event listener.
 *
 * @param type      The name of the event type of interest.
 * @param listener  The JavaScript handler function or method that was registered.
 * @param obj       Optional, the object containing the handler method, if any.
 *                  Default is null.
 */
CSInterface.prototype.removeEventListener = function(type, listener, obj)
{
    window.__adobe_cep__.removeEventListener(type, listener, obj);
};

/**
 * Loads and launches another extension, or activates the extension if it is already loaded.
 *
 * @param extensionId       The extension's unique identifier.
 * @param startupParams     Not currently used, pass "".
 *
 * @example
 * To launch the extension "help" with ID "HLP" from this extension, call:
 * <code>requestOpenExtension("HLP", ""); </code>
 */
CSInterface.prototype.requestOpenExtension = function(extensionId, params)
{
    window.__adobe_cep__.requestOpenExtension(extensionId, params);
};

/**
 * Retrieves the list of extensions currently loaded in the current host application.
 * The extension list is initialized once, and remains the same during the lifetime
 * of the CEP session.
 *
 * @param extensionIds Optional, an array of unique identifiers for extensions of interest.
 *                     If omitted, retrieves data for all extensions.
 *
 * @return Zero or more \c #Extension objects.
 */
CSInterface.prototype.getExtensions = function(extensionIds)
{
    var extensionIdsStr = JSON.stringify(extensionIds);
    var extensionsStr = window.__adobe_cep__.getExtensions(extensionIdsStr);

    var extensions = JSON.parse(extensionsStr);
    return extensions;
};

/**
 * Retrieves network-related preferences.
 *
 * @return A JavaScript object containing network preferences.
 */
CSInterface.prototype.getNetworkPreferences = function()
{
    var result = window.__adobe_cep__.getNetworkPreferences();
    var networkPre = JSON.parse(result);

    return networkPre;
};

/**
 * Retrieves version information for the current Operating System,
 * See http://www.useragentstring.com/pages/Chrome/ for Chrome \c navigator.userAgent values.
 *
 * @return A string containing the OS version, or "unknown Operation System".
 * If user customizes the User Agent by setting CEF command parameter "--user-agent", only
 * "Mac OS X" or "Windows" will be returned.
 */
CSInterface.prototype.getOSInformation = function()
{
    var userAgent = navigator.userAgent;

    if ((navigator.platform == "Win32") || (navigator.platform == "Windows"))
    {
        var winVersion = "Windows";
        var winBit = "";
        if (userAgent.indexOf("Windows") > -1)
        {
            if (userAgent.indexOf("Windows NT 5.0") > -1)
            {
                winVersion = "Windows 2000";
            }
            else if (userAgent.indexOf("Windows NT 5.1") > -1)
            {
                winVersion = "Windows XP";
            }
            else if (userAgent.indexOf("Windows NT 5.2") > -1)
            {
                winVersion = "Windows Server 2003";
            }
            else if (userAgent.indexOf("Windows NT 6.0") > -1)
            {
                winVersion = "Windows Vista";
            }
            else if (userAgent.indexOf("Windows NT 6.1") > -1)
            {
                winVersion = "Windows 7";
            }
            else if (userAgent.indexOf("Windows NT 6.2") > -1)
            {
                winVersion = "Windows 8";
            }
            else if (userAgent.indexOf("Windows NT 6.3") > -1)
            {
                winVersion = "Windows 8.1";
            }
            else if (userAgent.indexOf("Windows NT 10") > -1)
            {
                winVersion = "Windows 10";
            }

            if (userAgent.indexOf("WOW64") > -1 || userAgent.indexOf("Win64") > -1)
            {
                winBit = " 64-bit";
            }
            else
            {
                winBit = " 32-bit";
            }
        }

        return winVersion + winBit;
    }
    else if ((navigator.platform == "MacIntel") || (navigator.platform == "Macintosh"))
    {
        var result = "Mac OS X";

        if (userAgent.indexOf("Mac OS X") > -1)
        {
            result = userAgent.substring(userAgent.indexOf("Mac OS X"), userAgent.indexOf(")"));
            result = result.replace(/_/g, ".");
        }

        return result;
    }

    return "Unknown Operation System";
};

/**
 * Opens a page in the default system browser.
 *
 * Since 4.2.0
 *
 * @param url  The URL of the page/file to open, or the email address.
 * Must use HTTP/HTTPS/file/mailto protocol. For example:
 *   "http://www.adobe.com"
 *   "https://github.com"
 *   "file:///C:/log.txt"
 *   "mailto:test@adobe.com"
 *
 * @return One of these error codes:\n
 *      <ul>\n
 *          <li>NO_ERROR - 0</li>\n
 *          <li>ERR_UNKNOWN - 1</li>\n
 *          <li>ERR_INVALID_PARAMS - 2</li>\n
 *          <li>ERR_INVALID_URL - 201</li>\n
 *      </ul>\n
 */
CSInterface.prototype.openURLInDefaultBrowser = function(url)
{
    return cep.util.openURLInDefaultBrowser(url);
};

/**
 * Retrieves extension ID.
 *
 * Since 4.2.0
 *
 * @return extension ID.
 */
CSInterface.prototype.getExtensionID = function()
{
    return window.__adobe_cep__.getExtensionId();
};

/**
 * Retrieves the scale factor of screen.
 * On Windows platform, the value of scale factor might be different from operating system's scale factor,
 * since host application may use its self-defined scale factor.
 *
 * Since 4.2.0
 *
 * @return One of the following float number.
 *      <ul>\n
 *          <li> -1.0 when error occurs </li>\n
 *          <li> 1.0 means normal screen </li>\n
 *          <li> >1.0 means HiDPI screen </li>\n
 *      </ul>\n
 */
CSInterface.prototype.getScaleFactor = function()
{
    return window.__adobe_cep__.getScaleFactor();
};

/**
 * Set a handler to detect any changes of scale factor. This only works on Mac.
 *
 * Since 4.2.0
 *
 * @param handler   The function to be called when scale factor is changed.
 */
CSInterface.prototype.setScaleFactorChangedHandler = function(handler)
{
    window.__adobe_cep__.setScaleFactorChangedHandler(handler);
};

/**
 * Retrieves current API version.
 *
 * Since 4.2.0
 *
 * @return ApiVersion object.
 */
CSInterface.prototype.getCurrentApiVersion = function()
{
    var apiVersion = JSON.parse(window.__adobe_cep__.getCurrentApiVersion());
    return apiVersion;
};

// Additional Classes and Constants for completeness

/**
 * @class CSEvent
 * A standard JavaScript event, the base class for CEP events.
 *
 * @param type        The name of the event type.
 * @param scope       The scope of event, can be "GLOBAL" or "APPLICATION".
 * @param appId       The unique identifier of the application that generated the event.
 * @param extensionId The unique identifier of the extension that generated the event.
 *
 * @return A new \c CSEvent object
 */
function CSEvent(type, scope, appId, extensionId)
{
    this.type = type;
    this.scope = scope;
    this.appId = appId;
    this.extensionId = extensionId;
}

/** Event-specific data. */
CSEvent.prototype.data = "";

/**
 * @class SystemPath
 * Stores operating-system-specific location constants for use in the
 * \c #CSInterface.getSystemPath() method.
 *
 * @return A new \c SystemPath object.
 */
function SystemPath()
{
}

/** The path to user data. */
SystemPath.USER_DATA = "userData";

/** The path to common files for Adobe applications. */
SystemPath.COMMON_FILES = "commonFiles";

/** The path to the user's default document folder. */
SystemPath.MY_DOCUMENTS = "myDocuments";

/** @deprecated. Use \c #SystemPath.Extension. */
SystemPath.APPLICATION = "application";

/** The path to current extension. */
SystemPath.EXTENSION = "extension";

/** The path to hosting application's executable. */
SystemPath.HOST_APPLICATION = "hostApplication";