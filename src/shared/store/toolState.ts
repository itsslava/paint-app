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
}

const toolState = new ToolState();
export default toolState;
