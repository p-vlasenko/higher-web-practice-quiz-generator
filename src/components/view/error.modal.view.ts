import type { Renderer } from '@/types/base';
import type { ErrorDescription } from '@/types/view';
import { getFirstElementOrFail } from '@/utils/dom-utils';
import type { ModalBrowserView } from './modal.view';

export type Deps = {
    modalView: ModalBrowserView;
    errorElement: HTMLElement;
};

export class ErrorBrowserView implements Renderer<ErrorDescription> {
    #messageElement: HTMLElement;
    #detailsElement: HTMLElement;
    #modalView: ModalBrowserView;

    constructor({ errorElement, modalView }: Deps) {
        this.#modalView = modalView;
        this.#messageElement = getFirstElementOrFail('.error__title', errorElement);
        this.#detailsElement = getFirstElementOrFail('.error__message', errorElement);
    }

    render(description: ErrorDescription): void {
        this.#setDescription(description);
        this.#modalView.show();
    }

    #setDescription({ message, details }: ErrorDescription) {
        this.#messageElement.textContent = message;
        this.#detailsElement.textContent = details;
    }
}
