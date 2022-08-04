// import { user } from '$lib/stores/user';
//import { get } from 'svelte/store';
//import { Firebase } from '$lib/firebase/init';
// import type { User } from '$lib/types/user_interfaces';
import {
	serverTimestamp,
	collection,
	doc,
	setDoc,
	deleteDoc,
	writeBatch,
	Timestamp
} from 'firebase/firestore';


export const deleteInvitation = async (
	invitationId: string
): Promise<boolean> => {
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	try {
		console.log('delete id', invitationId);

		const invitationRef = doc(db, `invitations/${invitationId}`);
		await deleteDoc(invitationRef);

		return true;
	} catch (err) {
		console.log('deleteInvitation Error: ', err);
		return false;
	}
};


export const saveGame = async (gameState): Promise<boolean> => {
	// TODO: gameState Type
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	try {
		console.log('save game game state: ', gameState);

		const gameRef = doc(db, `games/${gameState.id}`);
		await setDoc(gameRef, gameState);

		return true;
	} catch (err) {
		console.log('saveGame Error: ', err);
		return false;
	}
};

export const finishGame = async (gameid: string): Promise<boolean> => {
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	try {
		const gameRef = doc(db, `games/${gameid}`);
		await setDoc(
			gameRef,
			{
				active: false
			},
			{ merge: true }
		);

		return true;
	} catch (err) {
		console.log('finishGame Error: ', err);
		return false;
	}
};

export const resign = async (
	gameId: string,
	opponentColor: string
): Promise<boolean> => {
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	try {
		console.log('resign game room: ', gameId);

		const newGameState = {
			active: false,
			winner: opponentColor,
			reason: 'resign'
		};

		const gameRef = doc(db, `games/${gameId}`);
		await setDoc(gameRef, newGameState, { merge: true });

		return true;
	} catch (err) {
		console.log('resign Error: ', err);
		return false;
	}
};

export const declineDrawOffer = async (gameId: string): Promise<boolean> => {
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	try {
		const gameRef = doc(db, `games/${gameId}`);
		await setDoc(gameRef, { drawRequest: { request: false } }, { merge: true });

		return true;
	} catch (err) {
		console.log('declineDrawOffer Error: ', err);
		return false;
	}
};

export const offerDraw = async (
	gameId: string,
	from: string
): Promise<boolean> => {
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	try {
		const drawRequest = {
			request: true,
			from
		};

		const gameRef = doc(db, `games/${gameId}`);
		await setDoc(gameRef, { drawRequest }, { merge: true });

		return true;
	} catch (err) {
		console.log('offerDraw Error: ', err);
		return false;
	}
};

export const acceptDraw = async (gameId: string): Promise<boolean> => {
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	try {
		const gameRef = doc(db, `games/${gameId}`);
		await setDoc(
			gameRef,
			{ active: false, draw: true, drawRequest: {} },
			{ merge: true }
		);

		return true;
	} catch (err) {
		console.log('acceptDraw Error: ', err);
		return false;
	}
};