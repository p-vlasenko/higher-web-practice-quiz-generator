import type { QuizAddingParams } from '@/messaging/commands';
import type { Observable } from '@/utils/observable';

export type QuizGeneratorViewEvents = {
    ['submit']: QuizAddingParams;
};

export type QuizGeneratorView = Observable<QuizGeneratorViewEvents> & {
    toValid(): void;
    toInvalid(): void;
};
