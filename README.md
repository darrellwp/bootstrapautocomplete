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

//Pass in the element and optinal configurations
let autoComplete = new BootstrapAutoComplete(document.getElementById('autocomplete'), {
    data: data,
    filterType: 'startsWith',
    overflow: true,
    maxHeight: 350,
    maxDisplaySize: 25
});
```

```javascript
// Use of dataSource via fetch - Value/size are provided to help reduce results sent back before filtering
let autoComplete = new BootstrapAutoComplete(document.getElementById('autocomplete'), {
    dataSource: async (value, size) => { 
        let response = await fetch(`/getData?value=${value}&size=${size}`);

        if(!response.ok){
            return new Array();
        }

        // Return [] or null
        return await response.json();
    }
});
```


| Config  | Default | Type | Description |
| ------------- | ------------- |------------- | ------------- |
| maxDisplaySize | 10  | number | Maximum size of matched items displayed. |
| data | [] | array | Provides the preloaded data to the autocompleter. This will be overwritten if dataSource is provided. |
| dataSource | null | function | (currentInputValue, maxSize) => { return [] or null }. This will trigger on change events.|
| minimumTypeAhead | 1 | number | Amount of characters required to fire an autocomplete search. |
| overflow | false | boolean | true - the list will scroll, false - no scrolling. | 
| maxHeight| 200 | number | Maximum height of the menu in pixels when overflow is true. |
| zIndex| 10 | number | z-index value set on the auto complete list. |
| filterType| 'includes' | string | Filters based on string function. Must be 'includes', 'startsWith' or 'endsWith' |
| eventCallback| undefined | function | (value) => { event handler for keydown on enter. Input will be set to selected value first}|
| clickCallback| undefined | function | (value) => { event handler for clicking on a list item. Input will be set to selected value}|
