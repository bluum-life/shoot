import { FieldType } from './messages';
import { listener } from './util';

const OFF_VAL = 'Turn On';
const ON_VAL = 'Turn Off';

class FieldCtrl {
	constructor(type, fieldBase) {
		this.type = type;
		this.l = listener();
		this.value = fieldBase.value;

		if (type !== FieldType.Bool) {
			fieldBase.input.addEventListener('change', x =>
				this.l.emit({
					type: 'change',
					value: x.target.value
				})
			);
		} else {
			fieldBase.input.addEventListener('click', () => {
				this.l.emit({
					type: 'change',
					value: !this.value
				});
			});
		}
	}

	listenInput(fn) {
		this.l.map(fn);
	}
	
	onChange(changes) {
		console.debug('Changes: ', changes);
	}
}


const hex = num => {
	const s = num.toString(16);
	return s.length === 1 ? `0${s}` : s;
}
const colorToHex = msg =>  `#${hex(msg.r)}${hex(msg.g)}${hex(msg.b)}`;
const base = (msg) => {
	const elt = document.createElement('div');
	elt.classList.add('field');
	const label = document.createElement('label');
	label.textContent = msg.label;
	elt.appendChild(label);
	return { elt, label, type: msg.type };
}

const newInput = (msg) => {
	const b = base(msg);
	b.input = document.createElement('input');
	b.elt.appendChild(b.input);
	return b;
};

const newRangeField = (msg) => {
	const b = newInput(msg);
	b.value = msg.value;
	b.input.setAttribute('name', msg.label);
	b.input.setAttribute('value', b.value);
	b.input.setAttribute('min', msg.min);
	b.input.setAttribute('max', msg.max);
	b.input.setAttribute('type', 'number');

	return b;
};

const newColorField = (msg) => {
	const b = newInput(msg);
	b.value = { r: msg.r, g: msg.g, b: msg.b };
	b.input.setAttribute('type', 'color');
	b.input.setAttribute('value', colorToHex(b.value));
	
	return b;
};

const newSelectField = (msg) => {
	const b = base(msg);
	b.value = msg.selected;
	b.input = document.createElement('select');
	b.options = msg.options.map((option, i) => {
		const opt = document.createElement('option');
		opt.value = option;
		opt.textContent = option;
		if (i === msg.selected) {
			opt.setAttribute('selected', true);
		}
		b.input.appendChild(opt);
		return opt;
	});
	b.elt.appendChild(b.input);
	return b;
};

const newBoolField = (msg) => {
	const b = base(msg);
	b.value = msg.value;
	b.input = document.createElement('button');
	b.input.textContent = b.value ? ON_VAL : OFF_VAL;
	b.elt.appendChild(b.input);
	return b;
};

/**
 * @param {DeclareFieldMessage} msg
 * @returns {Field}
 */
export const getField = (msg) => {
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

export const buildField = (msg) => {
	console.debug('Field: ', msg);
	const field = getField(msg);
	
	const ctrl = new FieldCtrl(msg.type, field);
	
	return { field, ctrl };
};