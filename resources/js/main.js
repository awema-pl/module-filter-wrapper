import { name, version } from '../../package.json'
import filterWrapperPlugin from './plugin.js'
import storeModule from './modules/store-module.js'
import lang from './modules/lang.js'

const awemaPlugin = {

    name, version,

    install(AWEMA) {
        Vue.prototype.$awemaFilters = new Vuex.Store(storeModule)
        Vue.use(filterWrapperPlugin)
        AWEMA.lang = lang
    }
}

const STACK = '__awema_plugins_stack__'

if ('AWEMA' in window) {
    AWEMA.use(awemaPlugin)
} else {
    window[STACK] = window[STACK] || []
    window[STACK].push(awemaPlugin)
}
