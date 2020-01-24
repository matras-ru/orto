import { mergeData } from 'vue-functional-data-merge';
import { getComponentConfig } from '@/config';
import { selfInstall } from '@/';

const NAME = 'CTabPanel';

export default {
    name: NAME,

    functional: true,

    install(Vue, theme) {
        selfInstall(Vue, theme, this);
    },

    props: {
        theme: {
            type: Object,
            default: () => {}
        },

        tag: {
            type: String,
            default: () => getComponentConfig(NAME, 'tag')
        },

        name: {
            type: String,
            default: null
        }
    },

    render(h, { data, props, children }) {
        const componentData = {
            name: props.name,
            attrs: {
                role: 'tabpanel',
                id: props.name,
                'aria-labelledby': `tab-${props.name}`,
                tabindex: '-1'
            }
        };
        return h(props.tag, mergeData(data, componentData), [children]);
    }
};
