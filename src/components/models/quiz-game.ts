import type { OptionDetails, QuizAnswerResult } from '@/messaging/events';
import type { Channels } from '@/messaging/types';
import type { QuizStorage } from '@/types/base';
import type { Question, QuestionOption, Quiz } from '@/types/quiz';
import { isNil } from '@/utils/utils';

type Deps = Pick<Channels, 'eventChannel' | 'commandChannel'> & {
    db: QuizStorage;
    quiz: Quiz;
};

export class QuizGameModel {
    #eventChannel: Channels['eventChannel'];
    #commandChannel: Channels['commandChannel'];

    #quiz: Quiz;
    #questionIndex: number;
    #correctAnswers: number;
    #done: boolean;

    constructor({ eventChannel, commandChannel, quiz }: Deps) {
        this.#quiz = quiz;
        this.#eventChannel = eventChannel;
        this.#commandChannel = commandChannel;

        this.#questionIndex = 0;
        this.#correctAnswers = 0;
        this.#done = false;
    }

    start(): void {
        this.#commandChannel.on('add_answer', ({ selectedOptionIds }) => {
            this.addAnswer(selectedOptionIds);
        });

        this.#commandChannel.on('move_to_next_question', () => {
            this.moveToNextQuestion();
        });

        this.#commandChannel.on('restart_quiz_game', () => {
            this.restart();
        });

        this.#eventChannel.emit('quiz_started', { quiz: this.#quiz });
        this.#publishQuestion();
    }

    addAnswer(selectedOptionIds: Set<number>): void {
        if (this.#done) {
            return;
        };

        const question = this.#quiz.questions[this.#questionIndex];

        if (!question) {
            return;
        };

        const result = this.#getResult(question, selectedOptionIds);

        if (result.ok) {
            this.#correctAnswers += 1;
        }

        const isLast = this.#questionIndex >= this.#quiz.questions.length - 1;
        this.#eventChannel.emit('question_answered', { question, selectedOptionIds, result, isLast });
    }

    moveToNextQuestion(): void {
        if (this.#done) {
            return;
        };

        const hasNext = this.#questionIndex < this.#quiz.questions.length - 1;

        if (!hasNext) {
            this.#finish();
        }
        else {
            this.#questionIndex += 1;
            this.#publishQuestion();
        }
    }

    restart(): void {
        this.#reset();
        this.#publishQuestion();
    }

    #finish(): void {
        this.#done = true;

        this.#eventChannel.emit('quiz_finished', {
            correct: this.#correctAnswers,
            total: this.#quiz.questions.length,
        });
    }

    #reset(): void {
        this.#questionIndex = 0;
        this.#correctAnswers = 0;
        this.#done = false;
    }

    #publishQuestion(): void {
        const question = this.#getCurrentQuestion();

        if (isNil(question)) {
            return;
        };

        this.#eventChannel.emit('question_ready', {
            question,
            currentIndex: this.#questionIndex,
            total: this.#quiz.questions.length,
        });
    }

    #getCurrentQuestion(): Question | undefined {
        return this.#quiz.questions[this.#questionIndex];
    }

    #getCorrectOptionIds(question: Question): Set<number> {
        return new Set(question.options.filter(it => it.correct).map(it => it.id));
    }

    #getResult(question: Question, selectedOptionIds: Set<number>): QuizAnswerResult {
        const correctIds = this.#getCorrectOptionIds(question);

        const ok = selectedOptionIds.size === correctIds.size
          && [...selectedOptionIds].every(id => correctIds.has(id));

        const resultOptions = question.options.filter(option => option.correct || selectedOptionIds.has(option.id));
        const details = new Map(resultOptions.map(option => [option.id, getDetails(option)]));

        return { ok, details };
    }
}

const getDetails = (option: QuestionOption): OptionDetails => ({
    message: option.message,
    ok: option.correct,
});
