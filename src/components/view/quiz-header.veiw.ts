import type { Renderer } from '@/types/base';
import type { QuizHeadViewData } from '@/types/view';
import { getFirstElementOrFail } from '@/utils/dom-utils';

export class QuizHeaderBrowserView implements Renderer<QuizHeadViewData> {
    #title: HTMLElement;
    #description: HTMLElement;

    constructor(element: HTMLElement) {
        this.#title = getFirstElementOrFail('.quiz__title', element);
        this.#description = getFirstElementOrFail('.quiz__description', element);
    }

    render(data: QuizHeadViewData): void {
        this.#title.textContent = data.title;
        this.#description.textContent = data.description;
    }
}
