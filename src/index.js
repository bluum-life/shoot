// MOCKING
import * as mocks from './mock';
console.debug('First mock test: ', mocks);
const sock = mocks.sock;

// END MOCKS
// import * as sock from './socket';
import { MessageType, batch } from './messages';
import * as ser from './serialize';
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
		case MessageType.Batch:
				return msg.messages.forEach(newRouter(api));
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
			const data = ser.deserializeMessage(evt.data);
			router(data);
		} catch (err) {
			console.error('Parse error: ', err);
		}
	};

	ws.onerror = (error) => {
		console.error('Sock error: ', error);
	}

	// @todo: hacking api buffer
	const view = new DataView(new ArrayBuffer(6*8)); // 6 bytes (?)
	view.setUint8(0, 10);
	view.setUint8(1, 20);
	view.setFloat32(2, Math.PI); // 32/8 = 4 bytes, 4 + 2 = 6, we're full

	// Register to api listener l
	api.l.map(evt => {
		console.debug('!!! Root api listener', evt);
		// ws.send(JSON.stringify(evt));
		// // @todo: womp womp
		// ws.send(view.buffer);
	});

	///////// @todo: remove mock kickoff
	mocks.firstTest();
	mocks.rootServer.broadcast(batchDeclare(mocks.firstCmds));
});
