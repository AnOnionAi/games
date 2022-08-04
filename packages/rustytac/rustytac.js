let wasm;

const cachedTextDecoder = new TextDecoder('utf-8', {
	ignoreBOM: true,
	fatal: true
});

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;

function getUint8Memory0() {
	if (
		cachegetUint8Memory0 === null ||
		cachegetUint8Memory0.buffer !== wasm.memory.buffer
	) {
		cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
	}
	return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
	return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
	if (heap_next === heap.length) heap.push(heap.length + 1);
	const idx = heap_next;
	heap_next = heap[idx];

	heap[idx] = obj;
	return idx;
}

function getObject(idx) {
	return heap[idx];
}

function dropObject(idx) {
	if (idx < 36) return;
	heap[idx] = heap_next;
	heap_next = idx;
}

function takeObject(idx) {
	const ret = getObject(idx);
	dropObject(idx);
	return ret;
}
/**
 */
export const TickType = Object.freeze({
	Cross: 0,
	0: 'Cross',
	Nought: 1,
	1: 'Nought',
	Nil: 2,
	2: 'Nil'
});
/**
 */
export const Player = Object.freeze({
	Crosses: 0,
	0: 'Crosses',
	Noughts: 1,
	1: 'Noughts'
});
/**
 */
export class TicTacToe {
	static __wrap(ptr) {
		const obj = Object.create(TicTacToe.prototype);
		obj.ptr = ptr;

		return obj;
	}

	__destroy_into_raw() {
		const ptr = this.ptr;
		this.ptr = 0;

		return ptr;
	}

	free() {
		const ptr = this.__destroy_into_raw();
		wasm.__wbg_tictactoe_free(ptr);
	}
	/**
	 * @return {number}
	 */
	get_player() {
		const ret = wasm.tictactoe_get_player(this.ptr);
		return ret >>> 0;
	}
	/**
	 * @param {number} player
	 * @return {TicTacToe}
	 */
	static new(player) {
		const ret = wasm.tictactoe_new(player);
		return TicTacToe.__wrap(ret);
	}
	/**
	 * @return {any}
	 */
	get_board() {
		const ret = wasm.tictactoe_get_board(this.ptr);
		return takeObject(ret);
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	place_mark(x, y) {
		wasm.tictactoe_place_mark(this.ptr, x, y);
	}
	/**
	 * @return {number}
	 */
	win_condition() {
		const ret = wasm.tictactoe_win_condition(this.ptr);
		return ret;
	}
}

async function load(module, imports) {
	if (typeof Response === 'function' && module instanceof Response) {
		if (typeof WebAssembly.instantiateStreaming === 'function') {
			try {
				return await WebAssembly.instantiateStreaming(module, imports);
			} catch (e) {
				if (module.headers.get('Content-Type') != 'application/wasm') {
					console.warn(
						'`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n',
						e
					);
				} else {
					throw e;
				}
			}
		}

		const bytes = await module.arrayBuffer();
		return await WebAssembly.instantiate(bytes, imports);
	} else {
		const instance = await WebAssembly.instantiate(module, imports);

		if (instance instanceof WebAssembly.Instance) {
			return { instance, module };
		} else {
			return instance;
		}
	}
}

async function init(input) {
	const getUrl = window.location;
	const baseUrl =
		getUrl.protocol + '//' + getUrl.host + '/' + getUrl.pathname.split('/')[1];
	if (typeof input === 'undefined') {
		console.log('url:', baseUrl);
		input = new URL('rustytac_bg.wasm', baseUrl);
	}
	const imports = {};
	imports.wbg = {};
	imports.wbg.__wbindgen_json_parse = function (arg0, arg1) {
		const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
		return addHeapObject(ret);
	};
	imports.wbg.__wbindgen_throw = function (arg0, arg1) {
		throw new Error(getStringFromWasm0(arg0, arg1));
	};

	if (
		typeof input === 'string' ||
		(typeof Request === 'function' && input instanceof Request) ||
		(typeof URL === 'function' && input instanceof URL)
	) {
		input = fetch(input);
	}

	const { instance, module } = await load(await input, imports);

	wasm = instance.exports;
	init.__wbindgen_wasm_module = module;

	return wasm;
}

export default init;
