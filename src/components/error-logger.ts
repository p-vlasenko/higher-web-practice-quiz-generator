import type { ErrorChannel } from '@/messaging/types';

type Deps = {
    errorChannel: ErrorChannel;
};

export class ErrorLogger {
    #errorChanel: ErrorChannel;

    constructor({ errorChannel }: Deps) {
        this.#errorChanel = errorChannel;
    }

    init() {
        this.#errorChanel.onAll(() => {
            // console.error(error); debugging purposes only
        });
    }
}
