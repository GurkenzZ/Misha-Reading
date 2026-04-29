export function setElementLabel(element: HTMLElement, label: string): void {
  element.setAttribute("aria-label", label);
}
