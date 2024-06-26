import type { Theme } from './config';

export class BoxModel {
	constructor (parent: HTMLElement);

	element: HTMLDivElement;

	get content (): [number, number, number, number];
	set content (value: [number, number, number, number]);

	get padding (): [number, number, number, number];
	set padding (value: [number, number, number, number]);

	get border (): [number, number, number, number];
	set border (value: [number, number, number, number]);

	get margin (): [number, number, number, number];
	set margin (value: [number, number, number, number]);

	get live (): boolean;
	set live (value: boolean);

	get position (): [number, number, number, number];
	set position (value: [number, number, number, number]);

	get theme (): Theme;
	set theme (value: Theme);

	get parent (): HTMLElement;
	set parent (value: HTMLElement);

	get showBorders (): boolean;
	set showBorders (value: boolean);

	get showDimensions (): boolean;
	set showDimensions (value: boolean);

	get showLabels (): boolean;
	set showLabels (value: boolean);

	get allowOverlap (): boolean;
	set allowOverlap (value: boolean);

	updateFromElement (element: HTMLElement): void;
}
