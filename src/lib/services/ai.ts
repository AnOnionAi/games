export const playTicTacToe = async (
	firstPlayer: string,
	board: string[][]
): Promise<any> => {
	try {
		const body = JSON.stringify({
			game: 'tictactoe',
			player: firstPlayer === 'user' ? 2 : 1,
			game_state: board.map((rows) => {
				return rows.map((i) => {
					if (i === 'Nil') return 0;
					if (i === 'Cross') return -1;
					return 1;
				});
			})
		});

		console.log(body);
		const resp = await fetch(import.meta.env.VITE_API_AI + '/play', {
			method: 'POST',
			body,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		});

		const json = await resp.json();
		console.log(json);
		return [json.row - 1, json.col - 1];
	} catch (e) {
		console.log(e);
		return e;
	}
};

export const playChess = async (gameState: [[]]): Promise<any> => {
	try {
		const body = JSON.stringify({
			game: 'chess',
			player: 0,
			game_state: gameState
		});

		console.log(body);
		const resp = await fetch(import.meta.env.VITE_API_AI + '/play', {
			method: 'POST',
			body,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		});

		const json = await resp.json();
		console.log(json);
		return json;
	} catch (e) {
		console.log(e);
		return e;
	}
};
