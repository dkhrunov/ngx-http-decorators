import { Exception } from "./exception";

export class HeaderDecoratorNotSupportedException extends Exception {
  constructor() {
    super('The Header decorator only applies to a class or method.');
    this.name = 'The Header decorator only applies to a class or method.';
  }
}
