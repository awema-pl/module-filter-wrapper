<template>
    <form-builder v-if="formBuilderExists"
        url="/"
        :name="name"
        :default="$route.query"
        :auto-submit="autoSubmit"
        class="form-builder_filter"
        :sendText="sendText || $lang.FORM_APPLY"
        disabled-dialog
        @send="applyFilter"
        ref="formBuilder">
        <!-- :cancelbtn="hasCancel" -->

        <template slot-scope="form">
            <slot :fields="form.fields"></slot>
            <!-- self-status <fb-input type="hidden" :name="`${name}_active`"></fb-input> -->
        </template>

        <template slot="buttons-after">

            <slot name="buttons-middle"></slot><!--

         --><button
                class="btn btn_transparent form-builder__reset"
                type="reset"
                @click.prevent="resetFilter">
                <i class="icon icon-circle-cross"></i>
                {{ resetText || $lang.FORM_RESET }}
            </button><!--

         --><slot name="buttons-after"></slot>

        </template>

    </form-builder>
</template>

<script>
import filterMixin from '../js/modules/filter-mixin'

let filterId = 0

// TODO: maybe self-status is better?

export default {

    name: 'filter-wrapper',

    mixins: [ filterMixin ],

    props: {

        name: {
            type: String,
            default: () => 'filter-' + filterId++
        },

        sendText: String,

        resetText: String,

        autoSubmit: Boolean
    },


    computed: {

        formBuilderExists() {
            return 'form-builder' in this.$options.components
        },

        form() {
            return this.formBuilderExists && this.$store.getters['forms/form'](this.name)
        },

        isActive() {
            if ( ! this.form ) return false
            let active = false
            let query = this.$route.query
            let fields = this.form.fields

            Object.keys(fields).forEach( prop => {

                // skip status field
                // if ( prop === `${this.name}_active` ) return /* self-status */

                let fieldValue = fields[prop]
                let propActive
                if ( Array.isArray(fieldValue) ) {
                    propActive = query.hasOwnProperty(prop) && !!query[prop].length
                } else {
                    propActive = query.hasOwnProperty(prop) && query[prop] !== ''
                }
                active = active || propActive
            })
            return active
        }
    },


    watch: {

        isActive: {
            handler: function(isActive) {
                if ( ! this.formBuilderExists ) return
                this.$awemaFilters.commit('setFilterStatus', {
                    name: this.name,
                    status: isActive
                })
                // AWEMA._store.commit('forms/setFieldValue', { /* self-status */
                //     formName: this.name,
                //     fieldName: `${this.name}_active`,
                //     value: String(isActive)
                // })
                this.$emit('status-changed', isActive)
            },
            immediate: true
        },

        '$route.query': {
            handler(query) {
                // initial call
                if ( ! this._isMounted ) {
                    this.$nextTick( this.setDefaults )
                } else {
                    this.setDefaults()
                }
            },
            immediate: true
        }
    },


    methods: {

        applyFilter(fields) {
            let query = Object.assign({}, this.$route.query, fields, this.resetParams)
            this.$router.$setParam( query )
            this.$emit('applied', query)
        },

        resetFilter() {
            this.$root.$emit('forms:reset', this.name)
            this.$nextTick( this.$refs.formBuilder.send )
            this.$emit('reseted', this.$route.query)
        },

        setDefaults() {
            let query = this.$route.query
            for (let field in this.form.fields) {

                // skip status field
                // if ( prop === `${this.name}_active` ) return /* self-status */

                if ( query.hasOwnProperty(field)
                      && query[field] !== this.form.fields[field] ) {
                    this.$store.commit('forms/setFieldValue', {
                        formName: this.name,
                        fieldName: field,
                        value: query[field]
                    })
                }
            }
        }
    },


    mounted() {
        // check form-builder
        if ( ! this.formBuilderExists ) {
            console.error('filter-wrapper: you must include form-builder manually before using filter-wrapper')
        }
    },


    beforeDestroy() {
        this.$awemaFilters.commit('deleteFilterInfo', { name: this.name })
    }
}
</script>