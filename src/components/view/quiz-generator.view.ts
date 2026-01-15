import { Observable } from '@/utils/observable';
import type { QuizGeneratorView, QuizGeneratorViewEvents } from '../presenters/view.types';
import { getFirstElementOrFail } from '@/utils/dom-utils';
import { makeValidator, parseJsonObject } from '@/utils/validation';
import { quizSchema } from '@/schemas/quiz';
import { Either } from '@/utils/fp/tuple-based-either';

const validateQuizJson = makeValidator(quizSchema);

const safeParseQuizJson = (jsonString: string) =>
    Either.chain(validateQuizJson, parseJsonObject(jsonString));

export class QuizGeneratorBrowserView
    extends Observable<QuizGeneratorViewEvents>
    implements QuizGeneratorView {
    #form: HTMLFormElement;
    #textarea: HTMLTextAreaElement;

    constructor(element: HTMLElement) {
        super();

        this.#form = getFirstElementOrFail('.generator__form', element) as HTMLFormElement;
        this.#textarea = getFirstElementOrFail('#quiz-json-input', this.#form) as HTMLTextAreaElement;

        this.#initListeners();
    }

    clear(): void {
        this.#toValid();
        this.#textarea.value = '';
    }

    #initListeners(): void {
        this.#form.addEventListener('submit', event => {
            event.preventDefault();
            const validationResult = safeParseQuizJson(this.#textarea.value);
            Either.match(
                err => {
                    this.#toInvalid();
                    this.emit('validation_error', err);
                },
                quiz => this.emit('submit', { quiz }),
                validationResult,
            );
        });

        this.#textarea.addEventListener('input', () => {
            this.#toValid();
        });
    }

    #toValid(): void {
        this.#textarea.classList.remove('textarea_invalid');
    }

    #toInvalid(): void {
        this.#textarea.classList.add('textarea_invalid');
    }
}
