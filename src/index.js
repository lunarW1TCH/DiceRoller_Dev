import { MAX_DICE_INPUT, MIN_DICE_INPUT, SLEEP_TIME_MS } from './config';
import { indexToSides, paths, getRandomInt, sleep } from './helpers';

// DOM elements
const form = document.querySelector('.controlPanel__form');
const btnRoll = document.getElementById('btn__roll');
const results = document.querySelector('.container__results');
const resultsMsg = document.querySelector('.container__results--span');
const colorThemeBtn = document.querySelector('.icon__btn--moon');
const darkStylesheet = document.getElementById('dark__stylesheet');
const inputs = document.getElementsByClassName('inputContainer__input');
const plusBtns = document.getElementsByClassName('icon__btn--plus');
const minusBtns = document.getElementsByClassName('icon__btn--minus');

// paths to dice icons from the parcel build
const dicePaths = paths();

class App {
  #firstRoll = true;
  #darkMode = false;

  constructor() {
    // attach event listeners
    form.addEventListener('submit', this._formHandler.bind(this));
    btnRoll.addEventListener('click', this._btnRollHandler.bind(this));
    colorThemeBtn.addEventListener(
      'click',
      this._siteColorThemeHandler.bind(this)
    );

    [...inputs].forEach(el =>
      el.addEventListener('change', this._inputsValueHandler.bind(this))
    );
    [...plusBtns].forEach(el =>
      el.addEventListener('click', e => this._plusOrMinusHandler(e, 'plus'))
    );
    [...minusBtns].forEach(el =>
      el.addEventListener('click', e => this._plusOrMinusHandler(e, 'minus'))
    );
  }

  // events

  _siteColorThemeHandler(e) {
    if (this.#darkMode) {
      darkStylesheet.disabled = true;
      this.#darkMode = false;
    } else {
      darkStylesheet.disabled = false;
      this.#darkMode = true;
    }
  }

  _formHandler(e) {
    e.preventDefault();
  }

  _btnRollHandler(e) {
    const inputs = [...form.getElementsByClassName('inputContainer__input')];
    const diceValues = [];

    // pushes dice values in order (d4, d6 ...) into diceValues
    inputs.forEach(el => diceValues.push(+el.value));
    const initialValue = 0;
    const sum = diceValues.reduce((sum, el) => sum + el, initialValue);

    // if all of the inputs are set to 0, rolling does not happen
    if (sum !== 0) {
      this._renderRoll(diceValues);
    }
  }

  _inputsValueHandler(e) {
    if (e.target.value < MIN_DICE_INPUT) e.target.value = MIN_DICE_INPUT;
    if (e.target.value > MAX_DICE_INPUT) e.target.value = MAX_DICE_INPUT;
  }

  _plusOrMinusHandler(e, btn) {
    const id = e.target.id;
    const dice = id.substring(0, 3);

    // gets the input which is the sibling of a clicked button
    const input = document.getElementById(`${dice}_input`);

    if (btn === 'plus') {
      if (input.value >= MAX_DICE_INPUT) return;
      input.value++;
    }

    if (btn === 'minus') {
      if (input.value <= MIN_DICE_INPUT) return;
      input.value--;
    }
  }

  // returns an array of rolls for every dice in the form
  _getRolls(diceValues) {
    const rolls = [];

    diceValues.forEach(function (diceNum, index) {
      if (diceNum !== 0) {
        const sides = indexToSides(index);
        for (let i = 0; i < diceNum; i++) {
          rolls.push([sides, getRandomInt(sides)]);
        }
      }
    });

    return rolls;
  }

  _toggleSpin() {
    const icons = Array.from(form.getElementsByClassName('icon--dice'));
    icons.forEach(function (icon) {
      icon.classList.toggle('rotate');
    });
  }

  _getRollHtml(rolls) {
    const initialValue = 0;
    const sum = rolls.reduce((sum, el) => sum + el.at(1), initialValue);

    const div = document.createElement('div');
    div.classList.add('container__box', 'results__rollContainer');

    rolls.forEach(function (roll) {
      const divRoll = document.createElement('div');
      divRoll.classList.add('results__rollContainer--roll');

      const iconDice = document.createElement('img');
      iconDice.classList.add('icon', 'icon--dice');
      const src = dicePaths[roll.at(0)];
      iconDice.setAttribute('src', src);
      divRoll.appendChild(iconDice);

      const spanResult = document.createElement('span');
      const rollResult = document.createTextNode(roll.at(1));
      spanResult.appendChild(rollResult);
      divRoll.appendChild(spanResult);

      div.appendChild(divRoll);
    });

    const divSpan = document.createElement('div');
    divSpan.classList.add('results__rollContainer--sum');

    const spanSum = document.createElement('span');
    const sumText = document.createTextNode(`SUM: ${sum}`);
    spanSum.appendChild(sumText);
    divSpan.appendChild(spanSum);
    div.appendChild(divSpan);

    return div;
  }

  async _renderRoll(diceValues) {
    // [[diceSides, rollValue], [diceSides, rollValue], ...]
    const rolls = this._getRolls(diceValues);

    // after sleep time, spin animation stops and the results show up
    this._toggleSpin();
    await sleep(SLEEP_TIME_MS);
    this._toggleSpin();

    // hides 'your rolls will show up here' message
    if (this.#firstRoll) {
      resultsMsg.classList.add('hidden');
      this.#firstRoll = false;
    }

    const html = this._getRollHtml(rolls);
    results.insertAdjacentElement('afterbegin', html);
  }
}

const app = new App();
