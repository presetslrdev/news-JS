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
    private visibleSources: readonly Source[] = [];
    private activeId: string = '';
    private highlighted: number = -1;
    private initialized: boolean = false;
    private onSelect: OnSelectCallback | null = null;

    public setOnSelect(cb: OnSelectCallback): void {
        this.onSelect = cb;
    }

    public draw(data: readonly Source[]): void {
        this.allSources = data;
        this.visibleSources = data;
        requireElement<HTMLButtonElement>('.sources__toggle').disabled = false;
        requireElement('.sources__toggle-text').textContent = this.activeId
            ? requireElement('.sources__toggle-text').textContent
            : 'Select a source';
        this.renderList();
        if (!this.initialized) {
            this.initDropdown();
            this.initialized = true;
        }
    }

    public showError(message: string): void {
        const toggle = requireElement<HTMLButtonElement>('.sources__toggle');
        toggle.disabled = true;
        requireElement('.sources__toggle-text').textContent = `Sources unavailable: ${message}`;
    }

    private renderList(): void {
        const list = requireElement<HTMLUListElement>('.sources__list');
        list.innerHTML = '';

        if (this.visibleSources.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'sources__empty';
            empty.textContent = 'No sources found';
            list.appendChild(empty);
            return;
        }

        this.visibleSources.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'source__item';
            li.id = `source-option-${index}`;
            li.dataset.sourceId = item.id;
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', String(item.id === this.activeId));
            li.classList.toggle('source__item--active', item.id === this.activeId);

            const avatar = document.createElement('span');
            avatar.className = 'source__avatar';
            avatar.setAttribute('aria-hidden', 'true');
            avatar.textContent = item.name.charAt(0).toUpperCase();
            avatar.style.background = getAvatarColor(item.name);

            const name = document.createElement('span');
            name.className = 'source__item-name';
            name.textContent = item.name;

            li.append(avatar, name);
            list.appendChild(li);
        });

        this.highlight(-1);
    }

    private highlight(index: number): void {
        const search = requireElement<HTMLInputElement>('.sources__search');
        const items = requireElement('.sources__list').querySelectorAll<HTMLElement>('.source__item');
        this.highlighted = index;
        items.forEach((el, i) => el.classList.toggle('source__item--highlight', i === index));

        if (index >= 0 && items[index]) {
            search.setAttribute('aria-activedescendant', items[index].id);
            items[index].scrollIntoView({ block: 'nearest' });
        } else {
            search.removeAttribute('aria-activedescendant');
        }
    }

    private select(source: Source): void {
        const same = source.id === this.activeId;
        this.activeId = source.id;
        requireElement('.sources__toggle-text').textContent = source.name;
        this.closeDropdown();
        requireElement<HTMLButtonElement>('.sources__toggle').focus();
        if (!same) this.onSelect?.(source.id);
    }

    private openDropdown(): void {
        const search = requireElement<HTMLInputElement>('.sources__search');
        requireElement('.sources__dropdown').classList.add('sources__dropdown--open');
        requireElement('.sources__toggle').setAttribute('aria-expanded', 'true');
        search.value = '';
        this.visibleSources = this.allSources;
        this.renderList();
        const activeIndex = this.visibleSources.findIndex((s) => s.id === this.activeId);
        if (activeIndex >= 0) this.highlight(activeIndex);
        search.focus();
    }

    private closeDropdown(): void {
        requireElement('.sources__dropdown').classList.remove('sources__dropdown--open');
        requireElement('.sources__toggle').setAttribute('aria-expanded', 'false');
    }

    private isOpen(): boolean {
        return requireElement('.sources__dropdown').classList.contains('sources__dropdown--open');
    }

    private initDropdown(): void {
        const wrapper = requireElement('.sources');
        const toggle = requireElement<HTMLButtonElement>('.sources__toggle');
        const search = requireElement<HTMLInputElement>('.sources__search');

        toggle.addEventListener('click', () => (this.isOpen() ? this.closeDropdown() : this.openDropdown()));

        search.addEventListener('input', () => {
            const query = search.value.trim().toLowerCase();
            this.visibleSources = this.allSources.filter((s) => s.name.toLowerCase().includes(query));
            this.renderList();
            if (query && this.visibleSources.length > 0) this.highlight(0);
        });

        search.addEventListener('keydown', (e) => {
            const count = this.visibleSources.length;
            if (e.key === 'ArrowDown' && count) {
                e.preventDefault();
                this.highlight((this.highlighted + 1) % count);
            } else if (e.key === 'ArrowUp' && count) {
                e.preventDefault();
                this.highlight(this.highlighted <= 0 ? count - 1 : this.highlighted - 1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const source = this.visibleSources[this.highlighted];
                if (source) this.select(source);
            }
        });

        requireElement('.sources__list').addEventListener('click', (e) => {
            if (!(e.target instanceof Element)) return;
            const item = e.target.closest<HTMLElement>('.source__item');
            const source = this.visibleSources.find((s) => s.id === item?.dataset.sourceId);
            if (source) this.select(source);
        });

        document.addEventListener('click', (e) => {
            if (e.target instanceof Node && !wrapper.contains(e.target)) this.closeDropdown();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.closeDropdown();
                toggle.focus();
            }
        });
    }
}

export default Sources;
