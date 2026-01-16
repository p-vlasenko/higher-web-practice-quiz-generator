import type { Channels } from '@/messaging/types';

import type { QuestionView, QuizGameResultView } from '../view/view.types';
import type { QuizSectionBrowserView } from '@view/quiz-section.view';
import type { QuizProgressBrowserView } from '@view/quiz-progress.view';
import type { QuizHeaderBrowserView } from '@view/quiz-header.veiw';
import type { QuizAnswerResult, QuizResult } from '@/messaging/events';
import { formatResult } from './format-result-info';
import type { QuestionOptionsViewFactory } from './question-options-view.factory';
import type { Question } from '@/types/quiz';

type Deps = Pick<Channels, 'commandChannel' | 'eventChannel'> & {
    quizSectionView: QuizSectionBrowserView;
    quizProgressView: QuizProgressBrowserView;
    questionView: QuestionView;
    quizGameResultView: QuizGameResultView;
    quizHeaderView: QuizHeaderBrowserView;
    questionOptionsViewFactory: QuestionOptionsViewFactory;
};

const QUESTION_URL_PARAM = 'question';

export class QuizGamePresenter {
    #quizSectionView: QuizSectionBrowserView;
    #quizProgressView: QuizProgressBrowserView;
    #questionView: QuestionView;
    #quizHeaderView: QuizHeaderBrowserView;
    #resultView: QuizGameResultView;
    #eventChannel: Channels['eventChannel'];
    #commandChannel: Channels['commandChannel'];
    #questionOptionsViewFactory: QuestionOptionsViewFactory;

    constructor({
        quizSectionView,
        quizProgressView,
        questionView,
        quizGameResultView,
        eventChannel,
        commandChannel,
        quizHeaderView,
        questionOptionsViewFactory,
    }: Deps) {
        this.#quizSectionView = quizSectionView;
        this.#quizProgressView = quizProgressView;
        this.#questionView = questionView;
        this.#resultView = quizGameResultView;
        this.#eventChannel = eventChannel;
        this.#commandChannel = commandChannel;
        this.#quizHeaderView = quizHeaderView;
        this.#questionOptionsViewFactory = questionOptionsViewFactory;
    }

    init(): void {
        this.#questionView.on('submit', payload => {
            this.#commandChannel.emit('QUIZ-GAME:QUESTION:ANSWER', payload);
        });

        this.#questionView.on('next_button_click', () => {
            this.#commandChannel.emit('QUIZ-GAME:QUESTION:NEXT', undefined);
        });

        this.#resultView.on('restart', () => {
            this.#quizSectionView.show();
            this.#commandChannel.emit('QUIZ-GAME:RESTART', undefined);
        });

        this.#eventChannel.on('quiz_started', ({ quiz: { title, description, questions } }) => {
            this.#quizHeaderView.render({ title, description });
            this.#quizProgressView.render({ currentIndex: 0, total: questions.length });
        });

        this.#eventChannel.on(
            'question_ready',
            ({ question, currentIndex, total }) => {
                this.#quizSectionView.show();
                this.#quizProgressView.render({ currentIndex, total });
                this.#renderQuestion(question);
                this.#setUrlQuestion(currentIndex);
            });

        this.#eventChannel.on('question_answered', ({ question, result, selectedOptionIds, isLast }) => {
            this.#renderAnsweredQuestion(question, selectedOptionIds, result, isLast);
        });

        this.#eventChannel.on('quiz_finished', result => {
            this.#quizSectionView.hide();
            this.#renderResultInfo(result);
            this.#removeUrlQuestion();
        });
    }

    #setUrlQuestion(index: number) {
        const params = new URLSearchParams(window.location.search);
        params.set(QUESTION_URL_PARAM, String(index + 1));
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }

    #removeUrlQuestion() {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete(QUESTION_URL_PARAM);
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }

    #renderResultInfo(result: QuizResult): void {
        this.#resultView.render(formatResult(result));
    }

    #renderQuestion(question: Question) {
        const questionView = this.#questionOptionsViewFactory.makeQuestionOptionsView(question);

        this.#questionView.render({ questionElement: questionView.element });
    }

    #renderAnsweredQuestion(
        question: Question,
        answer: Set<number>,
        result: QuizAnswerResult,
        isLast: boolean,
    ) {
        const questionView = this.#questionOptionsViewFactory.makeAnsweredQuestionOptionsView({
            question,
            selectedOptions: answer,
            details: result.details,
        });

        this.#questionView.renderWithAnswer({
            questionElement: questionView.element,
            forwardButtonText: isLast ? 'Завершить тест' : 'Следующий вопрос',
        });
    }
}
