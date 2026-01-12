import type { Handler } from '@/types';
import { asArray } from './utils';

type MakeEmitter = <MessageMap extends object>() => EventEmitter<MessageMap>;

export const makeEventEmitter: MakeEmitter = () => new EventEmitter();

export class EventEmitter<MessageMap extends object> {
    #handlers = new Map<keyof MessageMap, Set<Handler<MessageMap>>>();
    #allEventsHandler = new Set<Handler<MessageMap>>();

    /** Публикует событие */
    emit<T extends keyof MessageMap>(eventName: T, payload: MessageMap[T]) {
        this.#getHandlers(eventName).forEach(handle => handle(payload));
    }

    /**
     * Добавляет обработчик события
     */
    on<T extends keyof MessageMap>(eventName: T | T[], handler: Handler<MessageMap, T>) {
        asArray(eventName).forEach(evt => {
            if (!this.#handlers.has(evt)) {
                this.#handlers.set(evt, new Set());
            }

            this.#handlers.get(evt)?.add(handler as Handler<MessageMap, keyof MessageMap>);
        });
    }

    /**
     * Снимает обработчик события
     */
    off<T extends keyof MessageMap>(eventName: T, handler: Handler<MessageMap, T>) {
        const handlers = this.#handlers.get(eventName);
        handlers?.delete(handler as Handler<MessageMap, keyof MessageMap>);

        if (this.#handlers.get(eventName)?.size === 0) {
            this.#handlers.delete(eventName);
        }
    }

    /**
     *  Добавляет обработчик любого события
     */
    onAll(handler: Handler<MessageMap>) {
        this.#allEventsHandler.add(handler);
    }

    /**
     * Сбрасывает все обработчики
     */
    reset() {
        this.#handlers = new Map();
        this.#allEventsHandler = new Set();
    }

    #getHandlers(eventName: keyof MessageMap): Handler<MessageMap>[] {
        return [...this.#allEventsHandler, ...(this.#handlers.get(eventName) || new Set())];
    }
}
