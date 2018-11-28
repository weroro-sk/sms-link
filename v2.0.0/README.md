# sms-link
*version: 2.0.0*

Finds and corrects all anchors with href SMS: protocol.

usage: 
```javascript
let sms_link = new SmsLink();

sms_link.fix();
```
---
notice:
* If you want to use your own device detection, call method { setSeparator(separator) } directly.
Internal device detection will be fully ignored.

example:
```javascript
let sms_link = new SmsLink();
sms_link.setSeparator('yourSeparatorHere'); // returns SmsLink instance

sms_link.fix();
```
---
Method fix() has callback function. Function returns true or false.
```javascript
let sms_link = new SmsLink();

sms_link.fix(status => {
        let infoText = 'The Document has not sms: links or your operating system is unsupported.';
        if (status) {
            infoText = 'The Document has sms: links and they were fixed.';
        }
        console.log(infoText);
});

// ECMA5

sms_link.fix(function(status) {
        var infoText = 'The Document has not sms: links or your operating system is unsupported.';
        if (status) {
            infoText = 'The Document has sms: links and they were fixed.';
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
        .fix(status => {
                let infoText = 'The Document has not sms: links or your operating system is unsupported.';
                if (status) {
                    infoText = 'The Document has sms: links and they were fixed.';
                }
                console.log(infoText);
        });

// ECMA5

sms_link.ignoreFacebookApp() // ignore facebook app webview
        .ignoreTablets() // ignore tablet devices
        .fix(function(status) {
            var infoText = 'The Document has not sms: links or your operating system is unsupported.';
            if (status) {
                infoText = 'The Document has sms: links and they were fixed.';
            }
            console.log(infoText);
        });
```
---
## API

Is Android device
```javascript
sms_link.isAndroid(); // returns 1 / 0

sms_link.isAndroid(true); // detects only mobile devices / tablets will be skipped
```
Is iOS device
```javascript
sms_link.isIOS(); // returns version number (dot format: for example 2.7) or 0

sms_link.isIOS(true); // // detects only mobile devices / iPads will be skipped
```
Is Facebook APP webview (internal web browser) 
```javascript
sms_link.isFacebookApp(); // returns true /false
```
If you'll use ignore methods before:
```javascript
sms_link.ignoreFacebookApp()
        .isAndroid();
```
Is iOS device
```javascript
sms_link.ignoreFacebookApp()
        .isIOS();
```
