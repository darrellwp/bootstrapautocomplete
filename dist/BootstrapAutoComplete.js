/*!
* BootstrapAutoComplete v1.0.0
* https://github.com/darrellwp/bootstrapautocomplete/
* Copyright 2024 Darrell Percey - Licensed under MIT
* https://github.com/darrellwp/bootstrapautocomplete/blob/main/LICENSE
*/

const defaults = {
    serverProcessing: {
        value: false,
        type: 'boolean',
    },
    maxDisplaySize: {
        value: 10,
        type: 'number'
    },
    dataSource: {
        value: undefined,
        type: 'function'
    },
    minType: {
        value: 1,
        type: 'number'
    }
}

class BootstrapAutoComplete{
    constructor(element, config){
        // Ensure element is present and is type INPUT
        if(!element || element.nodeName != 'INPUT') { throw new Error('No element or input type was found.')}

        this.config = {};
        this.element = element;
        this.data = [];
        this.filteredData = [];
        this.menu = this.buildSelectMenu();
        this.menuIsShown = false;
        this.setConfig(config);

        // Ensure dataSource is provided
        if (this.config.dataSource == undefined) { throw new Error('No dataSource was provided')}

        // Preload data here if serverProcessing is off
        if(!this.config.serverProcessing){
            this.data = this.config.dataSource().map((entry) => entry.toString());
        }

        this.addInputEvents();

        element.bootstrapAutoComplete = this;
    }

    setConfig(config){
        Object.keys(defaults).forEach((key) => {
            if(config && config.hasOwnProperty(key)){
                if(typeof config[key] == defaults[key].type){
                    this.config[key] = config[key];
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
        completeMenu.className = 'list-group position-absolute top-100 fade';
        completeMenu.style.width = `calc(100% - ${parentComputed.paddingLeft} - ${parentComputed.paddingRight}`;

        this.element.parentElement.append(completeMenu);  
        
        return completeMenu;
    }

    addInputEvents(){
        var _this = this;

        this.element.addEventListener('keydown', function(e){
            if(_this.menuIsShown){
                switch(e.key){
                    case 'Enter':
                        _this.selectEntry();
                        e.preventDefault();
                        break;
                    case 'ArrowUp':
                        _this.setActivePrevious();
                        e.preventDefault();
                        break;
                    case 'ArrowDown':
                        _this.setActiveNext();
                        e.preventDefault();
                        break;
                }
            }
        });

        // Change event for pulling results
        this.element.addEventListener('input', async function(){
            if(this.value.length >= _this.config.minType){
                if(_this.config.serverProcessing){
                    _this.data = await _this.config.dataSource(this.value, _this.config.maxDisplaySize);
                }

                _this.filteredData = _this.data.filter((entry) => entry.includes(this.value));

                _this.menu.innerHTML = '';
                // Toggle visibility of menu, add results
                if(_this.filteredData.length > 0){
                    _this.filteredData.slice(0,_this.config.maxDisplaySize).forEach((entry) => {
                        _this.menu.append(_this.generateMenuItem(entry, this.value));
                    })
                    _this.menu.append()

                    _this.show();
                } 
                else{
                    _this.hide();
                }
            }
            else{
                _this.hide();
            }
        });

        // Hide when focus out of the box
        this.element.addEventListener('focusout', function(e){
            _this.hide();
        });

    }

    generateMenuItem(entry, filterValue){
        let listItem = document.createElement('li');
        listItem.className = 'list-group-item list-group-item-action px-3 py-1';
        listItem.dataset['value'] = entry;
        listItem.innerHTML = entry.replace(filterValue, `<strong>${filterValue}</strong>`);

        var _this = this;
        listItem.addEventListener('mousedown', function(e){
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('active');
            _this.element.value = this.dataset['value'];
            _this.hide();
        })

        return listItem;
    }

    setActiveNext(){
        if(this.menu.querySelectorAll('.list-group-item').length == 0) return;

        let activeItem = this.menu.querySelector('.active');
        let nextItem = this.menu.querySelector('.list-group-item:first-child');

        if(activeItem){
            activeItem.classList.remove('active');
            let nextActive = activeItem.nextElementSibling;
            nextItem = nextActive || nextItem;
        }

        nextItem.classList.add('active');
    }

    setActivePrevious(){
        if(this.menu.querySelectorAll('.list-group-item').length == 0) return;

        let activeItem = this.menu.querySelector('.active');
        let previousItem = this.menu.querySelector('.list-group-item:last-child');

        if(activeItem){
            activeItem.classList.remove('active');
            let previousActive = activeItem.previousElementSibling;
            previousItem = previousActive || previousItem;
        }

        previousItem.classList.add('active');
    }

    selectEntry(){
        let activeItem = this.menu.querySelector('.active');

        if(this.menu.querySelectorAll('.list-group-item').length == 0 || !activeItem) return;

        this.element.value = activeItem.dataset['value'];
        this.hide(); 
    }

    show(){
        this.menuIsShown = true;
        this.menu.classList.add('show');
    }

    hide(){
        this.menuIsShown = false;
        this.menu.classList.remove('d-none');
        this.menu.innerHTML = '';
    }
}