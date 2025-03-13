/**
 * @param {Array[Array]} items - An array of arrays, each containing dom objects representing the layout of the objects
 * @param {Number} padding - The padding between the edge of the menu and the items
 * @param {Number} spacing - The spacing between the items
 * @param {Array} position - The position of the menu
 * @param {String} color - The color of the menu
 */
class UIMenu{
    constructor(items, padding = 5, spacing = 5, position = [0,0], color = "#ffffff", name = "Menu"){
      this.container = createDiv();
      this.container.position(position[0], position[1]);
      this.container.style("background-color", color);
      this.container.style("display", "grid");
      this.name = name;
      this.items = items;
  
      let max = 0;
      for(let i = 0; i < items.length; i++){
        if(items[i].length > max){
          max = items[i].length;
        }
      }
      this.container.style("grid-template-columns", "auto ".repeat(max).trim());
      this.container.style("grid-template-rows", "auto ".repeat(items.length).trim());
      for(let i = 0; i < items.length; i++){
        for(let j = 0; j < items[i].length; j++){
          this.container.child(items[i][j]);
        }
        if(items[i].length < max){
          for(let j = items[i].length; j < max; j++){
            this.container.child(createDiv());
          }
        }
        this.container.style("gap", `${spacing}px`);
        this.container.style("padding", `${padding}px`);
      }
  
    }
  
    getItems(){
      return this.items;
    }
  
    addItem(item){
      this.items.push(item);
      this.container.child(item);
    }
  
    getPadding(){
      return this.container.style("padding");
    }
  
    setPadding(newPadding){
      this.container.style("padding", `${newPadding}px`);
    }
  
    getSpacing(){
      return this.container.style("gap");
    }
  
    setSpacing(newSpacing){
      this.container.style("gap", `${newSpacing}px`);
    }
  
    getPosition(){
      return [this.container.position().x, this.container.position().y];
    }
  
    setPosition(newPosition){
      this.container.position(newPosition[0], newPosition[1]);
    }
  
    getColor(){
      return this.container.style("background-color");
    }
  
    setColor(newColor){
      this.container.style("background-color", newColor);
    }
  
    getName(){
      return this.name;
    }
  
    setName(newName){
      this.name = newName;
    }
  
    show(){
      this.container.style("display", "grid");
    }
  
    hide(){
      this.container.hide();
    }
  
    parent(container){
      this.container.parent(container);
    }
  }
  
  
  /**
   * @param {Object} menus - An object containing name menu pairs
   * @param {Array} position - The position of the menu manager
   * @param {CallableFunction} callback - The callback for the submit button. If undefined, no submit button is made.
   * @param {String} backgroundColor - The background color of the manager. All UIMenu's will use this color if no color is given to them in their constructor
   * @param {String} buttonColor - color of buttons
   * @param {String} selectedColor - color of selected menu button 
   * Displaying names as buttons on the top to pick which menu to show
   */
  class UIMenuManager{
    constructor(menus, position, submitCallback, backgroundColor = "#ffffff", buttonColor = "#ffffff", selectedColor = "#ff0000"){
      this.buttonColor = buttonColor;
      this.selectedColor = selectedColor;
      this.backgroundColor = backgroundColor;
      this.container = createDiv();
      this.buttonContainer = createDiv();
      this.menus = menus;
      console.log(this.menus)
      this.selected = this.menus[Object.keys(menus)[0]];
  
      this.buttonContainer.style("display", "grid");
      this.buttonContainer.style("grid-template-columns", "auto ".repeat(Object.keys(menus).length).trim());
  
      this.container.position(position[0], position[1]);
      this.container.style("display", "table-column");
      this.container.child(this.buttonContainer)
  
      for(let name in menus){
        let button = createButton(name);
        button.size(AUTO, 25)
        button.style("background-color", this.buttonColor);
        button.style("border","none")
        this.buttonContainer.child(button);
  
        button.mousePressed(
          () => {
          console.log(this.selected)
          this.selected.hide();
          for(let button of this.buttonContainer.elt.children){
            button.style.backgroundColor = this.buttonColor;
          }
          button.style("background-color", this.selectedColor);
          this.selected = this.menus[name];
          this.selected.show();
          }
        );
        console.log(this.menus[name]);
        this.menus[name].hide();
        this.menus[name].parent(this.container);
        if(this.menus[name].getColor() == "rgb(255, 255, 255)"){
          this.menus[name].setColor(this.backgroundColor);
        }
  
      }
      this.menus[Object.keys(menus)[0]].show();
      this.buttonContainer.elt.children[0].style.backgroundColor = this.selectedColor;
      this.buttonContainer.position(0, -25);
      if(submitCallback !== undefined){
        for(menus in this.menus){
          this.menus[menus].addItem(createButton("submit").mouseClicked(
            () => {
              submitCallback(this.selected.getItems());
            }
          ))
        }
      }
    }

    hide(){
        this.container.hide();
    }

    show(){
        this.container.style("display", "table-column")
    }

    setPosition(position){
        this.container.position(position[0], position[1]);
    }

    getPosition(){
        return [this.container.position().x, this.container.position().y];
    }

    addItem(item){
        let name = item.name
        let button = createButton(name);
        button.size(AUTO, 25)
        button.style("background-color", this.buttonColor);
        button.style("border","none")
        this.buttonContainer.child(button);
  
        button.mousePressed(
          () => {
          this.selected.hide();
          for(let button of this.buttonContainer.elt.children){
            button.style.backgroundColor = this.buttonColor;
          }
          button.style("background-color", this.selectedColor);
          this.selected = this.menus[name];
          this.selected.show();
          }
        );
        this.menus[name].hide();
        this.menus[name].parent(this.container);
        if(this.menus[name].getColor() == "rgb(255, 255, 255)"){
          this.menus[name].setColor(this.backgroundColor);
        }

        if(submitCallback !== undefined){
            this.menus[menus].addItem(createButton("submit").mouseClicked(
                () => {
                submitCallback(this.selected.getItems());
                }
            ))
        }
    }
  }