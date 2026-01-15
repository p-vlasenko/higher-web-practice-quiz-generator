import { assert, isNil } from './utils';

export const addModifier = (className: string, modifier: string): string =>
    `${className}_${modifier}`;

export const getFirstElementOrFail = (
    selector: string,
    containerElement: ParentNode = document,
): HTMLElement => {
    const element = containerElement.querySelector(selector);
    assert(!isNil(element), `Element not found. Selector: ${selector}`);
    assert(element instanceof HTMLElement, `Element is not an HTMLElement. Selector: ${selector}`);

    return element as HTMLElement;
};

export const getTemplateFirstChild = <T extends HTMLElement = HTMLElement>(templateId: string): T => {
    const template = getTemplate(templateId);

    return (template.content.firstElementChild as T);
};

export const getTemplate = (templateId: string): HTMLTemplateElement => {
    const template = document.getElementById(templateId);
    assert(!isNil(template), `Template not found. templateId: ${templateId}`);
    assert(template instanceof HTMLTemplateElement, `Element is not a template. templateId: ${templateId}`);

    return template as HTMLTemplateElement;
};

export const setChildren = (container: HTMLElement, children: HTMLElement[]) => {
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    children.forEach(child => fragment.appendChild(child));
    container.appendChild(fragment);
};

export const show = (element: HTMLElement): void => {
    element.classList.remove('hidden');
};

export const hide = (element: HTMLElement): void => {
    element.classList.add('hidden');
};

export const cloneTemplate = <T extends HTMLElement = HTMLElement>(templateId: string): T => {
    const firstChild = getTemplateFirstChild(templateId);

    return firstChild.cloneNode(true) as T;
};
