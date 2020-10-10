<template>
	<div class="lobby">
		<text-input
			name="name"
			class="name-input"
			v-model.trim="name"
			placeholder="Your name"
			autocomplete="off"
		>
			Who are You?
		</text-input>
		<div class="game-select">
			<h6>How you wanna play?</h6>
			<gooey-button>
				Hot-seat
			</gooey-button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Lobby',
	props: ['inviteID'],
	data() {
		return {
			name: '',
		}
	},
	methods: {},
}
</script>

<style lang="scss" scoped>
@use '../scss/library/variables' as *;
@use '../scss/library/ms' as *;
@use '../scss/library/colors' as color;
@use '../scss/library/mixins' as *;

.lobby {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.name-input {
	width: ms(4);
}
.game-select {
	margin-top: gs(1);
}
</style>
