# sms-link
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
sms_link.setDefaultSeparator('yourSeparatorHere');

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