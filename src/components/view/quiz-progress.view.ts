import type { Renderer } from '@/types/base';
import type { Progress } from '@/types/view';
import { getFirstElementOrFail } from '@/utils/dom-utils';

export class QuizProgressBrowserView implements Renderer<Progress> {
    private progressText: HTMLElement;
    private progressBar: HTMLProgressElement;

    constructor(element: HTMLElement) {
        this.progressText = getFirstElementOrFail('.quiz__progress-text', element);
        this.progressBar = getFirstElementOrFail('.quiz__progress-bar', element) as HTMLProgressElement;
    }

    render({ total, currentIndex }: Progress): void {
        this.progressBar.max = total;
        this.progressBar.value = currentIndex + 1;
        this.progressText.textContent = `Вопрос ${currentIndex + 1} из ${total}`;
    }
}
