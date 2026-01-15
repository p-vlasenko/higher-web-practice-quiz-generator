import type { Renderer } from '@/types/base';
import type { ErrorDescription } from '@/types/view';
import { getFirstElementOrFail } from '@/utils/dom-utils';
import { ModalBrowserView } from './modal.view';
import { ErrorBrowserView } from './error.modal.view';

export const makeErrorView = (): Renderer<ErrorDescription> => {
    const errorModalRoot = getFirstElementOrFail('.modal_error');
    const errorElement = getFirstElementOrFail('.error');

    return new ErrorBrowserView({
        modalView: new ModalBrowserView({
            root: errorModalRoot,
            contentContainer: getFirstElementOrFail('.modal__content', errorModalRoot),
            closeButton: getFirstElementOrFail('.error__close-button', errorElement),
        }),
        errorElement,
    });
};
