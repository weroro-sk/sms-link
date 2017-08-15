# sms-link
*version: 1.1.1*

Finds and corrects all anchors with href SMS: protocol.

usage: 
```javascript
let sms_link = new SmsLink();

sms_link.linkFix();
```
---
notice:
* If you want to use your own device detection, call method { setDefaultSeparator(separator) } directly.
Internal device detection will be fully ignored.

example:
```javascript
let sms_link = new SmsLink();
sms_link.setDefaultSeparator('yourSeparatorHere'); // returns boolean

sms_link.linkFix();
```
---
Method linkFix() has callback function. Function returns true or false.
```javascript
let sms_link = new SmsLink();

sms_link.linkFix((status) => {
        let infoText = 'The Document has not sms: links or your operating system is unsupported.';
        if (status) {
            infoText = 'The Document has sms: links and they was fixed.';
        }
        console.log(infoText);
});
```
#### Ignore devices
Application can ignore devices and apps.
```javascript
let sms_link = new SmsLink();

sms_link.ignoreFacebookApp() // ignore facebook app webview
        .ignoreTablets() // ignore tablet devices
        .linkFix((status) => {
                let infoText = 'The Document has not sms: links or your operating system is unsupported.';
                if (status) {
                    infoText = 'The Document has sms: links and they was fixed.';
                }
                console.log(infoText);
        });
```