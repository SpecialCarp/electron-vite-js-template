<script setup>
import HelloWorld from '@/components/HelloWorld.vue';
</script>

<template>
	<div>
		<a href="https://vitejs.dev" target="_blank">
			<img src="/vite.svg" class="logo" alt="Vite logo" />
		</a>
		<a href="https://vuejs.org/" target="_blank">
			<img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
		</a>
	</div>
	<HelloWorld msg="Vite + Vue" />
	<p>
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link>
	</p>
	<router-view></router-view>
	<div>
		<span>chrome-version: <span id="chrome-version"></span></span> | 
		<span>node-version: <span id="node-version"></span></span> | 
		<span>electron-version: <span id="electron-version"></span></span>
	</div>
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
