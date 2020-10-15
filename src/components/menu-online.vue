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
		<gooey-button
			:disabled="name === ''"
			@click="submit"
			:loading="sessionState === 'loading'"
			:message="copyMessage"
		>
			<span v-if="!isHost">Play!</span>
			<span v-else>Copy invite link</span>
		</gooey-button>
		<div class="session-state" v-if="isHost">
			<transition name="session-state" mode="out-in">
				<span v-if="opponentChoosingName">
					And now he's choosing a name...
				</span>
				<span v-else-if="sessionState === 'joined'">
					Your opponent has joined.
				</span>
			</transition>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
const goby = require('goby').init()

export default {
	name: 'menu-online',
	data() {
		return { name: '', copyMessage: '', opponentChoosingName: false }
	},
	computed: { ...mapGetters(['sessionState', 'isHost']) },
	methods: {
		generateName() {
			this.name = goby.generate(['pre', 'suf'])
		},
		submit() {
			if (this.isHost)
				this.$store.dispatch('startOnlineSession').then(() => {
					this.copyMessage = 'Link copied!'
					setTimeout(() => (this.copyMessage = ''), 1000)
				})
			else this.$store.dispatch('enterOnlineGame')
		},
	},
	mounted() {
		this.generateName()
	},
	watch: {
		sessionState(now, before) {
			if (now === 'joined')
				setTimeout(() => {
					this.opponentChoosingName = true
				}, 2500)
		},
		name() {
			this.$store.dispatch('changeName', this.name)
		},
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

.session-state {
	span {
		display: block;
	}
	overflow: hidden;
}

.session-state-enter-active,
.session-state-leave-active {
	transition: transform 0.3s $bouncy-easing;
}

.session-state-enter-from,
.session-state-leave-to {
	transform: translateY(120%) rotate(-5deg);
}
</style>
