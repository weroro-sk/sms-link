# sms-link
*version: 1.1.2*

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
        .linkFix((status) => {
                let infoText = 'The Document has not sms: links or your operating system is unsupported.';
                if (status) {
                    infoText = 'The Document has sms: links and they were fixed.';
                }
                console.log(infoText);
        });
```
---
## API
```javascript
sms_link.getDefaultSeparator(); // returns sms separator string
```
Is Android device
```javascript
sms_link.isAndroid(); // returns true / false
```
Is iOS device
```javascript
sms_link.isIOS(); // returns version number (dot format: for example 2.7) or false

sms_link.isIOS(true); // returns version number (INT format: for example 2) or false
```
Is Facebook APP webview (internal web browser) 
```javascript
sms_link.isFacebookApp(); // returns true /false
```
If you'll use ignore methods before:
```javascript
sms_link.ignoreTablets();
sms_link.isAndroid(); // returns true / false
// Tablet devices will be ignored and method returs false
```
Is iOS device
```javascript
sms_link.ignoreTablets();
sms_link.isIOS(); // returns version number (dot format: for example 2.7) or false
// Tablet devices (iPad) will be ignored and method returs false

sms_link.isIOS(true); // returns version number (INT format: for example 2) or false
// Tablet devices (iPad) will be ignored and method returs false
```
Get all elements with sms: href.
```javascript
sms_link.getSmsElements(); // returns NodeList
```