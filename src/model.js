import { Box, ContentBox } from './box.js';
import { boxStyles, boxVariables, themeVariables } from './config.js';
import { parseValue } from './utilities.js';

export class BoxModel {
	element;
	#boxes = {
		content: new ContentBox('Content'),
		padding: new Box('Padding', 'padding'),
		border: new Box('Border', 'border'),
		margin: new Box('Margin', 'margin'),
		position: new Box('Position', 'position')
	};
	#live = false;
	#parent;
	#showDimensions = true;
	#showLabels = true;
	#spacing = {
		default: 14,
		value: 14
	}
	#targetElement;
	#theme = 'auto';
	#themeQuery;

	constructor (parent) {
		this.parent = parent;
	}

	get content () { return this.#boxes.content.dimensions; }
	set content (value) { this.#boxes.content.update(value); }

	get padding () { return this.#boxes.padding.dimensions; }
	set padding (value) { this.#boxes.padding.update(value); }

	get border () { return this.#boxes.border.dimensions; }
	set border (value) { this.#boxes.border.update(value); }

	get margin () { return this.#boxes.margin.dimensions; }
	set margin (value) { this.#boxes.margin.update(value); }

	get live () { return this.#live; }
	set live (value) {
		this.#live = value;
		value && window.requestAnimationFrame(this.updateFromElement.bind(this, this.#targetElement));
	}

	get position () { return this.#boxes.position.dimensions; }
	set position (value) { this.#boxes.position.update(value); }

	get theme () { return this.#theme; }
	set theme (value) {
		this.#theme = value.toLowerCase();
		this.#updateTheme();
	}

	get parent () { return this.#parent; }
	set parent (value) {
		this.#parent = value;
		// Create the root element.
		this.element?.remove();
		this.element = document.createElement('div');
		this.element.className = 'boxModelDisplay';
		Object.assign(this.element.style, boxStyles);
		for (const [property, value] of Object.entries(themeVariables)) {
			this.element.style.setProperty(property, value);
		}
		this.#updateTheme();
		// Assemble the boxes.
		this.#parent.append(this.element);
		this.element.append(this.#boxes.position.element);
		this.#boxes.position.element.append(this.#boxes.margin.element);
		this.#boxes.margin.element.append(this.#boxes.border.element);
		this.#boxes.border.element.append(this.#boxes.padding.element);
		this.#boxes.padding.element.append(this.#boxes.content.element);
	}

	get allowOverlap () { return !Boolean(this.#spacing.value); }
	set allowOverlap (value) {
		if (this.allowOverlap === value) return;
		this.#spacing.value = value ? 0 : this.#spacing.default;
		for (const box of Object.values(this.#boxes)) {
			box.spacing = this.#spacing.value;
			box.update(box.dimensions, true);
		}
	}

	get showBorders () { return this.#boxes.content.showBorders; }
	set showBorders (value) {
		if (this.showBorders === value) return;
		this.#boxes.content.showBorders = value;
		this.#boxes.padding.showBorders = value;
		this.#boxes.border.showBorders = value;
		this.#boxes.margin.showBorders = value;
		this.#boxes.position.showBorders = value;
	}

	get showDimensions () { return this.#showDimensions; }
	set showDimensions (value) {
		if (this.#showDimensions === value) return;
		this.#showDimensions = value;
		const opacity = value ? '1' : '0';
		this.#boxes.content.labels[0].style.opacity = opacity;
		this.#boxes.content.labels[1].style.opacity = opacity;
		for (let i = 0; i < 4; i++) {
			this.#boxes.padding.labels[i].style.opacity = opacity;
			this.#boxes.border.labels[i].style.opacity = opacity;
			this.#boxes.margin.labels[i].style.opacity = opacity;
			this.#boxes.position.labels[i].style.opacity = opacity;
		}
	}

	get showLabels () { return this.#showLabels; }
	set showLabels (value) {
		if (this.#showLabels === value) return;
		this.#showLabels = value;
		const opacity = value ? '1' : '0';
		this.#boxes.content.labels[this.#boxes.content.labels.length - 1].style.opacity = opacity;
		this.#boxes.padding.labels[this.#boxes.padding.labels.length - 1].style.opacity = opacity;
		this.#boxes.border.labels[this.#boxes.border.labels.length - 1].style.opacity = opacity;
		this.#boxes.margin.labels[this.#boxes.margin.labels.length - 1].style.opacity = opacity;
		this.#boxes.position.labels[this.#boxes.position.labels.length - 1].style.opacity = opacity;
	}

	updateFromElement (element) {
		if (!(element instanceof HTMLElement)) return;
		this.#targetElement = element;
		const styles = window.getComputedStyle(this.#targetElement);
		this.content = [parseValue(styles.width), parseValue(styles.height)];
		this.padding = [parseValue(styles.paddingTop), parseValue(styles.paddingRight), parseValue(styles.paddingBottom), parseValue(styles.paddingLeft)];
		this.border = [parseValue(styles.borderTopWidth), parseValue(styles.borderRightWidth), parseValue(styles.borderBottomWidth), parseValue(styles.borderLeftWidth)];
		this.margin = [parseValue(styles.marginTop), parseValue(styles.marginRight), parseValue(styles.marginBottom), parseValue(styles.marginLeft)];
		this.position = [parseValue(styles.top), parseValue(styles.right), parseValue(styles.bottom), parseValue(styles.left)];
		if (this.#live) window.requestAnimationFrame(this.updateFromElement.bind(this, this.#targetElement));
	}

	#updateTheme () {
		this.#themeQuery ??= window.matchMedia('(prefers-color-scheme: dark)');
		this.#themeQuery.onchange ??= (query) => {
			let thing1 = this.#theme;
			if (this.#theme === 'auto') {
				thing1 = query?.matches ? 'dark' : 'light';
			}
			for (const variable of boxVariables) {
				this.element.style.setProperty(variable, `var(${variable}-${thing1})`);
			}
		}
		this.#themeQuery.onchange(this.#themeQuery);
	}
}
