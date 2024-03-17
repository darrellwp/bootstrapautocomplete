# bootstrapautocomplete
Auto complete tool that styles the results in Bootstrap v4/v5.

## Requirements
Bootstrap (https://getbootstrap.com/)

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
    dataSource: async (value, size) => { 
        let response = await fetch(`/getData?value=${value}&size=${size}`);
        if(!response.ok){
            return new Array();
        }
        return await response.json();
    },
    minType: 2,
    maxDisplaySize: 2
});
```

| Config  | Default | Description |
| ------------- | ------------- | ------------- |
| serverProcessing  | false  | Determines whether the dataSource is called every input change or one time only |
| maxDisplaySize | 10  | Maximum size of matched items displayed |
| dataSource | REQUIRED | function(currentInputValue, maxSize) return [] of results|
| minType| 1 | Amount of characters required to fire an autocomplete search |
| overflow | false | true - the list will scroll, false - no scrolling | 
| maxHeight| 1 | maximum height of the menu when overflow is true |