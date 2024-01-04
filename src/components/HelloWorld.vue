<script setup>
import { ref, getCurrentInstance } from 'vue';
import { useMyStore } from '@/store/myStore/myStore';

const myStore = useMyStore();

defineProps({
	msg: String,
});

const count = ref(0);
const { proxy } = getCurrentInstance();

function sendMessage() {
	console.log(proxy);
	console.log(proxy.$electronAPI);
	console.log(proxy.$electronAPI.notification);
	console.log(proxy.$electronAPI.notification.sendMessage);
	proxy.$electronAPI.notification.sendMessage();
}
</script>

<template>
	<h1>{{ msg }}</h1>

	<div class="card">
		<button type="button" @click="myStore.count++">count is {{ myStore.count }}</button>
		<p>
			Edit
			<code>components/HelloWorld.vue</code> to test HMR
		</p>
	</div>

	<p>
		Check out
		<a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the
		official Vue + Vite starter
	</p>
	<p>
		Install
		<a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
		in your IDE for a better DX
	</p>
	<p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
	<p>Message: {{ myStore.message }}</p>
	<button type="button" @click="sendMessage">sendMsg</button>
</template>

<style scoped>
.read-the-docs {
	color: #888;
}
</style>
