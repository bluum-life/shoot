import { FieldType } from './messages';
import { listener } from './util';

const OFF_VAL = 'Turn On';
const ON_VAL = 'Turn Off';

const hex = num => {
	const s = num.toString(16);
	return s.length === 1 ? `0${s}` : s;
}
const colorToHex = msg =>  `#${hex(msg.r)}${hex(msg.g)}${hex(msg.b)}`;
const hexToNum = val => {
	const x = parseInt(val.replace(/\D/, ''), 16);
	const r = (x >> 16) & 0xFF;
	const g = (x >> 8) & 0xFF;
	const b = x & 0xFF;
	return { r, g, b };
}

const parseVal = (fieldBase, val) => {
	switch (fieldBase.type) {
		case FieldType.Range:
			return Math.min(Math.max(fieldBase.src.min, +val), fieldBase.src.max);
		case FieldType.Color:
			return hexToNum(val);
		case FieldType.Select:
			return fieldBase.src.options.indexOf(val);
		case FieldType.Bool:
			return !!val;
		default:
			console.error(fieldBase, val);
	}
}

class FieldCtrl {
	constructor(fieldType, fieldBase) {
		this.type = fieldType;
		this.l = listener();
		this.value = fieldBase.value;
		this.fieldBase = fieldBase;

		this.l.map(x => {
			switch (x.type) {
				case 'change':
					return this.onChange(x)
			}
		});

		if (fieldType !== FieldType.Bool) {
			fieldBase.input.addEventListener('change', x => {
				this.value = parseVal(fieldBase, x.target.value);
				this.l.emit({ type: 'change', value: this.value, fieldType });
			});
		} else {
			fieldBase.input.addEventListener('click', () => {
				this.value = !this.value;
				this.l.emit({ type: 'change', value: this.value, fieldType });
			});
		}
	}

	listenInput(fn) {
		this.l.map(fn);
	}
	
	onChange(changes) {
		this.value = changes.value;
		switch (this.type) {
			case FieldType.Select:
				this.fieldBase.input.selectedIndex = this.value;
				break;
			case FieldType.Color:
				this.fieldBase.input.value = colorToHex(this.value);
				break;
			case FieldType.Range:
				this.fieldBase.input.value = this.value;
				break;
			case FieldType.Bool:
				this.fieldBase.input.textContent = this.value ? ON_VAL : OFF_VAL;
				break;
		}
	}
}


const base = (msg) => {
	const elt = document.createElement('div');
	elt.classList.add('field');
	const label = document.createElement('label');
	label.textContent = msg.label;
	elt.appendChild(label);
	return { elt, label, type: msg.type, src: msg };
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
	const field = getField(msg);
	
	const ctrl = new FieldCtrl(msg.type, field);
	
	return { field, ctrl };
};