import { FieldType } from './messages';

const newRangeField = (msg) => {
	console.debug(msg);
};

const newColorField = (msg) => console.debug('@todo', msg);
const newSelectField = (msg) => console.debug('@todo', msg);
const newBoolField = (msg) => console.debug('@todo', msg);

/**
 * @param {DeclareFieldMessage} msg
 * @returns {Field}
 */
export const buildField = (msg) => {
	switch (msg.type) {
		case FieldType.Range:
			return newRangeField(msg);
		case FieldType.Color:
			return newColorField(msg);
		case FieldType.Selection:
			return newSelectField(msg);
		case FieldType.Bool:
			return newBoolField(msg);
		default:
			throw new Error(`Unhandled: ${msg}`);
	}
};
