export const outerWrapBase = 'block mb-1-4 px-0-4';

export const innerWrapBase =
    'flex items-center border-2 rounded-lg -mx-0-4 px-0-8 transition-border transition-150 transition-ease';
export const innerWrapStateDefault = 'border-black-200';
export const innerWrapStateFocused = 'border-primary-100';
export const innerWrapStateError = 'border-danger';

export const labelBase =
    'absolute left-0 max-w-full truncate pointer-events-none bg-white px-0-4 uppercase transform-tl transition-transform transition-ease transition-150 top-0-5 leading-snug';
export const labelPositionFloat = 'transform-floating-label';
export const labelStateDefault = 'text-tertiary-300';
export const labelStateError = 'text-danger';

export const controlWrapBase = 'flex-auto relative';
export const prependBase = 'pr-0-4';
export const appendBase = 'pl-0-4';

export default {
    outerWrapBase,
    innerWrapBase,

    innerWrapStateDefault,
    innerWrapStateFocused,
    innerWrapStateError,

    controlWrapBase,

    labelBase,
    labelPositionFloat,
    labelStateDefault,
    labelStateError,

    prependBase,
    appendBase
};
