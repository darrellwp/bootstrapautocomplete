/*!
* BootstrapAutoComplete v1.3.2
* https://github.com/darrellwp/bootstrapautocomplete/
* Copyright 2024 Darrell Percey - Licensed under MIT
* https://github.com/darrellwp/bootstrapautocomplete/blob/main/LICENSE
*/

const defaults = {
    maxDisplaySize: {
        value: 10,
        type: 'number'
    },
    data: {
        value: [],
        type: 'object'
    },
    dataSource: {
        value: undefined,
        type: 'function'
    },
    minimumTypeAhead: {
        value: 1,
        type: 'number'
    },
    overflow: {
        value: false,
        type: 'boolean'
    },
    maxHeight: {
        value: 200,
        type: 'number'
    },
    filterType: {
        value: 'includes',
        type: 'string'
    },
    zIndex: {
        value: 10,
        type: 'number' 
    }
}

class BootstrapAutoComplete{
    constructor(element, config){
        // Ensure element is present and is type INPUT
        if(!element || element.nodeName != 'INPUT') { throw new Error('No element or input type was found.')}

        this.config = {};
        this.element = element;
        this.filteredData = [];
        this.data = config?.data || [];
        this.menuIsShown = false;
        this.setConfig(config);
        this.menu = this.buildSelectMenu();

        this.addInputEvents();

        element.bootstrapAutoComplete = this;
    }

    /**
     * Parse the config object passed into the constructor - ensure the type is correct
     * @param {object} config 
     */
    setConfig(config){
        Object.keys(defaults).forEach((key) => {
            if(config && config.hasOwnProperty(key)){
                if(typeof config[key] == defaults[key].type){
                    if(key == 'filterType'){
                        if(['includes', 'startsWith', 'endsWith'].some((x) => x == config[key])){
                            this.config[key] = config[key];
                        } 
                        else{
                            console.error(`${key} must be type ${defaults[key].type} and be includes, startsWith, or endsWith. Used default values.`);
                        }
                    } 
                    else{
                        this.config[key] = config[key];
                    }
                }
                else{
                    console.error(`${key} must be type ${defaults[key].type}. Used default values.`)
                }
            } 

            //Fallback
            if(!this.config.hasOwnProperty(key)){
                this.config[key] = defaults[key].value;
            }
        });
    }

    /**
     * Builds the <ul> element and appends it to the parent container of the input.
     * @returns Node
     */
    buildSelectMenu(){
        let parentComputed = window.getComputedStyle(this.element.parentElement, null);
        let completeMenu = document.createElement('ul');
        completeMenu.className = 'list-group position-absolute fade';
        completeMenu.style.width = `calc(100% - ${parentComputed.paddingLeft} - ${parentComputed.paddingRight}`;
        completeMenu.style.top = "100%";
        completeMenu.style.zIndex = this.config.zIndex;

        if(this.config.overflow){
            completeMenu.classList.add('overflow-auto');
            completeMenu.style.maxHeight = `${this.config.maxHeight}px`;
        }

        this.element.parentElement.append(completeMenu);  
        
        return completeMenu;
    }

    /**
     * Adds event listeners
     */
    addInputEvents(){
        var _this = this;

        // Keydown event for enter, up, and down
        this.element.addEventListener('keydown', function(e){
            if(_this.menuIsShown){
                switch(e.key){
                    case 'Enter':
                        _this.selectEntry();
                        e.preventDefault();
                        break;
                    case 'ArrowUp':
                        _this.setActiveItem('previousElementSibling');
                        e.preventDefault();
                        break;
                    case 'ArrowDown':
                        _this.setActiveItem('nextElementSibling');
                        e.preventDefault();
                        break;
                }
            }
        });

        // Change event for pulling results
        this.element.addEventListener('input', async function(){
            if (_this.config.dataSource == undefined && _this.config.data.length == 0) { throw new Error('No dataSource or data was provided')}
            if(this.value.length < _this.config.minimumTypeAhead) return _this.hide();

            let cachedValue = this.value;

           if(_this.config.dataSource){
                _this.data = await _this.config.dataSource(this.value, _this.config.maxDisplaySize);

                if(_this.data != null && !Array.isArray(_this.data)){
                    console.error(`The data returned was type ${typeof _this.data}. Check that the dataSoruce is returning and array of strings. Data set to []`);
                    _this.data = [];   
                }

                if(this.value != cachedValue) return;
            }

            if(_this.data != null){
                // Ensure the data set is filtered down and list is reset
                _this.filteredData = _this.data.filter((entry) => entry.toLowerCase()[_this.config.filterType](this.value.toLowerCase()));
                _this.menu.innerHTML = '';

                // Toggle visibility of menu, add results
                if(_this.filteredData.length > 0){
                    let re = _this.buildRegex(this.value, _this.config.filterType);
                    _this.filteredData.slice(0,_this.config.maxDisplaySize).forEach((entry) => {
                        _this.menu.append(_this.generateMenuItem(entry, re));
                    })
                    _this.show();
                } 
                else{
                    _this.hide();
                }  
            }
        });

        // Hide when focus out of the box
        this.element.addEventListener('focusout', function(e){
            _this.hide();
        });
    }

    buildRegex(value, type){
        let searchValue = '';
        let modifier = 'i';

        switch(type){
            case 'startsWith':
                searchValue = `^${value}`
                break;
            case 'endsWith':
                searchValue = `${value}$`
                break
            default:
                searchValue = value;
                modifier += 'g';
        }

        return new RegExp(searchValue, modifier);
    }


    /**
     * Generates a list item using bootstrap's list-group-item
     * @param {string} entry Entry value that is used to create a list item
     * @param {RegExp} regExp Input value in //gi
     * @returns <li>
     */
    generateMenuItem(entry, regExp){
        let listItem = document.createElement('li');
        listItem.className = 'list-group-item list-group-item-action px-3 py-1';
        listItem.dataset['value'] = entry;
        listItem.innerHTML = entry.replace(regExp, `<strong>$&</strong>`);

        var _this = this;
        listItem.addEventListener('mousedown', function(e){
            e.stopPropagation();
            this.classList.add('active');
            _this.element.value = this.dataset['value'];
            _this.hide();
        })

        return listItem;
    }

    /**
     * Sets the next active item when using the key.ArrowUp or the key.ArrowDown
     * @param {string} nextProp String value - nextElementSibling || previousElementSibling
     * @returns null
     */
    setActiveItem(nextProp){
        if(this.menu.querySelectorAll('.list-group-item').length == 0) return;

        let activeItem = this.menu.querySelector('.active');
        let nextItem = this.menu.querySelector(`.list-group-item:${(nextProp == 'nextElementSibling' ? 'first-child' : 'last-child')}`);

        if(activeItem){
            activeItem.classList.remove('active');
            let nextActive = activeItem[nextProp];
            nextItem = nextActive || nextItem;
        }

        nextItem.classList.add('active');

        if(this.config.overflow){
            nextItem.scrollIntoView({block: 'nearest', inline:'nearest'});
        }
    }

    /**
     * Handler for clicking on a list item or hitting enter on an active item
     * @returns null
     */
    selectEntry(){
        let activeItem = this.menu.querySelector('.active');

        if(this.menu.querySelectorAll('.list-group-item').length == 0 || !activeItem) return;

        this.element.value = activeItem.dataset['value'];
        this.hide(); 
    }

    /**
     * Shows the list
     */
    show(){
        this.menuIsShown = true;
        this.menu.classList.add('show');
    }

    /**
     * Hides the list
     */
    hide(){
        this.menuIsShown = false;    
        this.menu.classList.remove('show');
        setTimeout(() => { this.menu.innerHTML = ''}, 100);
    }
}