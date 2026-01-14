import type { Renderer } from '@/types/base';
import type { QuestionOptionsData } from '@/types/view';
import { getFirstElementOrFail } from '@/utils/dom-utils';

export class QuestionOptionsBrowserView implements Renderer<QuestionOptionsData> {
    readonly element: HTMLElement;
    #questionText: HTMLElement;
    #optionsContainer: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
        this.#questionText = getFirstElementOrFail('.question__text', element);
        this.#optionsContainer = getFirstElementOrFail('.question__options', element);
    }

    render(data: QuestionOptionsData): void {
        this.#questionText.textContent = data.text;
        this.#optionsContainer.replaceChildren(...data.optionElements);
    }
}
