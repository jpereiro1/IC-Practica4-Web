
//Clase para decidir los colores que tendrán cada usuario
export class ColorMarkers {
    constructor() {
      this.userColors = new Map();
    }

    addUser(id){
        this.userColors.set(id,this.getRandomDarkPrimaryColor());

        /*Creación de la leyenda*/
        var legendItem = document.createElement("div");
        legendItem.className = 'legendItem';

        var legendSquare = document.createElement('div');
        legendSquare.className = 'legendSquare';
        legendSquare.style.backgroundColor = this.userColors.get(id);

        var legendText = document.createElement('p');
        legendText.className = 'legendText';
        legendText.textContent = "Usuario: " + id;

        legendItem.appendChild(legendSquare);
        legendItem.appendChild(legendText);
        document.getElementById("legend").appendChild(legendItem);
    }

    getUserColor(id){
        return this.userColors.get(id);
    }

    removeLegends(){
        var legend = document.getElementById("legend");
        while (legend.firstChild) {
            legend.removeChild(legend.firstChild);
        }
    }



  
    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
        return color;
    }

    getRandomDarkPrimaryColor() {
      const colors = ['#800000', '#000080', '#004000', '#000000'];
  
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    }
}
  
 
  