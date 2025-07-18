import { deserialize } from '$app/forms';
export const sendMessage = (actionTarget, formData, callback) => {
	try {
		fetch(actionTarget, {
			method: 'POST',
			body: formData,
			headers: { 'x-sveltekit-action': 'true' }
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.text();
			})
			.then((data) => {
				if (callback && data) {
					const result = deserialize(data);
					if (result.status === 200) callback(result.data);
				} else {
					callback();
				}
			})
			.catch((_) => {
				console.log('-----error------', _);
			});
	} catch (_) {
		console.log('-----error------', _);
	}
};

export function generateInvoiceNumber() {
    const todayDate = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const currentTime = new Date().getTime();
    const randomComponent = Math.floor(Math.random() * 100);
    const invoiceNumber = `${todayDate}${currentTime.toString().slice(-4)}-${String(randomComponent).padStart(2, '0')}`;
    return invoiceNumber;
}
