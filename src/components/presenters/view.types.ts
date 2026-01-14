import type { QuizAddingParams, SelectedOptions } from '@/messaging/commands';
import type { Observable } from '@/utils/observable';
import type { ResultInfo } from './types';
import type { JsonParsingError } from '@/errors/json-parsing.error';
import type { ValidationError } from '@/errors/validation.error';
import type { Quiz, QuizId } from '@/types/quiz';
import type { Renderable, Renderer } from '@/types/base';
import type { QuestionData } from '@/types/view';

export type QuizCardViewEvents = {
    ['start_quiz_click']: { quizId: QuizId };
};

export type QuizCardView = Observable<QuizCardViewEvents>
  & Renderable
  & Renderer<Quiz>;

export type QuizzesView = Observable<QuizCardViewEvents>
  & Renderer<QuizCardView[]>
  & { clear(): void };

export type QuizGeneratorViewEvents = {
    ['submit']: QuizAddingParams;
    ['validation_error']: JsonParsingError | ValidationError;
};

export type QuizGeneratorView = Observable<QuizGeneratorViewEvents> & {
    clear(): void;
};

export type QuizGameResultViewEvents = {
    ['restart']: undefined;
};

export type QuizGameResultView = Renderer<ResultInfo> & Observable<QuizGameResultViewEvents>;

export type QuestionViewEvents = {
    ['submit']: SelectedOptions;
    ['next_button_click']: undefined;
};

export type RenderWithAnswerParams = QuestionData & { forwardButtonText: string };

export type QuestionView = Renderer<QuestionData> & Observable<QuestionViewEvents> & {
    renderWithAnswer(params: RenderWithAnswerParams): void;
};

export type QuizCardFactory = {
    make(quiz: Quiz): QuizCardView;
};
