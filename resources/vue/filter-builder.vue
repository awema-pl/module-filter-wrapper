<template>
    <a
        class="btn awema-spa-ignore"
        :class="{ 'active': isActive }"
        :href="queryString"
        @click.stop.prevent="$router.$setParam(query)"
    >
        {{ label }}
    </a>
</template>

<script>
import filterMixin from '../js/modules/filter-mixin'

export default {

    name: "filter-builder",

    mixins: [ filterMixin ],

    props: {

        param: {
            type: Object,
            default: function () { return {} }
        },

        label: {
            type: String,
            required: true
        },

        active: {
            type: Boolean,
            default: false
        }
    },


    computed: {

        isActive() {
            let active = true;
            for (let k in this.param) {
                //Проверка пустого значения
                if (this.param[k] === '' && (this.$route.query[k] === '' || this.$route.query[k] === undefined)) continue;
                if ( this.$route.query[k] !== this.param[k] ) active = false;
            }
            return active;
        },

        query() {
            return Object.assign({}, this.param, this.resetParams)
        },

        queryString() {
            return this.$route.path + '?' + AWEMA.utils.stringifyQuery( Object.assign({}, this.$route.query, this.query) ) + this.$route.hash
        }
    },


    methods: {

        setActiveOnInit() {
            for (let key in this.param ) {
                // key already exists, do not set current
                if ( this.$route.query.hasOwnProperty(key) ) {
                    return
                }
            }
            // set all params
            this.$router.$setParam(this.param, false)
        }
    },


    mounted() {
        if ( this.active ) {
            this.setActiveOnInit()
        }
    }
}
</script>
