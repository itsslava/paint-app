const API_URL = 'http://localhost:5050';

export async function saveRoomImage(roomId: string, canvas: HTMLCanvasElement): Promise<void> {
	const img = canvas.toDataURL('image/png');

	try {
		await fetch(`${API_URL}/image?id=${encodeURIComponent(roomId)}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ img }),
		});
	} catch (error) {
		console.log('Failed to save image', error);
	}
}

export async function loadRoomImage(roomId: string, canvas: HTMLCanvasElement): Promise<void> {
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	let response: Response;

	try {
		response = await fetch(`${API_URL}/image?id=${encodeURIComponent(roomId)}`);
	} catch (error) {
		console.log('Failed to load image', error);
		return;
	}

	if (response.status === 204) {
		return;
	}

	if (!response.ok) {
		console.log('Unexpected image response:', response.status);
		return;
	}

	const data: { img: string } = await response.json();

	await new Promise<void>((resolve) => {
		const img = new Image();
		img.src = data.img;
		img.onload = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			resolve();
		};
	});
}
