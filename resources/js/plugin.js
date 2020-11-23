import filterWrapper from '../vue/filter-wrapper.vue'
import filterBuilder from '../vue/filter-builder.vue'

export function install(Vue) {

    if ( this.installed ) return
    this.installed = true

    Vue.component('filter-wrapper', filterWrapper)
    Vue.component('filter-builder', filterBuilder)
}

export default {
    installed: false,
    install
}