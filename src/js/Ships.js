/** Класс корабля */
export class Ships {
  /**
   * 
   * @param {string} player - тип игрока (пользователь/компьютер)
   * @param {Object} shipObject - объект, содержащий свойства корабля
   */
  constructor(player, shipObject) {
    this.player = player;
    this.shipName = shipObject.shipName;
    this.decks = shipObject.decks;
    this.x0 = shipObject.x;
    this.y0 = shipObject.y;
    this.kx = shipObject.kx;
    this.ky = shipObject.ky;
    this.hits = 0;
    this.matrix = [];
  }  

  /**
   * Метод создания корабля
   */
  createShip = () => {
    let k = 0;
    // Создание массива, содержащего координаты каждой палубы каждого корабля
    while (k < this.decks) {
      this.player.matrix[this.x0 + k * this.kx][this.y0 + k * this.ky] = 1;
      this.matrix.push([this.x0 + k * this.kx, this.y0 + k * this.ky]);
      k++;
    }

    //Добавление корабля в массив, содержащий информацию о всех кораблях
    this.player.squadron.push(this);

    //Отображение корабля на игрвоом поле
    if (this.player.type == 'user') this.showShip();
  }


  /**
   * Метод отображения корабля на игровом поле
   */
  showShip = () => {
    const div = document.createElement('div');
    const dir = this.kx === 1 ? ' verticale' : '';
    const className = this.shipName.slice(0, -1);
    const player = this.player;

    div.setAttribute('id', this.shipName);
    div.className = 'ship ' + className + dir;
    div.style.cssText = `left: ${this.y0 * player.deckSize}px; top: ${this.x0 * player.deckSize}px;`;
    player.playground.appendChild(div);
  }
}