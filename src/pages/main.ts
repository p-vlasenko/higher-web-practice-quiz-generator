import { QuizGeneratorBrowserView } from '@view/quiz-generator.view';
import { QuizzesModel } from '@/components/models/quizzes';
import { QuizGeneratorPresenter } from '@/components/presenters/quiz-generator.presenter';
import { ErrorPresenter } from '@/components/presenters/error-presenter';
import { getFirstElementOrFail } from '@/utils/dom-utils';
import { initDb } from '@/utils/storage';
import { makeChannels } from '@/messaging/channels.factory';
import { ErrorLogger } from '@/components/error-logger';
import { ErrorBrowserView } from '@/components/view/error.view';
import { BurgerBrowserView } from '@/components/view/burger.view';

const db = await initDb();
const channels = makeChannels();

const quizzesModel = new QuizzesModel({ db, ...channels });

const quizGeneratorPresenter = new QuizGeneratorPresenter({
    generatorView: new QuizGeneratorBrowserView(getFirstElementOrFail('.generator')),
    ...channels,
});

const errorPresenter = new ErrorPresenter({
    errorView: new ErrorBrowserView(getFirstElementOrFail('#error-toast')),
    ...channels,
});

const errorLogger = new ErrorLogger(channels);

const burgerView = new BurgerBrowserView({
    menu: getFirstElementOrFail('.burger__menu'),
});

burgerView.init();
errorLogger.init();
quizzesModel.init();
quizGeneratorPresenter.init();
errorPresenter.init();
