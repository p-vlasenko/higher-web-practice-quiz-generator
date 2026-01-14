import type { AnsweredOptionViewData, OptionViewData } from '@/types/view';
import { getFirstElementOrFail, show, hide } from '@/utils/dom-utils';
import { isNil } from '@/utils/utils';

export class OptionBrowserView {
    readonly element: HTMLElement;
    #input: HTMLInputElement;
    #label: HTMLLabelElement;
    #text: HTMLElement;
    #message: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
        this.#input = getFirstElementOrFail('.option__input', element) as HTMLInputElement;
        this.#label = getFirstElementOrFail('.option__label', element) as HTMLLabelElement;
        this.#text = getFirstElementOrFail('.option__text', element);
        this.#message = getFirstElementOrFail('.option__message', element);
    }

    renderOptions(data: OptionViewData): void {
        const { option } = data;

        this.#input.value = String(option.id);
        this.#input.disabled = false;
        this.#input.checked = false;

        this.#text.textContent = option.text;

        this.setEmptyResult();
    }

    renderAnsweredOptions(data: AnsweredOptionViewData): void {
        const { option, checked, result } = data;

        this.#input.value = option.id.toString();
        this.#input.disabled = !isNil(result);
        this.#input.checked = checked;
        this.#text.textContent = option.text;

        if (isNil(result)) {
            this.setEmptyResult();
        }
        else {
            this.setResult(result);
        }
    }

    private setEmptyResult(): void {
        this.#message.textContent = '';
        hide(this.#message);
    }

    private setResult(result: Required<AnsweredOptionViewData>['result']): void {
        this.#label.classList.remove('option__label--success', 'option__label--error');
        this.#input.classList.remove('checkbox--success', 'checkbox--error', 'radio--success', 'radio--error');

        show(this.#message);
        this.#message.textContent = result.message;

        const modifier = result.ok ? 'success' : 'error';
        this.#label.classList.add(`option__label--${modifier}`);

        if (this.#input.classList.contains('checkbox')) {
            this.#input.classList.add(`checkbox--${modifier}`);
        }
        else if (this.#input.classList.contains('radio')) {
            this.#input.classList.add(`radio--${modifier}`);
        }
    }
}
