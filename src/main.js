import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

const app = createApp(App)
	.use(router)
	.use(store)

store.state.$app = app

import GooeyButton from './components/ui/gooey-button'
import GooeySingleCheckbox from './components/ui/gooey-single-checkbox'
import TextInput from './components/ui/text-input'

app.component('gooey-button', GooeyButton)
app.component('gooey-single-checkbox', GooeySingleCheckbox)
app.component('text-input', TextInput)

app.mount('#app')
