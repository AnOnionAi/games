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

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder('utf-8');

let encodeString;
if (typeof cachedTextEncoder.encodeInto === 'function') {
	encodeString = function (arg, view) {
		return cachedTextEncoder.encodeInto(arg, view);
	};
} else {
	encodeString = function (arg, view) {
		const buf = cachedTextEncoder.encode(arg);
		view.set(buf);
		return {
			read: arg.length,
			written: buf.length
		};
	};
}

function passStringToWasm0(arg, malloc, realloc) {
	if (realloc === undefined) {
		const buf = cachedTextEncoder.encode(arg);
		const ptr = malloc(buf.length);
		getUint8Memory0()
			.subarray(ptr, ptr + buf.length)
			.set(buf);
		WASM_VECTOR_LEN = buf.length;
		return ptr;
	}

	let len = arg.length;
	let ptr = malloc(len);

	const mem = getUint8Memory0();

	let offset = 0;

	for (; offset < len; offset++) {
		const code = arg.charCodeAt(offset);
		if (code > 0x7f) break;
		mem[ptr + offset] = code;
	}

	if (offset !== len) {
		if (offset !== 0) {
			arg = arg.slice(offset);
		}
		ptr = realloc(ptr, len, (len = offset + arg.length * 3));
		const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
		const ret = encodeString(arg, view);

		offset += ret.written;
	}

	WASM_VECTOR_LEN = offset;
	return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
	if (
		cachegetInt32Memory0 === null ||
		cachegetInt32Memory0.buffer !== wasm.memory.buffer
	) {
		cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
	}
	return cachegetInt32Memory0;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
	if (stack_pointer == 1) throw new Error('out of js stack');
	heap[--stack_pointer] = obj;
	return stack_pointer;
}
/**
 */
export const Color = Object.freeze({
	White: 0,
	0: 'White',
	Black: 1,
	1: 'Black'
});
/**
 */
export class ChessEngine {
	static __wrap(ptr) {
		const obj = Object.create(ChessEngine.prototype);
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
		wasm.__wbg_chessengine_free(ptr);
	}
	/**
	 * @return {ChessEngine}
	 */
	static new() {
		const ret = wasm.chessengine_new();
		return ChessEngine.__wrap(ret);
	}
	/**
	 * @param {any} state_js
	 * @param {string} _player
	 * @param {string} _move
	 * @return {any}
	 */
	next_state(state_js, _player, _move) {
		try {
			const ptr0 = passStringToWasm0(
				_player,
				wasm.__wbindgen_malloc,
				wasm.__wbindgen_realloc
			);
			const len0 = WASM_VECTOR_LEN;
			const ptr1 = passStringToWasm0(
				_move,
				wasm.__wbindgen_malloc,
				wasm.__wbindgen_realloc
			);
			const len1 = WASM_VECTOR_LEN;
			const ret = wasm.chessengine_next_state(
				this.ptr,
				addBorrowedObject(state_js),
				ptr0,
				len0,
				ptr1,
				len1
			);
			return takeObject(ret);
		} finally {
			heap[stack_pointer++] = undefined;
		}
	}
	/**
	 * @param {any} state_js
	 * @param {string} _player
	 * @param {boolean} attack
	 * @return {any}
	 */
	get_possible_moves(state_js, _player, attack) {
		try {
			const ptr0 = passStringToWasm0(
				_player,
				wasm.__wbindgen_malloc,
				wasm.__wbindgen_realloc
			);
			const len0 = WASM_VECTOR_LEN;
			const ret = wasm.chessengine_get_possible_moves(
				this.ptr,
				addBorrowedObject(state_js),
				ptr0,
				len0,
				attack
			);
			return takeObject(ret);
		} finally {
			heap[stack_pointer++] = undefined;
		}
	}
	/**
	 * @param {any} states_js
	 * @return {any}
	 */
	in_threefold_repetition(states_js) {
		try {
			const ret = wasm.chessengine_in_threefold_repetition(
				this.ptr,
				addBorrowedObject(states_js)
			);
			return takeObject(ret);
		} finally {
			heap[stack_pointer++] = undefined;
		}
	}
	/**
	 * @param {any} state_js
	 * @param {string} _player
	 * @return {any}
	 */
	checkmate(state_js, _player) {
		try {
			const ptr0 = passStringToWasm0(
				_player,
				wasm.__wbindgen_malloc,
				wasm.__wbindgen_realloc
			);
			const len0 = WASM_VECTOR_LEN;
			const ret = wasm.chessengine_checkmate(
				this.ptr,
				addBorrowedObject(state_js),
				ptr0,
				len0
			);
			return takeObject(ret);
		} finally {
			heap[stack_pointer++] = undefined;
		}
	}
	/**
	 * @param {any} state_js
	 * @param {string} _player
	 * @return {any}
	 */
	in_stalemate(state_js, _player) {
		try {
			const ptr0 = passStringToWasm0(
				_player,
				wasm.__wbindgen_malloc,
				wasm.__wbindgen_realloc
			);
			const len0 = WASM_VECTOR_LEN;
			const ret = wasm.chessengine_in_stalemate(
				this.ptr,
				addBorrowedObject(state_js),
				ptr0,
				len0
			);
			return takeObject(ret);
		} finally {
			heap[stack_pointer++] = undefined;
		}
	}
	/**
	 * @param {any} state_js
	 * @return {any}
	 */
	insufficient_material(state_js) {
		try {
			const ret = wasm.chessengine_insufficient_material(
				this.ptr,
				addBorrowedObject(state_js)
			);
			return takeObject(ret);
		} finally {
			heap[stack_pointer++] = undefined;
		}
	}
	/**
	 * @param {any} state_js
	 * @param {string} _player
	 * @return {any}
	 */
	get_castle_moves(state_js, _player) {
		try {
			const ptr0 = passStringToWasm0(
				_player,
				wasm.__wbindgen_malloc,
				wasm.__wbindgen_realloc
			);
			const len0 = WASM_VECTOR_LEN;
			const ret = wasm.chessengine_get_castle_moves(
				this.ptr,
				addBorrowedObject(state_js),
				ptr0,
				len0
			);
			return takeObject(ret);
		} finally {
			heap[stack_pointer++] = undefined;
		}
	}
	/**
	 * @param {any} state_js
	 * @return {any}
	 */
	get_board(state_js) {
		try {
			const ret = wasm.chessengine_get_board(
				this.ptr,
				addBorrowedObject(state_js)
			);
			return takeObject(ret);
		} finally {
			heap[stack_pointer++] = undefined;
		}
	}
}
/**
 */
export class State {
	__destroy_into_raw() {
		const ptr = this.ptr;
		this.ptr = 0;

		return ptr;
	}

	free() {
		const ptr = this.__destroy_into_raw();
		wasm.__wbg_state_free(ptr);
	}
	/**
	 * @return {number}
	 */
	get current_player() {
		const ret = wasm.__wbg_get_state_current_player(this.ptr);
		return ret >>> 0;
	}
	/**
	 * @param {number} arg0
	 */
	set current_player(arg0) {
		wasm.__wbg_set_state_current_player(this.ptr, arg0);
	}
	/**
	 * @return {boolean}
	 */
	get white_king_on_board() {
		const ret = wasm.__wbg_get_state_white_king_on_board(this.ptr);
		return ret !== 0;
	}
	/**
	 * @param {boolean} arg0
	 */
	set white_king_on_board(arg0) {
		wasm.__wbg_set_state_white_king_on_board(this.ptr, arg0);
	}
	/**
	 * @return {boolean}
	 */
	get black_king_on_board() {
		const ret = wasm.__wbg_get_state_black_king_on_board(this.ptr);
		return ret !== 0;
	}
	/**
	 * @param {boolean} arg0
	 */
	set black_king_on_board(arg0) {
		wasm.__wbg_set_state_black_king_on_board(this.ptr, arg0);
	}
	/**
	 * @return {boolean}
	 */
	get white_king_castle_is_possible() {
		const ret = wasm.__wbg_get_state_white_king_castle_is_possible(this.ptr);
		return ret !== 0;
	}
	/**
	 * @param {boolean} arg0
	 */
	set white_king_castle_is_possible(arg0) {
		wasm.__wbg_set_state_white_king_castle_is_possible(this.ptr, arg0);
	}
	/**
	 * @return {boolean}
	 */
	get white_queen_castle_is_possible() {
		const ret = wasm.__wbg_get_state_white_queen_castle_is_possible(this.ptr);
		return ret !== 0;
	}
	/**
	 * @param {boolean} arg0
	 */
	set white_queen_castle_is_possible(arg0) {
		wasm.__wbg_set_state_white_queen_castle_is_possible(this.ptr, arg0);
	}
	/**
	 * @return {boolean}
	 */
	get black_king_castle_is_possible() {
		const ret = wasm.__wbg_get_state_black_king_castle_is_possible(this.ptr);
		return ret !== 0;
	}
	/**
	 * @param {boolean} arg0
	 */
	set black_king_castle_is_possible(arg0) {
		wasm.__wbg_set_state_black_king_castle_is_possible(this.ptr, arg0);
	}
	/**
	 * @return {boolean}
	 */
	get black_queen_castle_is_possible() {
		const ret = wasm.__wbg_get_state_black_queen_castle_is_possible(this.ptr);
		return ret !== 0;
	}
	/**
	 * @param {boolean} arg0
	 */
	set black_queen_castle_is_possible(arg0) {
		wasm.__wbg_set_state_black_queen_castle_is_possible(this.ptr, arg0);
	}
	/**
	 * @return {boolean}
	 */
	get white_king_is_checked() {
		const ret = wasm.__wbg_get_state_white_king_is_checked(this.ptr);
		return ret !== 0;
	}
	/**
	 * @param {boolean} arg0
	 */
	set white_king_is_checked(arg0) {
		wasm.__wbg_set_state_white_king_is_checked(this.ptr, arg0);
	}
	/**
	 * @return {boolean}
	 */
	get black_king_is_checked() {
		const ret = wasm.__wbg_get_state_black_king_is_checked(this.ptr);
		return ret !== 0;
	}
	/**
	 * @param {boolean} arg0
	 */
	set black_king_is_checked(arg0) {
		wasm.__wbg_set_state_black_king_is_checked(this.ptr, arg0);
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
		input = new URL('gym_chess_bg.wasm', baseUrl);
	}
	const imports = {};
	imports.wbg = {};
	imports.wbg.__wbindgen_json_parse = function (arg0, arg1) {
		const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
		return addHeapObject(ret);
	};
	imports.wbg.__wbg_log_9a99fb1af846153b = function (arg0) {
		console.log(getObject(arg0));
	};
	imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
		const ret = getStringFromWasm0(arg0, arg1);
		return addHeapObject(ret);
	};
	imports.wbg.__wbindgen_object_drop_ref = function (arg0) {
		takeObject(arg0);
	};
	imports.wbg.__wbg_new_59cb74e423758ede = function () {
		const ret = new Error();
		return addHeapObject(ret);
	};
	imports.wbg.__wbg_stack_558ba5917b466edd = function (arg0, arg1) {
		const ret = getObject(arg1).stack;
		const ptr0 = passStringToWasm0(
			ret,
			wasm.__wbindgen_malloc,
			wasm.__wbindgen_realloc
		);
		const len0 = WASM_VECTOR_LEN;
		getInt32Memory0()[arg0 / 4 + 1] = len0;
		getInt32Memory0()[arg0 / 4 + 0] = ptr0;
	};
	imports.wbg.__wbg_error_4bb6c2a97407129a = function (arg0, arg1) {
		try {
			console.error(getStringFromWasm0(arg0, arg1));
		} finally {
			wasm.__wbindgen_free(arg0, arg1);
		}
	};
	imports.wbg.__wbindgen_json_serialize = function (arg0, arg1) {
		const obj = getObject(arg1);
		const ret = JSON.stringify(obj === undefined ? null : obj);
		const ptr0 = passStringToWasm0(
			ret,
			wasm.__wbindgen_malloc,
			wasm.__wbindgen_realloc
		);
		const len0 = WASM_VECTOR_LEN;
		getInt32Memory0()[arg0 / 4 + 1] = len0;
		getInt32Memory0()[arg0 / 4 + 0] = ptr0;
	};
	imports.wbg.__wbg_log_76f7983b01e710a1 = function (arg0, arg1) {
		console.log(getObject(arg0), getObject(arg1));
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
