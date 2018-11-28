/** MODEL */
var OperatingSystem = /** @class */ (function () {
    function OperatingSystem() {
    }
    return OperatingSystem;
}());
var IgnoreList = /** @class */ (function () {
    function IgnoreList() {
    }
    return IgnoreList;
}());
/** CLASS */
var SmsLink = /** @class */ (function () {
    function SmsLink(silentWarn) {
        this.silentWarn = silentWarn;
        /**
         * @description Because ios7 allegedly does't support sms: protocol
         */
        this.disabledIosVersion = 7;
        this.ignoreList = {
            tablet: false,
            facebook: false
        };
        this.separator = null;
    }
    /**
     * @description Finds and corrects all anchors with href sms: deep links.
     */
    SmsLink.prototype.fix = function (callback) {
        this.setSeparatorByOs();
        var status = this.replaceAnchorHrefSeparator();
        if (typeof callback === 'function') {
            callback(status, this);
        }
    };
    /**
     * @description
     */
    SmsLink.prototype.ignoreFacebookApp = function () {
        this.ignoreList.facebook = true;
        return this;
    };
    /**
     * @description
     */
    SmsLink.prototype.ignoreTablets = function () {
        this.ignoreList.tablet = true;
        return this;
    };
    /**
     * @notice  Call this method directly if you want to use your own mobile detection.
     *          Method { getOperatingSystem() } will be fully ignored.
     */
    SmsLink.prototype.setSeparator = function (separator) {
        this.separator = separator;
        return this;
    };
    /**
     * @description Returns true if detect Facebook APP web browser or false
     */
    SmsLink.prototype.isFacebookApp = function () {
        var ua = this.getUserAgent();
        return (!!ua.match(/fban/i) || !!ua.match(/fbav/i));
    };
    /**
     * @description Returns iOS version or 0
     */
    SmsLink.prototype.isIOS = function (mobileOnly) {
        var userAgent = this.getUserAgent();
        var version = ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(userAgent) || [0, ''])[1])
            .replace('undefined', '3_2').replace('_', '.').replace('_', '');
        if (!isNaN(parseInt(version, 10))) {
            if (!!mobileOnly) {
                if (!!userAgent.match(/iPad/i) === false) {
                    return parseFloat(version);
                }
                return 0;
            }
            if (this.ignoreList.tablet && !!userAgent.match(/iPad/i)) {
                return 0;
            }
            return parseFloat(version);
        }
        return 0;
    };
    /**
     * @description Returns 1 if detect Android OS or 0
     */
    SmsLink.prototype.isAndroid = function (mobileOnly) {
        var userAgent = this.getUserAgent();
        if (!!userAgent.match(/android/i)) {
            if (!!mobileOnly) {
                return !!userAgent.match(/mobile/i) ? 1 : 0;
            }
            if (this.ignoreList.tablet && !!userAgent.match(/mobile/i) === false) {
                return 0;
            }
            return 1;
        }
        return 0;
    };
    /**
     * @description
     */
    SmsLink.prototype.getSeparator = function () {
        return this.separator;
    };
    /**
     * @description Matches and returns all anchor tags with sms: deep links.
     */
    SmsLink.prototype.collectSmsAnchors = function () {
        return document.querySelectorAll('[href^="sms:"]');
    };
    /**
     * @description
     */
    SmsLink.prototype.getUserAgent = function () {
        var userAgent = navigator.userAgent || navigator.vendor;
        return !!userAgent ? userAgent : '';
    };
    /**
     * @notice  If you want to use your own device detection,
     *          call method { setSeparator(separator) } directly.
     *          Method { getOperatingSystem() } will be fully ignored.
     */
    SmsLink.prototype.getOperatingSystem = function (mobileOnly) {
        var operatingSystem = { os: null, version: null };
        if (this.ignoreList.facebook && this.isFacebookApp()) {
            return operatingSystem;
        }
        var iOS = this.isIOS(mobileOnly);
        if (!!iOS) {
            return { os: 'iOS', version: iOS };
        }
        var android = this.isAndroid(mobileOnly);
        if (!!android) {
            return { os: 'Android', version: android };
        }
        return operatingSystem;
    };
    /**
     * @description
     */
    SmsLink.prototype.replaceSeparator = function (hrefString) {
        if (!!this.getSeparator() === false || !!hrefString === false) {
            return hrefString;
        }
        return hrefString.replace(/&amp;/g, '&').replace(/.body=/, this.getSeparator() + 'body=');
    };
    /**
     * @description
     */
    SmsLink.prototype.replaceAnchorHrefSeparator = function () {
        if (!!this.getSeparator() === false) {
            return false;
        }
        var nodeList = this.collectSmsAnchors();
        if (!!nodeList === false || !nodeList.length) {
            return false;
        }
        for (var idx = 0; idx < nodeList.length; idx++) {
            var element = nodeList[idx];
            var hrefString = this.replaceSeparator(element.href);
            if (!!hrefString) {
                element.href = hrefString;
            }
        }
        return true;
    };
    /**
     * @description
     */
    SmsLink.prototype.getSeparatorByOs = function (operatingSystem) {
        if (operatingSystem.os !== null) {
            switch (operatingSystem.os.toLowerCase()) {
                case 'android':
                    return '?';
                case 'ios':
                    return this.disabledIosVersion < Math.floor(operatingSystem.version) ? '&' : ';';
            }
        }
        return '';
    };
    /**
     * @description If { setSeparator(separator) } method was called directly,
     *              then method { setSeparatorByOs() } will be ignored.
     */
    SmsLink.prototype.setSeparatorByOs = function () {
        if (!!this.getSeparator()) {
            if (!this.silentWarn) {
                console.warn('Default separator was defined manually. The separator is `%s`', this.getSeparator());
            }
            return;
        }
        var os = this.getOperatingSystem(this.ignoreList.tablet);
        var separator = this.getSeparatorByOs(os);
        if (!!separator) {
            this.setSeparator(separator);
        }
        else if (!this.silentWarn) {
            console.warn('Unsupported operating system');
        }
    };
    return SmsLink;
}());
