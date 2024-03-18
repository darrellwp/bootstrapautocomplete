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
// Provide the element and some data
let data = ['hello', 'goodbye', 'seeya', 'boom','super', 'doops', 'scoop'] ;
let autoComplete = new BootstrapAutoComplete(document.getElementById('autocomplete'), {
    data: data 
});
```

```javascript
// Use of dataSoruce to call data on change events
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

| Config  | Default | Type | Description |
| ------------- | ------------- |------------- | ------------- |
| maxDisplaySize | 10  | number | Maximum size of matched items displayed. |
| data | [] | array | Provides the preloaded data to the autocompleter. This will be overwritten if dataSource is provided. |
| dataSource | null | function | (currentInputValue, maxSize) => { return [] of results }. Use for XHR request to fill list.|
| minType| 1 | number | Amount of characters required to fire an autocomplete search. |
| overflow | false | boolean | true - the list will scroll, false - no scrolling. | 
| maxHeight| 1 | number | maximum height of the menu in pixels when overflow is true. |