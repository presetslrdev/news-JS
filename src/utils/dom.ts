export function requireElement<T extends HTMLElement = HTMLElement>(selector: string, root: ParentNode = document): T {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Element not found: ${selector}`);
    return element;
}

export function getTemplate(template: HTMLTemplateElement): DocumentFragment {
    return template.content.cloneNode(true) as DocumentFragment;
}
