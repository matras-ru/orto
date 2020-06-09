import { mergeData } from 'vue-functional-data-merge';
import { selfInstall } from '@/utils/index.js';
import { getHashMapValue, numProp, stringProp, suffixPropName } from '@/utils';
import { getComponentConfig } from '@/config';
import DefaultTheme from '@/themes/default/CRow';

const NAME = 'CRow';
const VALID_GUTTERS = ['none', 'sm', 'md', 'lg', 'xl'];
const GUTTERS_PROP_NAME = 'gutters';
const COLS_PROP_NAME = 'cols';

const getBreakpoint = (key, name) => key.replace(name, '').toLowerCase();
const wPrefix = 'w-';
const offsetPrefix = 'ml-';

const createThemeMap = ({
    guttersNormalizeXl,
    guttersXl,
    guttersNormalizeLg,
    guttersLg,
    guttersNormalizeMd,
    guttersMd,
    guttersNormalizeSm,
    guttersSm,
    guttersNormalizeNone,
    guttersNone
}) => {
    return {
        gutters: {
            xl: {
                row: guttersNormalizeXl,
                col: guttersXl
            },
            lg: {
                row: guttersNormalizeLg,
                col: guttersLg
            },
            md: {
                row: guttersNormalizeMd,
                col: guttersMd
            },
            sm: {
                row: guttersNormalizeSm,
                col: guttersSm
            },
            none: {
                row: guttersNormalizeNone,
                col: guttersNone
            }
        }
    };
};

// Cached copy of the breakpoint prop names
let breakpointPropMap = Object.create(null);

const generateProps = () => {
    const breakpoints = getComponentConfig('common', 'screens');

    const breakpointGutters = breakpoints.reduce((prop, breakpoint) => {
        prop[suffixPropName(breakpoint, GUTTERS_PROP_NAME)] = stringProp();
        return prop;
    }, Object.create(null));

    const breakpointCols = breakpoints.reduce((prop, breakpoint) => {
        prop[breakpoint] = numProp();
        return prop;
    }, Object.create(null));

    breakpointPropMap = Object.assign(Object.create(null), {
        gutters: Object.keys(breakpointGutters),
        cols: Object.keys(breakpointCols)
    });

    return {
        theme: {
            type: Object,
            default: () => DefaultTheme
        },

        [COLS_PROP_NAME]: {
            type: Number,
            default: () => getComponentConfig(NAME, COLS_PROP_NAME)
        },

        ...breakpointCols,

        [GUTTERS_PROP_NAME]: {
            type: String,
            default: () => getComponentConfig(NAME, 'gutters'),
            validator: value => VALID_GUTTERS.includes(value)
        },

        ...breakpointGutters
    };
};

//
const currentClass = props => {
    const { gutters: gutter, theme } = props;
    const { base } = theme;
    const { gutters } = createThemeMap(theme);

    const rowClasses = [base];
    const colClasses = [];

    const { row: rowGuttersClass, col: colGuttersClass } = getHashMapValue(gutters, gutter);

    if (rowGuttersClass && colGuttersClass) {
        rowClasses.push(rowGuttersClass);
        colClasses.push(colGuttersClass);
    }

    // breakpoints gutters

    breakpointPropMap[GUTTERS_PROP_NAME].forEach(key => {
        if (!props[key]) return undefined;

        const breakpoint = getBreakpoint(key, 'gutters');

        if (breakpoint) {
            const {
                row: rowGuttersBreakpointClass,
                col: colGuttersBreakpointClass
            } = getHashMapValue(gutters, props[key]);

            if (rowGuttersBreakpointClass && colGuttersBreakpointClass) {
                rowClasses.push(`${breakpoint}:${rowGuttersBreakpointClass}`);
                colClasses.push(`${breakpoint}:${colGuttersBreakpointClass}`);
            }
        }
    });

    return {
        rowClasses,
        colClasses
    };
};

const createColBreakpointClass = ({ props, cols, offset, colsLimit }) => {
    if (!cols) return null;

    const classes = [];

    // width
    if (cols.default) {
        if (cols.default < colsLimit) {
            classes.push(`${wPrefix}${cols.default}/${colsLimit}`);
        }

        if (cols.default === colsLimit) {
            classes.push(`${wPrefix}full`);
        }
    }

    // offset
    if (offset.default) {
        if (offset.default < colsLimit) {
            classes.push(`${offsetPrefix}${offset.default}/${colsLimit}`);
        }

        if (offset.default === colsLimit) {
            classes.push(`${offsetPrefix}full`);
        }
    }

    breakpointPropMap[COLS_PROP_NAME].forEach(breakpoint => {
        const propsValue = props[breakpoint] || colsLimit;

        // breakpoint width
        if (cols[breakpoint]) {
            if (cols[breakpoint] < propsValue) {
                classes.push(`${breakpoint}:${wPrefix}${cols[breakpoint]}/${propsValue}`);
            }

            if (cols[breakpoint] === propsValue) {
                classes.push(`${breakpoint}:${wPrefix}full`);
            }
        } else {
            if (props[breakpoint] && cols.default) {
                classes.push(`${breakpoint}:${wPrefix}${cols.default}/${propsValue}`);
            }
        }

        // breakpoint offset
        if (offset[breakpoint]) {
            if (offset[breakpoint] < propsValue) {
                classes.push(`${breakpoint}:${offsetPrefix}${offset[breakpoint]}/${propsValue}`);
            }

            if (offset[breakpoint] === propsValue) {
                classes.push(`${breakpoint}:${offsetPrefix}full`);
            }
        } else {
            if (props[breakpoint] && offset.default) {
                classes.push(`${breakpoint}:${offsetPrefix}${offset.default}/${propsValue}`);
            }
        }
    });

    return classes;
};

export default {
    name: NAME,

    functional: true,

    install(Vue, theme) {
        selfInstall(Vue, theme, this);
    },

    get props() {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#Smart_self-overwriting_lazy_getters
        delete this.props;
        // eslint-disable-next-line no-return-assign
        return (this.props = generateProps());
    },

    render(h, { props, data, children = [] }) {
        const { rowClasses, colClasses } = currentClass(props);
        const computedChildren = children.map(col => {
            if (!col.data) return;

            const { cols, offset } = col.data;

            const colBreakpointClass = createColBreakpointClass({
                props,
                cols,
                offset,
                colsLimit: props.cols
            });

            col.data = mergeData(col.data, {
                class: [...colClasses, ...colBreakpointClass]
            });

            return col;
        });

        return h(
            'div',
            mergeData(data, {
                class: rowClasses
            }),
            computedChildren
        );
    }
};
