import _config from './config'

export default {

    props: {

        reset: {
            type: String,
            default() {
                return this._config.reset
            }
        }
    },


    computed: {

        resetParams() {
            if ( AWEMA.utils.object.isEmpty(this.reset) ) {
                return {}
            } else {
                let _params = {}
                this.reset.split(',').forEach( param => {
                    param = param.trim()
                    _params[param] = ''
                });
                return _params
            }
        },
    },


    beforeCreate() {
        this._config = Object.assign( _config, AWEMA.utils.object.get(AWEMA_CONFIG, 'filterWrapper', {}) )
    }
}