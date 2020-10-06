import { mapGetters } from 'vuex'

export default args => (namespace, getters) =>
	Object.entries(mapGetters(namespace, getters)).reduce(
		(acc, [getter, fn]) => ({
			...acc,
			[getter]: state => fn.call(state)(...(Array.isArray(args) ? args : [args])),
		}),
		{},
	)
