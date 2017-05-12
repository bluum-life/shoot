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
	out.set = (offset, val) => (view.setUint8(offset, val), out);
	out.value = () => buffer;
	return out;
}

const serializeFieldSize = fieldType => 2;

// I didn't use protobuf because js libs are >20k :/

/**
 * Serialize a field into bytes for transport
 * @param {Field} field
 * @returns {ArrayBuffer} 
 */
// export const serializeField = (field) => {
// 	switch (field.type) {
// 		case messages.FieldType.Range:
// 			console.debug('@todo: serialize range', field);
// 			return new ArrayBuffer(0);
		
// 		case messages.FieldType.Color:
// 			console.debug('@todo: serialize color', field);
// 			return new ArrayBuffer(0);
		
// 		case messages.FieldType.Select:
// 			console.debug('@todo: serialize select', field);
// 			return new ArrayBuffer(0);
		
// 		// type, value, label
// 		case messages.FieldType.Bool: {
// 			const val = stream(TYPE_SIZE + 1)
// 				.set(0, messages.FieldType.Bool)
// 				.set(1, field.value)
// 				.value();
// 			return concatBuffer(val, strBuff(field.label));
// 		}

// 		default:
// 			console.debug(field);
// 			throw new Error('Unknown field type.');
// 	}
// }

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
		// 		.set(0, messages.MessageType.BatchDeclare)
		// 		.set(1, msg.messages.length)
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
		// 		.set(0, messages.MessageType.DeclareField)
		// 		.set(1, msg.id)
		// 		.value();
		// 	const fieldBuff = serializeField(msg.field);
		// 	return concatBuffer(base, fieldBuff);
		// }

		case messages.MessageType.FieldValue:
			console.debug('@todo: Serialize FieldValue', msg);
			return new ArrayBuffer();

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
