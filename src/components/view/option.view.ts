import type { AnsweredOptionViewData, OptionViewData } from '@/types/view';
import { getFirstElementOrFail, show, hide, addModifier } from '@/utils/dom-utils';
import { isNil } from '@/utils/utils';

const OK_MODIFIER = 'ok';
const ERR_MODIFIER = 'err';

export class OptionBrowserView {
    readonly element: HTMLElement;
    #input: HTMLInputElement;
    #label: HTMLLabelElement;
    #text: HTMLElement;
    #message: HTMLElement;

    #mainInputClass: 'checkbox' | 'radio';

    constructor(element: HTMLElement) {
        this.element = element;
        this.#input = getFirstElementOrFail('.option__input', element) as HTMLInputElement;
        this.#label = getFirstElementOrFail('.option__label', element) as HTMLLabelElement;
        this.#text = getFirstElementOrFail('.option__text', element);
        this.#message = getFirstElementOrFail('.option__message', element);
        this.#mainInputClass = this.#input.classList.contains('checkbox') ? 'checkbox' : 'radio';
    }

    renderOptions(data: OptionViewData): void {
        const { option } = data;

        this.#input.value = String(option.id);
        this.#input.disabled = false;
        this.#input.checked = false;

        this.#text.textContent = option.text;

        this.#setEmptyResult();
    }

    renderAnsweredOptions(data: AnsweredOptionViewData): void {
        const { option, checked, result } = data;

        this.#input.value = option.id.toString();
        this.#input.disabled = !isNil(result);
        this.#input.checked = checked;
        this.#text.textContent = option.text;

        if (isNil(result)) {
            this.#setEmptyResult();
        }
        else {
            this.#setResult(result);
        }
    }

    #setEmptyResult(): void {
        this.#message.textContent = '';
        hide(this.#message);
    }

    #setResult(result: Required<AnsweredOptionViewData>['result']): void {
        this.#resetInputModifiers();
        show(this.#message);
        this.#message.textContent = result.message;

        const modifier = result.ok ? OK_MODIFIER : ERR_MODIFIER;
        this.#label.classList.add(addModifier('option__label', modifier));
        this.#input.classList.add(addModifier(this.#mainInputClass, modifier));
    }

    #resetInputModifiers(): void {
        this.#label.classList.remove(
            addModifier('option__label', OK_MODIFIER),
            addModifier('option__label', ERR_MODIFIER),
        );
        this.#input.classList.remove(
            addModifier(this.#mainInputClass, OK_MODIFIER),
            addModifier(this.#mainInputClass, ERR_MODIFIER),
        );
    }
}
