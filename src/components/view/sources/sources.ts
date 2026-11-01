import './sources.css';
import { Source } from '../../../types';
import { requireElement } from '../../../utils/dom';

const AVATAR_COLORS = ['#f59e0b', '#38bdf8', '#34d399', '#f472b6', '#a78bfa', '#fb7185', '#fbbf24', '#2dd4bf'];

function getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

type OnSelectCallback = (sourceId: string, sourceName: string) => void;

class Sources {
    private allSources: readonly Source[] = [];
    private filteredSources: readonly Source[] = [];
    private activeCategory: string = 'all';
    private activeId: string = '';
    private highlighted: number = -1;
    private initialized: boolean = false;
    private onSelect: OnSelectCallback | null = null;

    public setOnSelect(cb: OnSelectCallback): void {
        this.onSelect = cb;
    }

    public draw(data: readonly Source[]): void {
        this.allSources = data;
        this.applyFilter();

        const toggle = requireElement<HTMLButtonElement>('.sources__toggle');
        toggle.disabled = false;

        if (this.allSources.length > 0 && !this.activeId) {
            const firstSource = this.allSources[0];
            this.select(firstSource, true);
        }

        if (!this.initialized) {
            this.initEvents();
            this.initialized = true;
        }
    }

    public showError(message: string): void {
        const toggle = requireElement<HTMLButtonElement>('.sources__toggle');
        toggle.disabled = true;
        requireElement('.sources__toggle-text').textContent = `Sources unavailable: ${message}`;
        requireElement('#sourcesCount').textContent = 'Error';
    }

    public getActiveSource(): Source | undefined {
        return this.allSources.find((s) => s.id === this.activeId);
    }

    private applyFilter(searchQuery: string = ''): void {
        let list = this.allSources;

        if (this.activeCategory !== 'all') {
            list = list.filter((s) => s.category.toLowerCase() === this.activeCategory);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter(
                (s) =>
                    s.name.toLowerCase().includes(q) ||
                    s.description.toLowerCase().includes(q) ||
                    s.category.toLowerCase().includes(q)
            );
        }

        this.filteredSources = list;
        this.updateCountBadge();
        this.renderList();
    }

    private updateCountBadge(): void {
        const badge = requireElement('#sourcesCount');
        const count = this.filteredSources.length;
        badge.textContent = `${count} ${count === 1 ? 'source' : 'sources'}`;
    }

    private renderList(): void {
        const list = requireElement<HTMLUListElement>('.sources__list');
        list.innerHTML = '';

        if (this.filteredSources.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'sources__empty';
            empty.textContent = 'No matching newsrooms found';
            list.appendChild(empty);
            return;
        }

        this.filteredSources.forEach((item, index) => {
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
            avatar.style.backgroundColor = getAvatarColor(item.name);

            const info = document.createElement('div');
            info.className = 'source__info';

            const name = document.createElement('span');
            name.className = 'source__item-name';
            name.textContent = item.name;

            const categoryTag = document.createElement('span');
            categoryTag.className = 'source__item-category';
            categoryTag.textContent = item.category;

            info.append(name, categoryTag);
            li.append(avatar, info);
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

    private select(source: Source, notify: boolean = true): void {
        const isSame = source.id === this.activeId;
        this.activeId = source.id;

        requireElement('.sources__toggle-text').textContent = source.name;
        const avatar = requireElement('#sourcesToggleAvatar');
        avatar.textContent = source.name.charAt(0).toUpperCase();
        avatar.style.backgroundColor = getAvatarColor(source.name);

        this.closeDropdown();

        if (notify || !isSame) {
            this.onSelect?.(source.id, source.name);
        }
    }

    private openDropdown(): void {
        const search = requireElement<HTMLInputElement>('.sources__search');
        requireElement('.sources__dropdown').classList.add('sources__dropdown--open');
        requireElement('.sources__toggle').setAttribute('aria-expanded', 'true');
        search.value = '';
        this.applyFilter('');

        const activeIndex = this.filteredSources.findIndex((s) => s.id === this.activeId);
        if (activeIndex >= 0) {
            this.highlight(activeIndex);
        }
        search.focus();
    }

    private closeDropdown(): void {
        requireElement('.sources__dropdown').classList.remove('sources__dropdown--open');
        requireElement('.sources__toggle').setAttribute('aria-expanded', 'false');
    }

    private isOpen(): boolean {
        return requireElement('.sources__dropdown').classList.contains('sources__dropdown--open');
    }

    private initEvents(): void {
        const wrapper = requireElement('.sources');
        const toggle = requireElement<HTMLButtonElement>('.sources__toggle');
        const search = requireElement<HTMLInputElement>('.sources__search');

        // Toggle click
        toggle.addEventListener('click', () => (this.isOpen() ? this.closeDropdown() : this.openDropdown()));

        // Category pills filter
        const categoryButtons = document.querySelectorAll<HTMLButtonElement>('.category-pill');
        categoryButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                categoryButtons.forEach((b) => {
                    b.classList.remove('category-pill--active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('category-pill--active');
                btn.setAttribute('aria-selected', 'true');

                this.activeCategory = btn.dataset.category || 'all';
                search.value = '';
                this.applyFilter();

                // Auto-select first source of selected category if available
                if (this.filteredSources.length > 0) {
                    const currentStillVisible = this.filteredSources.some((s) => s.id === this.activeId);
                    if (!currentStillVisible) {
                        this.select(this.filteredSources[0]);
                    }
                }
            });
        });

        // Search input
        search.addEventListener('input', () => {
            this.applyFilter(search.value);
            if (this.filteredSources.length > 0) {
                this.highlight(0);
            }
        });

        // Keyboard navigation
        search.addEventListener('keydown', (e) => {
            const count = this.filteredSources.length;
            if (e.key === 'ArrowDown' && count > 0) {
                e.preventDefault();
                this.highlight((this.highlighted + 1) % count);
            } else if (e.key === 'ArrowUp' && count > 0) {
                e.preventDefault();
                this.highlight(this.highlighted <= 0 ? count - 1 : this.highlighted - 1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const source = this.filteredSources[this.highlighted];
                if (source) this.select(source);
            }
        });

        // List item click delegation
        requireElement('.sources__list').addEventListener('click', (e) => {
            if (!(e.target instanceof Element)) return;
            const item = e.target.closest<HTMLElement>('.source__item');
            if (!item) return;
            const source = this.filteredSources.find((s) => s.id === item.dataset.sourceId);
            if (source) this.select(source);
        });

        // Outside click to close
        document.addEventListener('click', (e) => {
            if (e.target instanceof Node && !wrapper.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.closeDropdown();
                toggle.focus();
            }
        });
    }
}

export default Sources;
