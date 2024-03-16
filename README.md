# bootstrapautocomplete
Auto complete tool that styles the results in Bootstrap v4/v5.

## Requirements
## [Bootstrap] (https://getbootstrap.com/)

## HTML
```html
<div>
    <input id="autocomplete type="text" class="form-control" />
</div>
```

## Usage


```javascript
// Provide the element and the data call
let autoComplete = new BootstrapAutoComplete(document.getElementById('autocomplete'), {
    dataSource: () => { 
        return ['hello', 'goodbye', 'seeya', 'boom','super', 'doops', 'scoop'] 
    } 
});
```

```javascript
// Call with configs set
let autoComplete = new BootstrapAutoComplete(document.getElementById('autocomplete'), {
    serverProcessing: true,
    dataSource: () => { 
        return ['hello', 'goodbye', 'seeya', 'boom','super', 'doops', 'scoop'] 
    },
    minType: 2,
    maxDisplaySize: 2
});
```

| Config  | Default | Description |
| ------------- | ------------- | ------------- |
| serverProcessing  | false  | Calls the dataSource call every change event on the input |
| maxDisplaySize | 10  | Maximum size of matched items displayed |
| dataSource | REQUIRED | function(currentInputValue, maxSize) that preloads or calls each change event based on serverProcessing|
| minType| 1 | Amount of characters required to fire an autocomplete search |
