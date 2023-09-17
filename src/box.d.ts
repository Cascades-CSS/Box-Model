export class BoxModel {
	constructor (parent: HTMLElement);

	get content (): [number, number];
	set content (value: [number, number]);

	get padding (): [number, number, number, number];
	set padding (value: [number, number, number, number]);

	get border (): [number, number, number, number];
	set border (value: [number, number, number, number]);

	get margin (): [number, number, number, number];
	set margin (value: [number, number, number, number]);

	get position (): [number, number, number, number];
	set position (value: [number, number, number, number]);

	get parent (): HTMLElement;
	set parent (value: HTMLElement);

	get allowOverlap (): boolean;
	set allowOverlap (value: boolean);

	update (): void;
}