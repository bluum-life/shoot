import * as messages from './messages';
import { concatBuffer } from './util';

const ID_SIZE = 1;
const TYPE_SIZE = 1;
const LENGTH_SIZE = 1;

/**
 * Helper to stream values to an array buffer.
 * @param {Number} length - Number of bytes to stream into
 * @returns {Any} - Helper with .set(offset, byte) => helper for chain and .value() => buffer
 */
const stream = length => {
	const buffer = new ArrayBuffer(length);
	const view = new DataView(buffer);
	const out = {};
	out.set8 = (offset, val) => (view.setUint8(offset, val), out);
	out.set32 = (offset, val) => (view.setUint32(offset, val), out);
	out.value = () => buffer;
	return out;
}

/**
 * FieldValue header format.
 * @size 3
 * @uint8 msgType: MessageType
 * @uint8 fieldType: FieldType
 * @uint8 fieldId: Number
 */
export const fieldValueHeader = (msg) => stream(3)
	.set8(0, msg.type)
	.set8(1, msg.fieldType)
	.set8(2, msg.id)
	.value();

/**
 * Based on field type, serializes value.
 * @param {Message<FieldValue>}
 */
export const fieldValueBody = (msg) => {
	switch (msg.fieldType) {
		
		/**
		 * @size 4
		 * @uint32 value: Number
		 */
		case messages.FieldType.Range:
			return stream(4)
				.set32(0, msg.value)
				.value();
		
		/**
		 * @size 3
		 * @uint8 red: Number
		 * @uint8 green: Number
		 * @uint8 blue: Number
		 */
		case messages.FieldType.Color:
			return stream(3)
				.set8(0, msg.value.r)
				.set8(1, msg.value.g)
				.set8(2, msg.value.b)
				.value();

		/**
		 * @size 1
		 * @uint8 selectedIndex: Number
		 */
		case messages.FieldType.Select:
			return stream(1)
				.set8(0, msg.value)
				.value();
		
		/**
		 * @size 1
		 * @uint8 value: Boolean
		 */
		case messages.FieldType.Bool:
			return stream(1)
				.set8(0, msg.value)
				.value();

		default:
			console.debug('@todo: Serialize FieldValue', msg);
			return new ArrayBuffer();
	}
}



/**
 * Serialize a message to send to the server
 * @param {Message} messages
 * @returns {ArrayBuffer}
 */
export const serializeMessage = (msg) => {
	// @todo: send a message to the server
	switch (msg.type) {
		// case messages.MessageType.BatchDeclare: {
		// 	// type, length, ...messages
		// 	const base = stream(TYPE_SIZE + LENGTH_SIZE)
		// 		.set8(0, messages.MessageType.BatchDeclare)
		// 		.set8(1, msg.messages.length)
		// 		.value();
		// 	console.debug(msg);
		// 	return msg.messages.reduce((buff, x) =>
		// 		concatBuffer(buff, serializeMessage(x)),
		// 		base
		// 	);
		// }

		// case messages.MessageType.Status:
		// 	console.debug('@todo: Serialize Status', msg);
		// 	return new ArrayBuffer();

		// Serialize as: [type, id, field]
		// case messages.MessageType.DeclareField: {
		// 	const base = stream(TYPE_SIZE + ID_SIZE)
		// 		.set8(0, messages.MessageType.DeclareField)
		// 		.set8(1, msg.id)
		// 		.value();
		// 	const fieldBuff = serializeField(msg.field);
		// 	return concatBuffer(base, fieldBuff);
		// }

		case messages.MessageType.FieldValue:
			return concatBuffer(
				fieldValueHeader(msg),
				fieldValueBody(msg)
			);

		default:
			console.debug(msg);
			throw new Error('Unknown message type.');
	}
};

/**
 * Deserialize a field message
 * @param {ArrayBuffer} msg
 * @returns {Field}
 */
export const deserializeField = (msg) => {
	const view = new DataView(msg);
	const type = view.getUint8(0);
	switch (type) {
		case messages.FieldType.Range:
			console.debug('@todo: deserialize range', msg);
			return messages.rangeField();
		
		case messages.FieldType.Color:
			console.debug('@todo: serialize color', msg);
			return messages.colorField();
		
		case messages.FieldType.Select:
			console.debug('@todo: serialize select', msg);
			return messages.selectField();
		
		// Deserialize as [type, value, label]
		case messages.FieldType.Bool: {
			const value = view.getUint8(1);
			// const label = @todo: parse label
			return messages.boolField('', value);
		}

		default:
			console.debug(msg);
			throw new Error('Unknown field type.');
	}
}

/**
 * Deserialize a message to the app
 * @param {ArrayBuffer} messages
 * @returns {Message}
 */
export const deserializeMessage = (msg) => {
	const view = new DataView(msg);
	// Read the type
	const type = view.getUint8(0);
	switch (type) {
		// [type, length, ...messages]
		case messages.MessageType.BatchDeclare: {
			const length = view.getUint8(1);
			const list = [];
			let subBuffer = msg.slice(2);
			for (let i = 0; i < length; i++) {
				const f = deserializeMessage(subBuffer);
				list.push(f);
				console.debug('@todo: slice down based on length consumed!!! New msg?: ', list);
				// @todo: slice down based on length?
				subBuffer = subBuffer.slice(serializeFieldSize(f.type));
			}
			return messages.batchDeclare(list);
		}

		case messages.MessageType.Status: {
			console.debug('MessageType.status', view);
			return {};
		}

		// Deserialize as  [type id, field]
		case messages.MessageType.DeclareField: {
			const id = view.getUint8(1);
			const field = deserializeField(msg.slice(2));
			return messages.declareField(id, field);
		}

		case messages.MessageType.FieldValue: {
			console.debug('FieldValue declare', view);
			return messages.fieldValue();
		}

		default:
			console.error('Unknown message type', type, view);
	}
};
