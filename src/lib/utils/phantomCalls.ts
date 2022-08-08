import { account } from '$lib/stores/PhantomAccount';

export const isPhantomInstalled = (): boolean => {
	return Boolean(window.solana && window.solana.isPhantom);
};

export const goInstallPhantom = (): void => {
	if ('solana' in window) {
		const provider = window.solana;
		if (provider.isPhantom) {
			return provider;
		}
	}
	window.open('https://phantom.app/', '_blank');
};

export const phantomCon = async (): Promise<void> => {
	try {
		const { publicKey } = await window.solana.connect();

		const user_account = publicKey.toString();

		account.set(user_account);
	} catch (err) {
		console.log('failed');
	}
};

export const phantomDisconnect = async (): Promise<void> => {
	try {
		await window.solana.disconnect();
		account.set(undefined);
	} catch (error) {
		console.log('failed');
	}
};
