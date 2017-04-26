/**
 * Types of messages supported by shoot
 * 
 * @enum {Number}
 * @readonly
 */
export const MessageType = {
	Unknown: 0,
	Status: 1,
	BatchDeclare: 2,
	DeclareField: 3,
	FieldValue: 4,
};

/**
 * Supported types of fields.
 * 
 * @enum {Number}
 * @readonly
 */
export const FieldType = {
	Unknown: 0,
	Range: 1,
	Color: 2,
	Select: 3,
	Bool: 4,
};


/**
 * @typedef {Object} Message
 * @property {MessageType} type
 */

/**
 * A set of field declarations
 * @typedef	{Message} BatchDeclare
 * @property {DeclareFieldMessage[]} messages
 */

/**
 * @param {DeclareFieldMessage[]} messages
 * @returns {BatchDeclare}
 */
export const batchDeclare = (messages) => ({ type: MessageType.Batch, messages });

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
 * A field is a configurable property.
 * 
 * @typedef {Object} Field
 * @property {FieldType} type - The type of the field
 * @property {String} label - The label for this field
 */

/**
 * A boolean field
 * 
 * @typedef {Field} BoolField
 * @property {Boolean} value - Default value
 */
export const boolField = (label, value) => ({ type: FieldType.Bool, label, value });

/**
 * A numeric field. Min and max can be missing to declare unbounded ranges.
 * 
 * @typedef {Field} RangeField
 * @property {Number} min - Minimum value
 * @property {Number} max - Maximum value
 * @property {Number} value - Default value
 */
export const rangeField = (label, min, max, value) => ({ type: FieldType.Range, label, min, max, value });

/**
 * @typedef {Field} ColorField
 * @property {Number} r - Red byte
 * @property {Number} g - Green byte
 * @property {Number} b - Blue byte
 */
export const colorField = (label, r, g, b) => ({ type: FieldType.Color, label, r, g, b });

/**
 * @typedef {Field} SelectField
 * @property {String[]} options - Possible options for the selection
 * @property {Number} selected - The index of the default selected option
 */
export const selectField = (label, options, selected = 0) => ({ type: FieldType.Select, label, options, selected });
