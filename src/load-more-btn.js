export default class HiddenButton {
  constructor(buttonSelector) {
    this.button = document.querySelector(buttonSelector);
    this.button.classList.add("is-hidden");
  }

  show() {
    this.button.classList.remove("is-hidden");
  }

  hide() {
    this.button.classList.add("is-hidden");
  }

  toggle() {
    this.button.classList.toggle("is-hidden");
  }
}