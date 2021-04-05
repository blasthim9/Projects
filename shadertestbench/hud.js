export class hud {
	constructor() {
    this.child = []
		this.container = document.createElement("div");
    this.container.setAttribute("id","hud");
		this.container.style.cssText = `
      display: flex;
      flex-direction:column;
      background: white; 
      width: 200px;
      position: absolute;
      top:0px;
      display: inline-block;
      z-index:1;`;
		document.body.appendChild(this.container);
	}
	addText(text = this.child.length) {
		let id = this.child.length;
    this.child.push( document.createElement("p"));
    this.child[id].setAttribute("id",`${id}`)
    this.child[id].style.margin=0;
    this.child[id].style.marginLeft = "5px";
    this.child[id].style.marginTop = "0px";
    this.child[id].innerHTML = text;
    this.container.appendChild(this.child[id])
    return id;
  }
  addTextN(n=5){
    for(let i=0;i<n;i++){
      this.addText()
    }
  }
}
