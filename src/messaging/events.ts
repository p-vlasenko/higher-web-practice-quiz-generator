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
    ['QUIZZES:LOADED']: QuizzesLoadedPayload;
    ['QUIZ:ADDED']: { quiz: Quiz };
    ['QUIZ-GAME:STARTED']: { quiz: Quiz };
    ['QUIZ-GAME:QUESTION:READY']: {
        question: Question;
        currentIndex: number;
        total: number;
    };
    ['QUIZ-GAME:QUESTION:ANSWERED']: {
        question: Question;
        result: QuizAnswerResult;
        selectedOptionIds: Set<number>;
        isLast: boolean;
    };
    ['QUIZ-GAME:FINISHED']: QuizResult;
};
