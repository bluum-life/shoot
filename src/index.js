// MOCKING
import * as mocks from './mock';
console.debug('First mock test: ', mocks);
const sock = mocks.sock;

// END MOCKS
// import * as sock from './socket';
import { MessageType } from './messages';
import { bootstrap } from './doc';


// API
import { buildField, listener } from './fields';
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
			this.fieldsElt.appendChild(this.fields[id].f.elt);
			this.fields[id].ctrl.l.map(this.l.emit);
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
		case MessageType.DeclareField:
			return api.declareField(msg.id, msg.field);
		default:
			console.error('Unhandled message.', msg);
	}
};


// Code to run once the document is bootstrapped
bootstrap((doc) => {
	console.info('LOADED', doc.body);
	
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
			const data = JSON.parse(evt.data);
			router(data);
		} catch (err) {
			console.error('Parse error: ', err);
		}
	};
	
	// Register to api
	api.l.map(evt => {
		console.debug(evt);
	});

	///////// @todo: remove mock kickoff
	mocks.firstTest();
});
