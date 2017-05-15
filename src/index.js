// MOCKING
// import * as mocks from './mock';
// console.debug('First mock test: ', mocks);
// const sock = mocks.sock;
// END MOCKS

import * as sock from './socket';
import { MessageType, batchDeclare, FieldType, fieldValue } from './messages';
import { deserializeMessage, serializeMessage } from './serialize';
import { bootstrap } from './doc';
import { v0fields } from './fixedFields';


// API
import { buildField } from './fields';
import { listener } from './util';
class RootApi {
	constructor(doc, parent) {
		this.fields = {};

		// Configure
		this.elt = doc.createElement('div')

		this.fieldsElt = doc.createElement('div');
		this.fieldsElt.classList.add('fields');

		// Add to dom
		parent.appendChild(this.elt);
		this.elt.appendChild(this.fieldsElt);
		
		this.l = listener();
	}

	declareField(id, msg) {
		if (this.fields[id]) {
			console.error('Existing field: ', id, msg);
		} else {
			this.fields[id] = buildField(msg);
			this.fieldsElt.appendChild(this.fields[id].field.elt);
			this.fields[id].ctrl.listenInput(event => {
				this.l.emit({
					id,
					type: event.type,
					value: event.value,
					fieldType: event.fieldType,
				});
			});
		}
	}
}


/**
 * Consume and route a message from the board
 * @param {Message} msg
 * @void
 */
const newRouter = api => msg => {
	console.info('Message received: ', msg);
	switch (msg.type) {
		case MessageType.BatchDeclare:
				return msg.messages.forEach(newRouter(api));
		case MessageType.DeclareField:
			return api.declareField(msg.id, msg.field);
		default:
			console.error('Unhandled message.', msg);
	}
};


// Code to run once the document is bootstrapped
bootstrap((doc) => {
	
	// Init DOM
	doc.querySelector('.loading-display').remove();

	// Make app
	const api = new RootApi(doc, doc.body);
	const router = newRouter(api);

	// Create the WS connection -- for now, assume same as host
	const ws = sock.connect(location.hostname);
	ws.onmessage = (evt) => {
		console.info('WS event: ', evt);
		try {
			const data = deserializeMessage(evt.data);
			router(data);
		} catch (err) {
			console.error('Parse error: ', err);
		}
	};

	ws.onerror = (error) => {
		console.error('Sock error: ', error);
	}

	// Register to api listener
	api.l.map(evt => {
		switch (evt.type) {
			case 'change':
				const out = serializeMessage(fieldValue(evt.fieldType, evt.id, evt.value));
				console.debug('Bytes: ', new Uint8Array(out));
				ws.send(out);
				break;
			default:
				console.debug('Unhandled input: ', evt)
		}
	});
	
	// Register v0 fields @todo: better versioning of messages/app.
	v0fields.map(router);
});
