import * as msg from './messages';

const fields = {
	baseColor: msg.colorField(0xFF00FF),
	effects: msg.selectionField(['A', 'B', 'C'], 2),
};

export const firstTest = [
	msg.declareField(0, fields.baseColor),
	msg.declareField(1, fields.effects),
].map(x => JSON.stringify(x));
