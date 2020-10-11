<template>
	<div class="online-play">
		<text-input
			name="name"
			class="name-input"
			v-model.trim="name"
			placeholder="Your name"
			autocomplete="off"
		>
			Who are You?
		</text-input>
		<gooey-button :disabled="name === ''">
			<transition name="button-content">
				<span>copy invite</span>
			</transition>
		</gooey-button>
	</div>
</template>

<script>
const goby = require('goby').init()

export default {
	name: 'menu-online',
	data() {
		return { name: '' }
	},
	methods: {
		generateName() {
			this.name = goby.generate(['pre', 'suf'])
		},
	},
	mounted() {
		this.generateName()
	},
}
</script>

<style lang="scss" scoped>
@use '../scss/library/variables' as *;
@use '../scss/library/ms' as *;
@use '../scss/library/colors' as color;
@use '../scss/library/mixins' as *;

.online-play {
	display: flex;
	flex-direction: column;
	align-items: center;
	> * {
		margin: gs(0.5) 0;
	}
	.name-input {
		width: ms(4);
	}
}
</style>
