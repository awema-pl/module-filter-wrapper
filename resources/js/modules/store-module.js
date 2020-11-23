const state = () => ({
    active: {}
})

const mutations = {

    setFilterStatus(state, { name, status }) {
        Vue.set(state.active, name, status)
    },

    deleteFilterInfo(state, name) {
        Vue.delete(state.active, name)
    }
}

export default {
    state,
    mutations
}
