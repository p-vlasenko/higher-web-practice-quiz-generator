import { setChildren } from '@/utils/dom-utils';

export type ModalViewParams = {
    root: HTMLElement;
    contentContainer: HTMLElement;
    closeButton: HTMLElement;
};

export class ModalBrowserView {
    #modalRoot: HTMLElement;
    #contentContainer: HTMLElement;
    #closeButton: HTMLElement;

    #isOpened = false;

    constructor({ root, contentContainer, closeButton }: ModalViewParams) {
        this.#modalRoot = root;
        this.#contentContainer = contentContainer;
        this.#closeButton = closeButton;
        this.#initListeners();
    }

    get isOpened(): boolean {
        return this.#isOpened;
    }

    render(container: HTMLElement): void {
        container.appendChild(this.#modalRoot);
    }

    setContentContainer(container: HTMLElement) {
        this.#contentContainer = container;
    }

    setContent(...elements: HTMLElement[]): void {
        setChildren(this.#contentContainer, elements);
    }

    show(): void {
        this.#isOpened = true;
        this.#modalRoot.classList.add('modal_active');
    }

    hide(): void {
        this.#isOpened = false;
        this.#modalRoot.classList.remove('modal_active');
    }

    #initListeners() {
        this.#closeButton.addEventListener('click', () => {
            this.#modalRoot.classList.remove('modal_active');
        });
    }
}

export const makeModalView = (params: ModalViewParams): ModalBrowserView => new ModalBrowserView(params);
