import { QuizGameModel } from '@/components/models/quiz-game';
import { initDb } from '@/utils/storage';
import { makeChannels } from '@/messaging/channels.factory';
import { Either } from '@/utils/fp/tuple-based-either';
import { QuizGamePresenter } from '@/components/presenters/quiz-game.presernter';
import { getFirstElementOrFail, getTemplateFirstChild } from '@/utils/dom-utils';
import { ErrorLogger } from '@/components/error-logger';
import { isNil } from '@/utils/utils';
import { getUrlParam, navigateTo } from '@/utils/location.utils';
import { QuizSectionBrowserView } from '@view/quiz-section.view';
import { QuestionBrowserView } from '@view/queston.view';
import { QuizProgressBrowserView } from '@view/quiz-progress.view';
import { QuizGameResultBrowserView } from '@view/quiz-game-result.view';
import { QuizHeaderBrowserView } from '@view/quiz-header.veiw';
import { QuestionOptionsViewFactory } from '@/components/presenters/question-options-view.factory';
import type { Quiz } from '@/types/quiz';
import { BurgerBrowserView } from '@/components/view/burger.view';
import { makeErrorPresenter } from '@/components/presenters/presenter.factories';

const extractUrlQuizId = (): string => {
    const id = getUrlParam('id');

    if (isNil(id)) {
        navigateTo('./quizzes.html');
    }

    return id as string;
};

const quizId = extractUrlQuizId();

const quizSection = getFirstElementOrFail('.quiz');
const quizHeader = getFirstElementOrFail('.quiz__head', quizSection);
const quizProgress = getFirstElementOrFail('.quiz__progress', quizSection);
const quizContent = getFirstElementOrFail('.quiz__content', quizSection);

const channels = makeChannels();
const { errorChannel, eventChannel, commandChannel } = channels;
const db = await initDb();

const errorLogger = new ErrorLogger({ errorChannel });
errorLogger.init();

const quizGamePresenter = new QuizGamePresenter({
    questionOptionsViewFactory: new QuestionOptionsViewFactory({
        singleQuestionTemplate: getTemplateFirstChild('single-question-template'),
        multipleQuestionTemplate: getTemplateFirstChild('multiple-question-template'),
        radioOptionTemplate: getTemplateFirstChild('option-template'),
        checkboxOptionTemplate: getTemplateFirstChild('checkbox-option-template'),
    }),
    quizSectionView: new QuizSectionBrowserView(quizSection),
    quizProgressView: new QuizProgressBrowserView(quizProgress),
    questionView: new QuestionBrowserView({
        commandChannel,
        element: quizContent,
    }),
    quizGameResultView: new QuizGameResultBrowserView({
        element: getFirstElementOrFail('.quiz-result'),
    }),
    eventChannel,
    commandChannel,
    quizHeaderView: new QuizHeaderBrowserView(quizHeader),
});

const startQuiz = (quiz: Quiz) => {
    const quizGameModel = new QuizGameModel({ db, eventChannel, commandChannel, quiz });
    quizGamePresenter.init();
    quizGameModel.start();
};

const burgerView = new BurgerBrowserView({
    menu: getFirstElementOrFail('.burger-menu'),
});

const errorPresenter = makeErrorPresenter(channels.errorChannel);

errorPresenter.init();
burgerView.init();

await db.get(quizId).then(Either.match(
    err => errorChannel.emit('ERROR:QUIZ-GETTING', err),
    startQuiz,
));
