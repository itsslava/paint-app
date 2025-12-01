import type { Tool } from '@shared/tools';
import { makeAutoObservable } from 'mobx';

export type ToolType = 'brush' | 'rectangle' | 'circle' | 'line' | 'eraser';

class ToolState {
	tool: Tool | null = null;
	activeTool: ToolType | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	setTool(tool: Tool | null, toolKey: ToolType | null) {
		if (this.tool) {
			this.tool.destroy();
		}

		this.tool = tool;
		this.activeTool = toolKey;
	}

	setActiveTool(toolKey: ToolType | null) {
		this.activeTool = toolKey;
	}

	setStrokeColor(color: string) {
		if (this.tool) {
			this.tool.strokeColor = color;
		}
	}
	setFillColor(color: string) {
		if (this.tool) {
			this.tool.fillColor = color;
		}
	}
	setLineWidth(width: number) {
		if (!this.tool) return;
		if (!Number.isFinite(width) || width <= 0) return;

		this.tool.lineWidth = width;
	}
}

const toolState = new ToolState();
export default toolState;
