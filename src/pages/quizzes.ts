import { QuizzesModel } from '@models/quizzes';
import { getFirstElementOrFail, getTemplateFirstChild } from '../utils/dom-utils';
import { initDb } from '@/utils/storage';
import { makeChannels } from '@/messaging/channels.factory';
import { ErrorLogger } from '@/components/error-logger';
import { QuizzesBrowserView } from '@/components/view/quizzes.view';
import { QuizCardBrowserViewFactory } from '@/components/view/quiz-card-view.factory';
import { QuizzesPresenter } from '@/components/presenters/quizzes.presernter';
import { BurgerBrowserView } from '@/components/view/burger.view';
import { makeErrorPresenter } from '@/components/presenters/presenter.factories';

const channels = makeChannels();

const errorLogger = new ErrorLogger(channels);
errorLogger.init();

const db = await initDb();
const quizzesModel = new QuizzesModel({ db, ...channels });

const presenter = new QuizzesPresenter({
    quizCardFactory: new QuizCardBrowserViewFactory({
        quizCardTemplate: getTemplateFirstChild('quiz-card-template'),
    }),
    quizzesView: new QuizzesBrowserView(),
    ...channels,
});

const burgerView = new BurgerBrowserView({
    menu: getFirstElementOrFail('.burger-menu'),
});

const errorPresenter = makeErrorPresenter(channels.errorChannel);

errorPresenter.init();
burgerView.init();
quizzesModel.init();
presenter.init();
quizzesModel.loadQuizzes();
