import { FieldType } from './messages';

const base = (msg) => {
	const elt = document.createElement('div');
	elt.classList.add('field');
	const label = document.createElement('label');
	label.textContent = msg.label;
	elt.appendChild(label);
	return { elt, label };
}

const newInput = (msg) => {
	const b = base(msg);
	b.input = document.createElement('input');
	b.elt.appendChild(b.input);
	return b;
};

const newRangeField = (msg) => {
	const f = newInput(msg);
	
	f.input.setAttribute('name', msg.label);
	f.input.setAttribute('value', msg.value);
	f.input.setAttribute('min', msg.min);
	f.input.setAttribute('max', msg.max);
	f.input.setAttribute('type', 'number');

	return f;
};

const newColorField = (msg) => {
	const f = newInput(msg);
	return f;
};

const newSelectField = (msg) => {
	const b = base(msg);
	console.debug(msg);
	b.select = document.createElement('select');
	b.options = msg.options.map((option, i) => {
		const opt = document.createElement('option');
		opt.value = option;
		opt.textContent = option;
		if (i === msg.selected) {
			opt.setAttribute('selected', true);
		}
		b.select.appendChild(opt);
		return opt;
	});
	b.elt.appendChild(b.select);
	return b;
};

const newBoolField = (msg) => {
	const f = newInput(msg);
	return f;
};

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
		case FieldType.Select:
			return newSelectField(msg);
		case FieldType.Bool:
			return newBoolField(msg);
		default:
			console.error('Unhandled', msg);
	}
};
