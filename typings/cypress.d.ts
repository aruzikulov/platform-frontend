declare namespace Cypress {
  // noinspection TsLint
  interface Chainable<Subject = any> {
    dropFile: (fixture: string) => void;
    awaitedClick(waitDuration?: number): void;
  }
}
