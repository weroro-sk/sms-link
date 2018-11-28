/** MODEL */
class OperatingSystem {
    os: string;
    version: number;
}

class IgnoreList {
    tablet: boolean;
    facebook: boolean;
}

/** CLASS */
class SmsLink {

    /**
     * @description Because ios7 allegedly does't support sms: protocol
     */
    private disabledIosVersion = 7;

    private ignoreList: IgnoreList = {
        tablet: false,
        facebook: false
    };

    private separator: string = null;

    constructor(private silentWarn?: boolean) {
    }

    /**
     * @description Finds and corrects all anchors with href sms: deep links.
     */
    public fix(callback?): void {
        this.setSeparatorByOs();
        const status = this.replaceAnchorHrefSeparator();
        if (typeof callback === 'function') {
            callback(status, this);
        }
    }

    /**
     * @description
     */
    public ignoreFacebookApp(): SmsLink {
        this.ignoreList.facebook = true;
        return this;
    }

    /**
     * @description
     */
    public ignoreTablets(): SmsLink {
        this.ignoreList.tablet = true;
        return this;
    }

    /**
     * @notice  Call this method directly if you want to use your own mobile detection.
     *          Method { getOperatingSystem() } will be fully ignored.
     */
    public setSeparator(separator: string): SmsLink {
        this.separator = separator;
        return this;
    }

    /**
     * @description Returns true if detect Facebook APP web browser or false
     */
    public isFacebookApp(): boolean {
        const ua = this.getUserAgent();
        return (!!ua.match(/fban/i) || !!ua.match(/fbav/i));
    }

    /**
     * @description Returns iOS version or 0
     */
    public isIOS(mobileOnly?: boolean): number {
        const userAgent = this.getUserAgent();
        const version = ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(userAgent) || [0, ''])[1])
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
    }

    /**
     * @description Returns 1 if detect Android OS or 0
     */
    public isAndroid(mobileOnly?: boolean): number {
        const userAgent = this.getUserAgent();
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
    }

    /**
     * @description
     */
    private getSeparator(): string {
        return this.separator;
    }

    /**
     * @description Matches and returns all anchor tags with sms: deep links.
     */
    private collectSmsAnchors(): NodeList {
        return document.querySelectorAll('[href^="sms:"]');
    }

    /**
     * @description
     */
    private getUserAgent(): string {
        const userAgent = navigator.userAgent || navigator.vendor;
        return !!userAgent ? userAgent : '';
    }

    /**
     * @notice  If you want to use your own device detection,
     *          call method { setSeparator(separator) } directly.
     *          Method { getOperatingSystem() } will be fully ignored.
     */
    private getOperatingSystem(mobileOnly?: boolean): OperatingSystem {
        const operatingSystem: OperatingSystem = {os: null, version: null};
        if (this.ignoreList.facebook && this.isFacebookApp()) {
            return operatingSystem;
        }
        const iOS = this.isIOS(mobileOnly);
        if (!!iOS) {
            return {os: 'iOS', version: iOS};
        }
        const android = this.isAndroid(mobileOnly);
        if (!!android) {
            return {os: 'Android', version: android};
        }
        return operatingSystem;
    }

    /**
     * @description
     */
    private replaceSeparator(hrefString: string): string {
        if (!!this.getSeparator() === false || !!hrefString === false) {
            return hrefString;
        }
        return hrefString.replace(/&amp;/g, '&').replace(/.body=/, this.getSeparator() + 'body=');
    }

    /**
     * @description
     */
    private replaceAnchorHrefSeparator(): boolean {
        if (!!this.getSeparator() === false) {
            return false;
        }
        const nodeList: NodeList = this.collectSmsAnchors();
        if (!!nodeList === false || !nodeList.length) {
            return false;
        }
        for (let idx = 0; idx < nodeList.length; idx++) {
            const element: HTMLAnchorElement = nodeList[idx] as HTMLAnchorElement;
            const hrefString = this.replaceSeparator(element.href);
            if (!!hrefString) {
                element.href = hrefString;
            }
        }
        return true;
    }

    /**
     * @description
     */
    private getSeparatorByOs(operatingSystem: OperatingSystem): string {
        if (operatingSystem.os !== null) {
            switch (operatingSystem.os.toLowerCase()) {
                case 'android':
                    return '?';
                case 'ios':
                    return this.disabledIosVersion < Math.floor(operatingSystem.version) ? '&' : ';';
            }
        }
        return '';
    }

    /**
     * @description If { setSeparator(separator) } method was called directly,
     *              then method { setSeparatorByOs() } will be ignored.
     */
    private setSeparatorByOs(): void {
        if (!!this.getSeparator()) {
            if (!this.silentWarn) {
                console.warn('Default separator was defined manually. The separator is `%s`', this.getSeparator());
            }
            return;
        }
        const os: OperatingSystem = this.getOperatingSystem(this.ignoreList.tablet);
        const separator = this.getSeparatorByOs(os);
        if (!!separator) {
            this.setSeparator(separator);
        } else if (!this.silentWarn) {
            console.warn('Unsupported operating system');
        }
    }
}
