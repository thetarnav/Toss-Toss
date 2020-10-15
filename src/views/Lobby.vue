<template>
	<header class="title">
		<h1><span class="t">t</span>osss<span class="dot">.</span></h1>
	</header>
	<transition name="menu">
		<gooey-button class="go-back round" v-if="menuState !== 'init'" @click="goBack">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
				<g class="nc-icon-wrapper" fill="#000000">
					<path
						fill-rule="evenodd"
						d="M12.293 16.707l-6-6a.999.999 0 0 1 0-1.414l6-6a.999.999 0 1 1 1.414 1.414L8.414 10l5.293 5.293a.999.999 0 1 1-1.414 1.414z"
					/>
				</g>
			</svg>
		</gooey-button>
	</transition>
	<div class="lobby">
		<transition appear name="menu" mode="out-in">
			<menu-online class="online-joined" v-if="inviteID !== undefined"></menu-online>

			<gooey-button v-else-if="menuState === 'init'" @click="setMenuState('game-select')">
				Play!
			</gooey-button>

			<div class="game-select" v-else-if="menuState === 'game-select'">
				<gooey-button @click="playHotSeat">
					Hot seat
				</gooey-button>
				<gooey-button @click="setMenuState('online-play')">
					Online
				</gooey-button>
			</div>

			<menu-online class="online-play" v-else-if="menuState === 'online-play'"></menu-online>
		</transition>
	</div>
</template>

<script>
import menuOnline from '../components/menu-online'

export default {
	name: 'Lobby',
	components: { menuOnline },
	props: ['inviteID'],
	data() {
		return {}
	},
	computed: {
		menuState() {
			return this.$route.params.menuState || 'init'
		},
	},
	methods: {
		setMenuState(menuState) {
			this.$router.push({ params: { menuState } })
		},
		goBack() {
			this.$router.go(-1)
		},
		playHotSeat() {
			this.$store.dispatch('startHotSeatSession')
		},
	},
	created() {
		this.inviteID !== undefined && this.$store.dispatch('joinOnlineSession', this.inviteID)
	},
	beforeRouteLeave(to, from, next) {
		console.log('left:', from)
		if (!this.$store.state.online || to.name === 'Game') next()
		else this.$store.dispatch('leaveOnlineSession').then(() => next())
	},
}
</script>

<style lang="scss" scoped>
@use '../scss/library/variables' as *;
@use '../scss/library/ms' as *;
@use '../scss/library/colors' as color;
@use '../scss/library/mixins' as *;

.title {
	position: absolute;
	bottom: 50%;
	margin-bottom: gs(1);
	left: 0;
	right: 0;
	display: flex;
	filter: url(#goo-l);

	h1 {
		margin: 0 auto;

		font-size: font-size(5);
		text-align: center;
		line-height: gs(7);
		font-weight: 700;
		font-family: 'Palanquin', sans-serif;
		letter-spacing: -0.1em;
		color: color.$main;
		user-select: none;
		opacity: 0.5;

		.t {
			display: inline-block;
			transform: rotateZ(-10deg) translateY(ms(-3)) translateX(ms(-4) * -1);
		}
		.dot {
			display: inline-block;
			transform: translateX(gs(0.7));
			color: color.$pale;
		}
	}
}

.lobby {
	position: absolute;
	top: 50%;
	left: 0;
	right: 0;
	margin-top: gs(1);
	display: flex;
	justify-content: center;
}

.game-select {
	display: flex;
	> * {
		margin: 0 gs(0.5);
	}
}

.menu-enter-active,
.menu-leave-active {
	transition: opacity 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
	opacity: 0;
}
</style>
