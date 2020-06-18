/**
 * Класс, содержащий обработчики, определяющие алгоритм игры
 */
export class Controller {
  /**
   * Определение начально состояния контроллера игры
   * @param {Objec} user - объект игрового поля игрока
   * @param {Object} comp - объект игрового поля компьютера
   */
  constructor(user, comp, refreshBtn) {
    this.user = user;
    this.comp = comp;
    this.battlefiledNotification = document.querySelector('.battlefield__text');
    this.player = null;
    this.enemy = null;
    this.text = '';
    this.refreshBtn = refreshBtn;
  }

  setUserName = (name) => {
    this.userName = name;
  }

  /**
   * Метод, генерирующий случайное число от 0 до 1
   * @param {number} max - максимальне необходимое число 
   */
  getRandomNumber = () => Math.floor(Math.random() * (2));  


  /**
   * Метод инициализации игры. Определяет первого игрока, который будет ходить, и его противника
   */
  init = () => {
    this.player = this.getRandomNumber() === 0 ? this.user : this.comp;
    this.enemy = this.player === this.user ? this.comp : this.user;

    /** Массив с координатами для рандомного обстрела */
    this.comp.shootMatrix = [];
    /** Массив с координатами выстрелов для ИИ */
    this.comp.shootMatrixAI = [];
    /** Массив с координатами вокруг клетки попадания */
    this.comp.shootMatrixAround = [];
    /** Массив координат начала циклов по диагоналям */
    this.comp.startPoints = [
      [ [6,0], [2,0], [0,2], [0,6] ],
      [ [3,0], [7,0], [9,2], [9,6]]
    ]
    /** Объект для хранения информации по обстреливаемому кораблю */
    this.resetTempShip();
    this.user.enemyShooting = 0;

    this.setShootMatrix();

    if (this.player === this.user) {
      this.comp.playground.addEventListener('click', this.shoot);
      this.comp.playground.addEventListener('contextmenu', this.setEmptyCell);
      this.showServiseText(`${this.userName} стреляет первым.`);
    } else {
      this.showServiseText('Первым стреляет компьютер');
      setTimeout(() => this.shoot(), 3000);
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
    let flag = true;

    [].forEach.call(icons, (el) => {
      const x = el.style.top.slice(0, -2) / this.comp.deckSize;
      const y = el.style.left.slice(0, -2) / this.comp.deckSize;

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
      coordinates = this.getCoordinatesShoot();
    }
    /** Значение матрицы противника по полученным координатам выстрела @constant */
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
          ? `${this.userName} промахнулся. Стреляет компьютер`
          : `Компьютер промахнулся. Стреляет ${this.userName}`;
        this.showServiseText(this.text);

        this.player = this.player === this.user ? this.comp : this.user;
        this.enemy = this.player === this.user ? this.comp : this.user;

        if (this.player === this.comp) {
          this.comp.playground.removeEventListener('click', this.shoot);
          this.comp.playground.removeEventListener('contextmenu', this.setEmptyCell);

          if (this.comp.shootMatrixAround.length === 0) {
            this.resetTempShip();
          }

          setTimeout(() => this.shoot(), 2000);
        } else {
          this.comp.playground.addEventListener('click', this.shoot);
          this.comp.playground.addEventListener('contextmenu', this.setEmptyCell);
        }
        break;

      case 1: 
        this.enemy.matrix[coordinates.x][coordinates.y] = 4;

        this.showIcons(this.enemy, coordinates, 'red-cross');
        this.text = this.player === this.user
          ? `${this.userName} попал в корабль компьютера. Следующим стреляет ${this.userName}`
          : `Компьютер попал в корабль ${this.userName}. Выстрел компьютера`;
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
                if (this.player === this.comp) {
                  this.comp.tempShip.x0 = warship.x0;
                  this.comp.tempShip.y0 = warship.y0;
                }
                this.enemy.squadron.splice(i, 1);
              }
              break;
            }
          }
        }

        // Проверка на окончание игры
        if (this.enemy.squadron.length === 0) {

          this.text = this.player === this.user 
            ? `Поздравляем! ${this.userName} выиграл`
            : 'К сожалению, выиграл компьютер';
          this.showServiseText(this.text);
          this.refreshBtn.classList.add('battlefield__button--active');

            if (this.player === this.user) {
              this.comp.playground.removeEventListener('click', this.shoot);
              this.comp.playground.removeEventListener('contextmenu', this.setEmptyCell);
            } else {
              for (let i = 0, length = this.comp.squadron.length; i < length; i++) {
                let div = document.createElement('div');
                let dir = (this.comp.squadron[i].kx === 1) ? ' verticale' : '';
                let className = this.comp.squadron[i].shipName.slice(0, -1);

                div.className = 'ship ' + className + dir;
                div.style.cssText = `left: ${this.comp.squadron[i].y0 * this.comp.deckSize}px; top: ${this.comp.squadron[i].x0 * this.comp.deckSize}px;`;
                this.comp.playground.appendChild(div);
              }
            }
        } else {
          if (this.player === this.comp) {
            this.comp.tempShip.totalHits++;

            let points = [
              [coordinates.x - 1, coordinates.y - 1],
              [coordinates.x - 1, coordinates.y + 1],
              [coordinates.x + 1, coordinates.y - 1],
              [coordinates.x + 1, coordinates.y + 1]
            ];

            this.markEmptyCell(points);

            let max = this.checkMaxDecks();

            if (this.comp.tempShip.totalHits >= max) {
              if (this.comp.tempShip.totalHits === 1) {
                points = [
                  [this.comp.tempShip.x0 - 1, this.comp.tempShip.y0],
                  [this.comp.tempShip.x0 + 1, this.comp.tempShip.y0],
                  [this.comp.tempShip.x0, this.comp.tempShip.y0 - 1],
                  [this.comp.tempShip.x0, this.comp.tempShip.y0 - 1],
                ];
              } else {
                let x1 = this.comp.tempShip.x0 - this.comp.tempShip.kx;
                let y1 = this.comp.tempShip.y0 - this.comp.tempShip.ky;
                let x2 = this.comp.tempShip.x0 + this.comp.tempShip.kx * this.comp.tempShip.totalHits;
                let y2 = this.comp.tempShip.y0 + this.comp.tempShip.ky * this.comp.tempShip.totalHits;
                points = [
                  [x1, y1],
                  [x2, y2]
                ]
              }

              this.markEmptyCell(points);
              this.resetTempShip();
            } else {
              this.setShootMatrixAround(coordinates);
            }

            setTimeout(() => this.shoot(), 2000);
          }
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
    obj.x = Math.trunc((evt.pageY - enemy.playground.getBoundingClientRect().top) / enemy.deckSize);
    obj.y = Math.trunc((evt.pageX - enemy.playground.getBoundingClientRect().left) / enemy.deckSize);
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
    div.style.cssText = `left: ${coords.y * enemy.deckSize}px; top: ${coords.x * enemy.deckSize}px;`;
    enemy.playground.appendChild(div);
  }

  /**
   * Метод, заполняющий массивы shootMatrix и shootMatrixAI на основе массива startPoints
   */
  setShootMatrix = () => {
    // Заполнение массива shootMatrix координатами всех клеток игрового поля
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.comp.shootMatrix.push([i, j]);
      }
    }

    // Заполнение массива shootMatrixAI
    for (let i = 0, length = this.comp.startPoints.length; i < length; i++) {
      let arr = this.comp.startPoints[i];
      for (let j = 0, lh = arr.length; j < lh; j++) {
        let [x, y] = arr[j];

        switch(i) {
          case 0: 
            while (x <= 9 && y <= 9) {
              this.comp.shootMatrixAI.push([x, y]);
              x = x <= 9 ? x : 9;
              y = y <= 9 ? y : 9;
              x++; y++;
            }
            break;

          case 1:
            while (x >= 0 && x <= 9 && y <=9) {
              this.comp.shootMatrixAI.push([x, y]);
              x = (x >= 0 && x <= 9) ? x : (x < 0) ? 0 : 9;
              y = y <= 9 ? y : 9;
              x--; y++;
            }
            break;
        }
      }
    }

    this.comp.shootMatrix.sort(() => (Math.random() - 0.5));
    this.comp.shootMatrixAI.sort(() => (Math.random() - 0.5));
  }

  /**
   * Метод, возвращающий координаты для выстрела компьютера
   */
  getCoordinatesShoot = () => {
    const coords = this.comp.shootMatrixAround.length > 0 
      ? this.comp.shootMatrixAround.pop() 
      : (this.comp.shootMatrixAI.length > 0
        ? this.comp.shootMatrixAI.pop()
        : this.comp.shootMatrix.pop());

    const obj = {
      x: coords[0],
      y: coords[1]
    }

    if (this.comp.shootMatrixAI.length !== 0) {
      this.deleteElementMatrix(this.comp.shootMatrixAI, obj);
    }

    this.deleteElementMatrix(this.comp.shootMatrix, obj);

    return obj;
  }

  /**
   * Метод, удаляющий элемент массива
   * @param {Array} array - массив, из которого удаляется элемент
   * @param {Object} obj - объект с координатами выстрела
   */
  deleteElementMatrix = (array, {x, y}) => {
    for (let i = 0, length = array.length; i < length; i++) {
      if (array[i][0] === x && array[i][1] === y) {
        array.splice(i, 1);
        break;
      }
    }
  }

  /**
   * Метод, приводящий все свойства объекта tempShip в исходное состояние
   */
  resetTempShip = () => {
    // Обнуление массива с координатами обстрела вокрег попадания
    this.comp.shootMatrixAround = [];
    this.comp.tempShip = {
      // Количество попаданий по кораблю
      totalHits: 0,
      // Координаты первого попадания по кораблю
      firstHit: {},
      // Координаты второго попадания по кораблю
      nextHit: {},
      // Коэффициенты, определяющие положение корабля
      kx: 0,
      ky: 0
    }
  }

  /**
   * Метод, закрашивающий ячейки, лежащие по диагональным сторонам от палубы попадания и 
   * удаляющий их из массивов компьютера
   * @param {Array} points - координаты ячеек, лежащих по диагональным сторонам от палубы попадания
   */
  markEmptyCell = (points) => {
    for (let i = 0, length = points.length; i < length; i++) {
      let obj = {
        x: points[i][0],
        y: points[i][1]
      };

      // Проверка на выход проверяемой координа за пределы поля
      if (obj.x < 0 || obj.x > 9 || obj.y < 0 || obj.y > 9) continue;
      // Проверка значения поля, лежащего по обрабатываемым координатам
      if (this.user.matrix[obj.x][obj.y] !== 0) continue;

      this.showIcons(this.enemy, obj, 'shaded-cell');
      this.user.matrix[obj.x][obj.y] = 2;

      this.deleteElementMatrix(this.comp.shootMatrix, obj);
      if (this.comp.shootMatrixAround.length != 0) {
        this.deleteElementMatrix(this.comp.shootMatrixAround, obj);
      }
      if (this.comp.shootMatrixAI.length != 0) {
        this.deleteElementMatrix(this.comp.shootMatrixAI, obj);
      }
      this.deleteElementMatrix(this.comp.shootMatrix, obj);
    }
  }

  /**
   * Поиск максимольного количетсва палуб среди кораблей
   */

  //Поиск максимольного количетсва палуб среди кораблей
  checkMaxDecks = () => {
    const arr = [];
    for (let i = 0, length = this.user.squadron.length; i < length; i++) {
      arr.push(this.user.squadron[i].decks);
    }

    return Math.max.apply(null, arr);
  }

  /**
   * Метод, определяющий алгоритм формирования координат
   * @param {Object} coordinates - координаты выстрела
   */
  setShootMatrixAround = (coordinates) => {
    if (this.comp.tempShip.kx === 0 && this.comp.tempShip.ky === 0) {
      if (Object.keys(this.comp.tempShip.firstHit).length === 0) {
        this.comp.tempShip.firstHit = coordinates;
      } else {
        this.comp.tempShip.nextHit = coordinates;
        this.comp.tempShip.kx = (Math.abs(this.comp.tempShip.firstHit.x - this.comp.tempShip.nextHit.x) === 1)
          ? 1
          : 0;
      }
    }

    // Вычисление координат выстрела
    if (coordinates.x > 0 && this.comp.tempShip.ky === 0) {
      this.comp.shootMatrixAround.push([coordinates.x - 1, coordinates.y]);
    }
    if (coordinates.x < 9 && this.comp.tempShip.ky === 0) {
      this.comp.shootMatrixAround.push([coordinates.x + 1, coordinates.y]);
    }
    if (coordinates.y > 0 && this.comp.tempShip.kx === 0) {
      this.comp.shootMatrixAround.push([coordinates.x, coordinates.y - 1]);
    }
    if (coordinates.y < 9 && this.comp.tempShip.kx === 0) {
      this.comp.shootMatrixAround.push([coordinates.x, coordinates.y + 1]);
    }

    // Проверка валидности полученных координа
    for (let i = this.comp.shootMatrixAround.length - 1; i >= 0; i--) {
      let x = this.comp.shootMatrixAround[i][0];
      let y = this.comp.shootMatrixAround[i][1];
      if (this.user.matrix[x][y] !== 0 && this.user.matrix[x][y] !==1) {
        this.comp.shootMatrixAround.splice(i, 1);
        this.deleteElementMatrix(this.comp.shootMatrix, coordinates);
      }
    }

    if (this.comp.shootMatrixAround.length === 0) {
      this.resetTempShip();
    }

    return;
  }
}