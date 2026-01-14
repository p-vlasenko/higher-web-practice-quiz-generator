import { QuestionOptionsBrowserView } from '@view/question-options.view';
import { OptionBrowserView } from '@/components/view/option.view';
import type { Question } from '@/types/quiz';
import type { QuizAnswerResult } from '@/messaging/events';

type Deps = {
    singleQuestionTemplate: HTMLElement;
    multipleQuestionTemplate: HTMLElement;
    radioOptionTemplate: HTMLElement;
    checkboxOptionTemplate: HTMLElement;
};

export class QuestionOptionsViewFactory {
    #singleQuestionTemplate: HTMLElement;
    #multipleQuestionTemplate: HTMLElement;
    #radioOptionTemplate: HTMLElement;
    #checkboxOptionTemplate: HTMLElement;

    constructor({
        singleQuestionTemplate,
        multipleQuestionTemplate,
        radioOptionTemplate,
        checkboxOptionTemplate,
    }: Deps) {
        this.#singleQuestionTemplate = singleQuestionTemplate;
        this.#multipleQuestionTemplate = multipleQuestionTemplate;
        this.#radioOptionTemplate = radioOptionTemplate;
        this.#checkboxOptionTemplate = checkboxOptionTemplate;
    }

    makeQuestionOptionsView(question: Question): QuestionOptionsBrowserView {
        return this.#makeQuestionOptionView({
            question,
            optionViews: this.#makeOptionViews(question),
        });
    }

    makeAnsweredQuestionOptionsView(params: {
        question: Question;
        selectedOptions: Set<number>;
        details: QuizAnswerResult['details'];
    }): QuestionOptionsBrowserView {
        const {
            question,
            selectedOptions,
            details,
        } = params;

        const optionViews = this.#makeAnsweredOptionViews({
            question,
            selectedOptions,
            details,
        });

        return this.#makeQuestionOptionView({
            question,
            optionViews,
        });
    }

    #makeQuestionOptionView(
        { question, optionViews }: { question: Question; optionViews: OptionBrowserView[] },
    ): QuestionOptionsBrowserView {
        const { type, text } = question;
        const questionElement = this.#getQuestionElement(type);
        const questionView = new QuestionOptionsBrowserView(questionElement);
        questionView.render({ optionElements: optionViews.map(it => it.element), text });

        return questionView;
    }

    #getQuestionElement(questionType: Question['type']): HTMLElement {
        return questionType === 'single'
            ? this.#singleQuestionTemplate.cloneNode(true) as HTMLElement
            : this.#multipleQuestionTemplate.cloneNode(true) as HTMLElement;
    }

    #getOptionElement(questionType: Question['type']): HTMLElement {
        return questionType === 'single'
            ? this.#radioOptionTemplate.cloneNode(true) as HTMLElement
            : this.#checkboxOptionTemplate.cloneNode(true) as HTMLElement;
    }

    #makeOptionViews({ options, type }: Question): OptionBrowserView[] {
        const optionElement = this.#getOptionElement(type);

        return options.map(option => {
            const optionView = new OptionBrowserView(optionElement.cloneNode(true) as HTMLElement);
            optionView.renderOptions({ option });

            return optionView;
        });
    }

    #makeAnsweredOptionViews({ question: { options, type }, selectedOptions, details }: {
        question: Question;
        selectedOptions: Set<number>;
        details: QuizAnswerResult['details'];
    }): OptionBrowserView[] {
        const optionElement = this.#getOptionElement(type);

        return options.map(option => {
            const optionView = new OptionBrowserView(optionElement.cloneNode(true) as HTMLElement);

            optionView.renderAnsweredOptions({
                option,
                checked: selectedOptions.has(option.id),
                result: details.get(option.id),
            });

            return optionView;
        });
    }
}
