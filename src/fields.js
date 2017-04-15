import { FieldType } from './messages';

export const listener = () => {
	const registry = [];
	const map = (fn) => {
		registry.push(fn);
		return () => {
			const i = registry.indexOf(fn);
			if (i !== -1) {
				registry.splice(i, 1);
			}
		}
	}

	const emit = (msg) => {
		registry.forEach(fn => fn(msg));
	};

	return { registry, map, emit };
}

class FieldCtrl {
	constructor(type, b) {
		this.type = type;
		this.l = listener();
		
		if (type !== FieldType.Bool) {
			b.input.addEventListener('change', x =>
				this.l.emit({
					type: 'change',
					value: x.target.value
				})
			);
		} else {
			b.input.addEventListener('click', this.l.emit);
		}
	}
	
	listenInput(fn) {
		this.l.add('input', fn);
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
	return { elt, label };
}

const newInput = (msg) => {
	const b = base(msg);
	b.input = document.createElement('input');
	b.elt.appendChild(b.input);
	return b;
};

const newRangeField = (msg) => {
	const b = newInput(msg);
	
	b.input.setAttribute('name', msg.label);
	b.input.setAttribute('value', msg.value);
	b.input.setAttribute('min', msg.min);
	b.input.setAttribute('max', msg.max);
	b.input.setAttribute('type', 'number');

	return b;
};

const newColorField = (msg) => {
	const b = newInput(msg);
	
	b.input.setAttribute('type', 'color');
	b.input.setAttribute('value', colorToHex(msg));
	
	return b;
};

const newSelectField = (msg) => {
	const b = base(msg);
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
	b.input = document.createElement('button');
	b.input.textContent = msg.value ? 'Turn Off' : 'Turn On';
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
	const f = getField(msg);
	
	const ctrl = new FieldCtrl(msg.type, f);
	
	return { f, ctrl };
};