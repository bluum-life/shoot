/**
 * In order to reduce strings over the wire
 * becase they're annoying
 * because it sucks
 * I'm defining root's fields here.
 * 
 * To get off the ground, at least.
 * 
 * I should switch to protobuf or cap'n'proto...
 */
import * as msg from './messages';



/**
 * Crown first pass fields:
 * 
 * Colors::::
 * Color pallete: selection drop down, rainbow 1 and rainbow 2
 * Solid color: color
 * 
 * Modes::::
 * Static: Select field for none, cycle, and fade
 * Triggered: Boolean for sparkle, full color/fade, and runner
 * 
 * Brightness:::: Number, 0 -> 255
 */

// Declare the fields @todo: sync this with root
const declareFirstPass = msg.batchDeclare([
	// Settings
	msg.declareField(0, msg.boolField('Power', true)),
	msg.declareField(1, msg.rangeField('Brightness', 1, 255, 255)),
	
	// Colors
	msg.declareField(2, msg.selectField('Color Mode', ['Pattern', 'Solid'], 1)),
	msg.declareField(3, msg.selectField('Pattern', ['Rainbow'], 1)),
	msg.declareField(4, msg.colorField('Solid', 114, 0, 255)),
	
	// Effects
	msg.declareField(5, msg.selectField('Static Effect', ['None', 'Cycle', 'Fader'], 1)),
	msg.declareField(6, msg.boolField('Sparkles', false)),
	msg.declareField(7, msg.boolField('Pop-fade', false)),
	msg.declareField(8, msg.boolField('Runner', false)),
]);
