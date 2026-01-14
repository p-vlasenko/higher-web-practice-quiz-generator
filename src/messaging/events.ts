import type { OptionId, Question, Quiz } from '@/types/quiz';

export type QuizAddingParams = {
    quizJson: string;
};

export type QuizzesLoadedPayload = {
    quizzes: Quiz[];
};

export type OptionDetails = {
    message: string;
    ok: boolean;
};

export type QuizResult = {
    correct: number;
    total: number;
};

export type QuizAnswerResult = {
    ok: boolean;
    details: Map<OptionId, OptionDetails>;
};

export type EventsMap = {
    ['quizzes_loaded']: QuizzesLoadedPayload;
    ['quiz_added']: { quiz: Quiz };
    ['quiz_started']: { quiz: Quiz };
    ['question_ready']: {
        question: Question;
        currentIndex: number;
        total: number;
    };
    ['question_answered']: {
        question: Question;
        result: QuizAnswerResult;
        selectedOptionIds: Set<number>;
        isLast: boolean;
    };
    ['quiz_finished']: QuizResult;
};
