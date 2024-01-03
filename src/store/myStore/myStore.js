// MyStore.js
import { defineStore } from 'pinia';

export const useMyStore = defineStore('myStore', {
	state: () => ({
		// your state properties here
		count: 0,
		message: 'Hello, Pinia!',
	}),
	getters: {
		// your getters here
	},
	actions: {
		// your actions here
	},
});
