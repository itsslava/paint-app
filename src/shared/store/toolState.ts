import type { Tool } from '@shared/tools';
import { makeAutoObservable } from 'mobx';

class ToolState {
	tool: Tool | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	setTool(tool: Tool) {
		this.tool = tool;
	}
}

const toolState = new ToolState();
export default toolState;
