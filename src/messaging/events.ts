import type { Quiz } from '@/types';

export type QuizAddingParams = {
    quizJson: string;
};

export type QuizzesLoadedPayload = {
    quizzes: Quiz[];
};

export type EventsMap = {
    ['quizzes_loaded']: QuizzesLoadedPayload;
};
