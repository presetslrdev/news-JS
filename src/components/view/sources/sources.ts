import './sources.css';
import { Source } from '../../../types';
import { requireElement } from '../../../utils/dom';

const AVATAR_COLORS = ['#5ad67d', '#30c5ff', '#ff6b6b', '#ffa94d', '#a78bfa', '#34d399', '#f472b6', '#60a5fa'];

function getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

type OnSelectCallback = (sourceId: string) => void;

class Sources {
    private allSources: readonly Source[] = [];
    private activeId: string = '';
    private onSelect: OnSelectCallback | null = null;

    public setOnSelect(cb: OnSelectCallback): void {
        this.onSelect = cb;
    }

    public draw(data: readonly Source[]): void {
        this.allSources = data;
        this.renderList(data);
        this.initDropdown();
    }

    private renderList(sources: readonly Source[]): void {
        const list = requireElement<HTMLUListElement>('.sources__list');
        list.innerHTML = '';

        if (sources.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'sources__empty';
            empty.textContent = 'No sources found';
            list.appendChild(empty);
            return;
        }

        sources.forEach((item) => {
            const li = document.createElement('li');
            li.className = 'source__item' + (item.id === this.activeId ? ' source__item--active' : '');
            li.setAttribute('data-source-id', item.id);
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', String(item.id === this.activeId));

            const avatar = document.createElement('span');
            avatar.className = 'source__avatar';
            avatar.textContent = item.name.charAt(0).toUpperCase();
            avatar.style.background = getAvatarColor(item.name);

            const name = document.createElement('span');
            name.className = 'source__item-name';
            name.textContent = item.name;

            li.appendChild(avatar);
            li.appendChild(name);
            list.appendChild(li);
        });
    }

    private initDropdown(): void {
        const wrapper = requireElement('.sources');
        const toggle = requireElement<HTMLButtonElement>('.sources__toggle');
        const dropdown = requireElement('.sources__dropdown');
        const search = requireElement<HTMLInputElement>('.sources__search');

        toggle.addEventListener('click', () => {
            const isOpen = dropdown.classList.contains('sources__dropdown--open');
            dropdown.classList.toggle('sources__dropdown--open', !isOpen);
            toggle.setAttribute('aria-expanded', String(!isOpen));
            if (!isOpen) {
                search.value = '';
                this.renderList(this.allSources);
                search.focus();
            }
        });

        search.addEventListener('input', () => {
            const query = search.value.trim().toLowerCase();
            const filtered = this.allSources.filter((s) => s.name.toLowerCase().includes(query));
            this.renderList(filtered);
        });

        // Клик по источнику — делегирование на список
        requireElement('.sources__list').addEventListener('click', (e) => {
            const target = (e.target as HTMLElement).closest<HTMLElement>('.source__item');
            if (!target) return;
            const id = target.getAttribute('data-source-id') ?? '';
            this.setActive(id, target.querySelector<HTMLElement>('.source__item-name')?.textContent ?? id);
            this.closeDropdown(toggle, dropdown);
            if (id) this.onSelect?.(id);
        });

        // Закрытие по клику вне
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target as Node)) {
                this.closeDropdown(toggle, dropdown);
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeDropdown(toggle, dropdown);
        });
    }

    private setActive(id: string, label: string): void {
        this.activeId = id;
        requireElement('.sources__toggle-text').textContent = label;
        // Обновляем активный класс в текущем списке
        requireElement('.sources__list')
            .querySelectorAll<HTMLElement>('.source__item')
            .forEach((el) => {
                const active = el.getAttribute('data-source-id') === id;
                el.classList.toggle('source__item--active', active);
                el.setAttribute('aria-selected', String(active));
            });
    }

    private closeDropdown(toggle: HTMLButtonElement, dropdown: HTMLElement): void {
        dropdown.classList.remove('sources__dropdown--open');
        toggle.setAttribute('aria-expanded', 'false');
    }
}

export default Sources;
