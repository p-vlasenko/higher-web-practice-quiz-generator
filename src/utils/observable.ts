import { EventEmitter } from './event-emitter';

export class Observable<Events extends object> {
    #emitter = new EventEmitter<Events>();

    on<E extends keyof Events>(event: E, handler: (payload: Events[E]) => void): void {
        this.#emitter.on(event, handler);
    }

    protected emit<E extends keyof Events>(event: E, payload: Events[E]) {
        this.#emitter.emit(event, payload);
    };
}
