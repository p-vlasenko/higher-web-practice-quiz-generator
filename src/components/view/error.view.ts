// import type { Renderer } from '@/types/base';
// import type { ErrorDescription } from '@/types/view';
// import { getFirstElementOrFail, hide, show } from '@/utils/dom-utils';

// export class ErrorBrowserView implements Renderer<ErrorDescription> {
//     #element: HTMLElement;
//     #messageElement: HTMLElement;
//     #detailsElement: HTMLElement;
//     #hideButton: HTMLButtonElement;

//     constructor(element: HTMLElement) {
//         this.#element = element;
//         this.#messageElement = getFirstElementOrFail('.error__title', element);
//         this.#detailsElement = getFirstElementOrFail('.error__message', element);
//         this.#hideButton = getFirstElementOrFail('.error__action', element) as HTMLButtonElement;

//         this.#hideButton.addEventListener('click', () => this.#hide());
//     }

//     render(description: ErrorDescription): void {
//         this.#setDescription(description);
//         this.#show();
//     }

//     #setDescription({ message, details }: ErrorDescription) {
//         this.#messageElement.textContent = message;
//         this.#detailsElement.textContent = details;
//     }

//     #show() {
//         show(this.#element);
//         this.#element.classList.add('toast--visible');
//     }

//     #hide() {
//         hide(this.#element);
//         this.#element.classList.remove('toast--visible');
//     }
// }
