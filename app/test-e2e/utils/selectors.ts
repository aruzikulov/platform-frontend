export function tid(id: string, rest?: string): string {
  return `[data-test-id="${id}"]` + (rest ? ` ${rest}` : "");
}

export function formField(name: string): string {
  return `[name="${name}"], ${tid(name)}`;
}
