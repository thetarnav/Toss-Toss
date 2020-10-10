<template>
	<div class="lobby">
		<text-input></text-input>
		lobby
		{{ inviteID }}
	</div>
</template>

<script>
export default {
	name: 'Lobby',
	props: ['inviteID'],
	data() {
		return {}
	},
	methods: {},
}
</script>

<style lang="scss" scoped>
.lobby {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
