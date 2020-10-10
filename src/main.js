import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

const app = createApp(App)
	.use(router)
	.use(store)

import GooeyButton from './components/ui/gooey-button'
import TextInput from './components/ui/text-input'

app.component('gooey-button', GooeyButton)
app.component('text-input', TextInput)

app.mount('#app')
