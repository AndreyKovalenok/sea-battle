/**
 * Класс, содержащий обработчики, определяющие алгоритм игры
 */
export class Controller {
  /**
   * Определение начально состояния контроллера игры
   * @param {Objec} user - объект игрового поля игрока
   * @param {Object} comp - объект игрового поля компьютера
   */
  constructor(user, comp) {
    this.user = user;
    this.comp = comp;
    this.battlefiledNotification = document.querySelector('.battlefield__text');
    this.player = null;
    this.enemy = null;
    this.text = '';
  }

  /**
   * Метод, генерирующий случайное число от 0 до max
   * @param {number} max - максимальне необходимое число 
   */
  getRandomNumber = (max) => Math.floor(Math.random() * max);  


  /**
   * Метод инициализации игры. Определяет первого игрока, который будет ходить, и его противника
   * 
   */
  init = () => {
    this.player = this.getRandomNumber(1) === 0 ? this.user : this.comp;
    this.enemy = this.player === this.user ? this.comp : this.user;

    if (this.player === this.user) {
      this.comp.playground.addEventListener('click', this.shoot);
      this.comp.playground.addEventListener('contextmenu', this.setEmptyCell);
      this.showServiseText('Вы стреляете первым.');
    }
  }

  /**
   * Метод вывода сообщения о состоянии игры
   * @param {string} text 
   */
  showServiseText = (text) => {
    this.battlefiledNotification.innerHTML = '';
    this.battlefiledNotification.innerHTML = text;
  }
  
  /**
   * Метод установки маркера пустого поля
   * @param {Object} evt - объект свойст события
   */
  setEmptyCell = (evt) => {
    if (evt.button !== 2) return false;
    evt.preventDefault();

    const coordinates = this.transformCoordinates(evt, this.comp);
    const isCheckedCell = this.checkCell(coordinates);

    if (isCheckedCell) {
      this.showIcons(this.enemy, coordinates, 'shaded-cell');
      this.comp.matrix[coordinates.x][coordinates.y] = 2;
    }
  }

  /**
   * Метод проверки состояния клетки
   * @param {Object} coordinates - координаты клика по игровому полю
   */
  checkCell = (coordinates) => {
    const icons = this.enemy.playground.querySelectorAll('.icon-field');
    console.log(icons);
    let flag = true;

    [].forEach.call(icons, (el) => {
      const x = el.style.left.slice(0, -2) / this.comp.deckSize;
      const y = el.style.top.slice(0, -2) / this.comp.deckSize;

      if (coordinates.x === x && coordinates.y === y) {
        const isShaded = el.classList.contains('shaded-cell');

        if (isShaded) {
          el.parentNode.removeChild(el);
          this.comp.matrix[coordinates.x][coordinates.y] = 0;
        }

        flag = false;
      }
    })
    return flag;
  }

  /**
   * Метод обработки выстрела по игровому полю компьютера
   * @param {Object} evt - объект свойств события 
   */
  shoot = (evt) => {
    let coordinates = null;
    // Определение выстрелившего. Если evt === undefined, то стреляет компьютер
    if (evt !== undefined) {
      if (evt.button !== 0) return false;

      coordinates = this.transformCoordinates(evt, this.enemy);
    } 
    else {
      coordinates = {x: 1, y: 1}
      /** @todo получение коориднат выстрела компьютера */ 
      // coordinates = this.comp.shootMatrixAround.length 
      //   ? this.getCoordinateshShotAround() 
      //   : this.getCoordinatesShoor(); 
    }
    // Значение матрицы противника по полученным координатам выстрела
    const val = this.enemy.matrix[coordinates.x][coordinates.y];
    
    /**
     * Опредеение действий в зависимости от значения поля матрицы.
     * 0 - пустая клетка
     * 1 - попадание по палубе корабля
     * 2 - отмеченная клетка
     * 3 - зафиксирован промах
     * 4 - зафиксировано попадание
     */
    switch (val) {
      case 0:
        this.showIcons(this.enemy, coordinates, 'dot');
        this.enemy.matrix[coordinates.x][coordinates.y] = 3;
        
        this.text = this.player === this.user 
          ? 'Вы промахнулись. Стреляет компьютер'
          : 'Компьютер промахнулся. Ваш выстрел';
        this.showServiseText(this.text);

        this.player = this.player === this.user ? this.comp : this.user;
        this.enemy = this.player === this.user ? this.comp : this.user;

        if (this.player === this.comp) {
          this.comp.playground.removeEventListener('click', this.shoot);
          this.comp.playground.removeEventListener('contextmenu', this.setEmptyCell);

          setTimeout(() => {
            return this.shoot();
          }, 1000);
        } else {
          this.comp.playground.addEventListener('click', this.shoot);
          this.comp.playground.addEventListener('contextmenu', this.setEmptyCell);
        }
        break;

      case 1: 
        this.enemy.matrix[coordinates.x][coordinates.y] = 4;
        this.showIcons(this.enemy, coordinates, 'red-cross');
        this.text = this.player === this.user
          ? 'Поздравялем! Вы попали. Ваш выстрел'
          : 'Компьютер попал в ваш корабль. Выстрел компьютера';
        this.showServiseText(this.text);

        // перебор массива кораблей противника
        for (let i = this.enemy.squadron.length - 1; i >= 0; i--) {
          let warship = this.enemy.squadron[i];
          let arrayDescks = warship.matrix;

          // перебор координат палуб корабля
          for (let j = 0, length = arrayDescks.length; j < length; j++) {
            if (arrayDescks[j][0] === coordinates.x && arrayDescks[j][1] === coordinates.y) {
              warship.hits++;

              // проверка совпадения количества палуб и количества попаданий по кораблю
              if (warship.hits === warship.decks) {
                this.enemy.squadron.splice(i, i);
              }
              break;
            }
          }
        }

        // Проверка на окончание игры
        if (this.enemy.squadron.length === 0) {
          this.text = this.player === this.user 
            ? 'Поздравляем! Вы выиграли'
            : 'К сожалению, вы проиграли'

            if (this.player === this.user) {
              this.comp.playground.removeEventListener('click', this.shoot);
              this.comp.playground.removeEventListener('contextmenu', this.setEmptyCell);
            } /** @todo вывод на экран оставышихся кораблей противника */
        }
        break;
      
      case 2: 
        this.text = 'Снимите блокировку с этих координат!';
        this.showServiseText(this.text);

        const icons = this.enemy.playground.querySelectorAll('.shaded-cell');

        [].forEach.call(icons, (el) => {
          const x = el.style.top.slice(0, -2) / this.comp.deckSize;
          const y = el.style.left.slice(0, -2) / this.comp.deckSize;

          if (coordinates.x === x && coordinates.y === y) {
            el.classList.add('shaded-cell_red');
            setTimeout(() => {
              el.classList.remove('shaded-cell_red');
            }, 500)
          }
        })
        break;

      case 3: 
      case 4: 
        this.text = 'По этим координатам вы уже стреляли!'
        this.showServiseText(this.text);
        break;
    }
  }

  /**
   * Метод, преобразующий пиксельные координаты выстрела в координаты матрицы
   * @param {Object} evt - объект свойств события
   * @param {Object} enemy - противник
   */
  transformCoordinates = (evt, enemy) => {
    const obj = {};
    obj.x = Math.trunc((evt.pageX - enemy.playground.getBoundingClientRect().left) / enemy.deckSize);
    obj.y = Math.trunc((evt.pageY - enemy.playground.getBoundingClientRect().top) / enemy.deckSize);
    return obj;
  }


  /**
   * Метод визульного отображения результата выстрела
   * @param {Object} enemy - противник
   * @param {Object} coords - координаты выстрела
   * @param {string} iconClass - тип визуального отображения результата выстрела.
   * dot - точка
   * red-cross - красный крест
   * sheded-cell - отмеченная клета
   */
  showIcons = (enemy, coords, iconClass) => {
    const div = document.createElement('div');
    div.className = 'icon-field ' + iconClass;
    div.style.cssText = `left: ${coords.x * enemy.deckSize}px; top: ${coords.y * enemy.deckSize}px;`;
    enemy.playground.appendChild(div);
  }
}