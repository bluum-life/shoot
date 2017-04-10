/**
 * Types of messages supported by shoot
 * 
 * @enum {Number}
 * @readonly
 */
export const MessageType = {
	DeclareField: 0,
	FieldValue: 1,
};

/**
 * @typedef {Object} Message
 * @property {MessageType} type
 */

/**
 * @typedef {Message} DeclareFieldMessage
 * @property {MessageType} type - MessageType.DeclareField
 * @property {Number} id - The id of the field
 * @property {Field} field - The field definition
 */
export const declareField = (id, field) => ({ type: MessageType.DeclareField, id, field });

/**
 * @typedef {Message} FieldValueMessage
 * @property {MessageType} type - MessageType.FieldValue
 * @property {Number} id - The field id whose value you are receiving
 * @property {String|Number} value - The value to place in that field, type based on field type
 */
export const fieldValue = (id, value) => ({ type: MessageType.FieldValue, id, value });

/**
 * Supported types of fields.
 * 
 * @enum {Number}
 * @readonly
 */
export const FieldType = {
	Range: 0,
	Color: 1,
	Selection: 2,
};

/**
 * A field is a configurable property.
 * 
 * @typedef {Object} Field
 * @property {FieldType} type - The type of the field
 * @property {String} label - The label for this field
 */

/**
 * A numeric field. Min and max can be missing to declare unbounded ranges.
 * 
 * @typedef {Field} RangeField
 * @property {Number} min - Minimum value
 * @property {Number} max - Maximum value
 * @property {Number} value - Default value
 */
export const rangeField = (min, max, value) => ({ type: FieldType.Range, min, max, value });

/**
 * @typedef {Field} ColorField
 * @property {Number} value - The color in an integer field -- 0xRRGGBB
 */
export const colorField = (value) => ({ type: FieldType.Color, value });

/**
 * @typedef {Field} SelectionField
 * @property {String[]} options - Possible options for the selection
 * @property {Number} selected - The index of the default selected option
 */
export const selectionField = (options, selected = 0) => ({ type: FieldType.Selection, options, selected });
