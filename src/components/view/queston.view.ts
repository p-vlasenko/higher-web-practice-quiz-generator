import type { CommandChannelDeps } from '@/messaging/types';
import type { QuestionView, QuestionViewEvents, RenderWithAnswerParams } from '../presenters/view.types';
import type { QuestionData } from '@/types/view';
import { Observable } from '@/utils/observable';
import { getFirstElementOrFail, show, hide } from '@/utils/dom-utils';

type Deps = CommandChannelDeps
  & {
      element: HTMLElement;
  };

export class QuestionBrowserView extends Observable<QuestionViewEvents> implements QuestionView {
    #questionContainer: HTMLElement;
    #form: HTMLFormElement;
    #submitButton: HTMLButtonElement;
    #forwardButton: HTMLButtonElement;

    constructor({ element }: Deps) {
        super();
        this.#questionContainer = getFirstElementOrFail('.quiz__question', element);
        this.#form = getFirstElementOrFail('.quiz__form', element) as HTMLFormElement;
        this.#submitButton = getFirstElementOrFail('.quiz__submit', element) as HTMLButtonElement;
        this.#forwardButton = getFirstElementOrFail('.quiz__next', element) as HTMLButtonElement;

        this.#initListeners();
    }

    render({ questionElement }: QuestionData): void {
        this.#questionContainer.replaceChildren(questionElement);
        show(this.#submitButton);
        hide(this.#forwardButton);
        this.#form.reset();
    }

    renderWithAnswer({ questionElement, forwardButtonText }: RenderWithAnswerParams): void {
        this.#questionContainer.replaceChildren(questionElement);
        hide(this.#submitButton);
        show(this.#forwardButton);
        this.#forwardButton.textContent = forwardButtonText;
        this.#disableInputs();
    }

    #disableInputs(): void {
        Array.from(this.#form.elements).forEach(element => {
            if (!(element instanceof HTMLButtonElement)) {
                (element as HTMLInputElement).disabled = true;
            }
        });
    }

    #initListeners(): void {
        this.#form.addEventListener('submit', event => {
            event.preventDefault();
            this.emit('submit', { selectedOptionIds: this.#extractSelectedOptionIds() });
        });

        this.#forwardButton.addEventListener('click', () => {
            this.emit('next_button_click', undefined);
        });
    }

    #extractSelectedOptionIds(): Set<number> {
        const optionIds = new FormData(this.#form)
            .getAll('question')
            .map(it => it.toString())
            .map(it => parseInt(it, 10));

        return new Set(optionIds);
    }
}
