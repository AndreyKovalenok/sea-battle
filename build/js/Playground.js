import { Ships } from './Ships.js';

/** Класс игрового поля */
export class Playground {
  /**
   * Создание игрового поля. Индексы массива ships соответствуют 
   * количеству кораблей каждого типа
   * @param {Node} playground - игровое поле
   * @param {string} player - тип игрока (пользователь/компьютер)
   */
  constructor(playground, player) {
    this.playgroundSize = 330;
    this.deckSize = 33;
    this.ships = [
      '',
      [4, 'fourdeck'],
      [3, 'tripledeck'],
      [2, 'doubledeck'],
      [1, 'singledeck']
    ],
    this.playground = playground;
    this.squadron	= [];
    this.type = player;
  }

  /**
   * Метод, генерирующий случайное число от 0 до max
   * @param {number} max - максимальне необходимое число 
   */
  getRandomNumber = (max) => Math.floor(Math.random() * max);  

  /**
   * Метод, создающий масив рамерности rows x cols, заполненый нулями
   * @param {number} rows 
   * @param {number} cols 
   */
  createDefaultMatrix = (rows, cols) => {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < cols; j++) {
        matrix[i][j] = 0;
      }
    }
      
    return matrix;
  }

  /**
   * Метод, проверяющий координаты расположения корабля. В полученных координатах
   * не должны располагаться ранее созданные корабли, в соседних клетках не должны
   * находиться палубы ранее созданных кораблей, корабль не должен выходить за пределы 
   * игрового поля
   * @param {number} x - координата расположения первой палубы по оси абсцисс
   * @param {number} y - координата расположения первой палубы по оси ординат
   * @param {number} kx - горизонтальное расположение корабля
   * @param {number} ky - вертикальное располоэение корабля
   * @param {number} decks - размер корабля
   */
  checkLocationShip = (x, y, kx, ky, decks) => {
    /** Индекс начала цикла для строк @constant */
    const fromX = x === 0 ? x : x - 1;
    /** Индекс начала цикла для столбцов @constant */
    const fromY = y === 0 ? y : y - 1;

    /** Индекс конца цикла для строк @constant */
    /** Индекс конца цикла для столбцов @constant */
    let toX = 0;
    let toY = 0;
    if (x + kx * decks === 10 && kx === 1) {
      toX = x + kx * decks;
    } else if (x + kx * decks < 10 && kx === 1) {
      toX = x + kx * decks + 1;
    } else if (x === 9 && kx === 0) {
      toX = x + 1;
    } else if (x < 9 && kx === 0) {
      toX = x + 2;
    }

    if (y + ky * decks === 10 && ky === 1) {
      toY = y + ky * decks;
    } else if (y + ky * decks < 10 && ky === 1) {
      toY = y + ky * decks + 1;
    } else if (y === 9 && ky === 0) {
      toY = y + 1;
    } else if (y < 9 && ky === 0) {
      toY = y + 2;
    }

    for (let i = fromX; i < toX; i++) {
      for (let j = fromY; j < toY; j++) {
        if (this.matrix[i][j] === 1) return false;
      }
    }

    return true;
  }

  /**
   * Метод, определяющий направление расположения палуб и координаты первой палубы
   * корабля
   * @param {number} decks - размер корабля
   */
  getCoordinatesDecks = (decks) => {
    /** 
     * Горизонтальное расположение корабля
     * @constant {number}  
    */
    const kx = this.getRandomNumber(1);

    /** 
     * Вертикальное расположение корабля
     * @constant {number}  
    */
    const ky = kx === 0 ? 1 : 0;

    /** 
     * Координата расположения палубы по оси абсцисс
     * @constant {number}  
    */
    const x = kx === 0 ? this.getRandomNumber(9) : this.getRandomNumber(10 - decks);

    /** 
     * Координата расположения палубы по оси ординат
     * @constant {number}  
    */
    const y = kx === 1 ? this.getRandomNumber(9) : this.getRandomNumber(10 - decks);

    const result = this.checkLocationShip(x, y, kx, ky, decks);

    if (!result) return this.getCoordinatesDecks(decks);

    return {x, y, kx, ky};
  }

  /**
   * Метод, перебирающий массив с данными кораблей и создает корабли,
   * являющиеся экземплярами класса Ships. Индекс массива равен количеству
   * кораблей определенного типа
   */
  randomLocationShips = () => {
    this.matrix = this.createDefaultMatrix(10, 10);

    for (let i = 1, length = this.ships.length; i < length; i++) {
      const [shipSize, shipName] = this.ships[i]; 
      const decks = shipSize;

      for (let j = 0; j < i; j++) {
        const shipObject = this.getCoordinatesDecks(decks);
        shipObject.decks = decks;
        shipObject.shipName = shipName + String(j + 1);

        const ship = new Ships(this, shipObject);
        ship.createShip();
      }
    }
  }
}