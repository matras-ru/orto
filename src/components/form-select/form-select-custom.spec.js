/* eslint-env jest */
import { mount, createLocalVue } from '@vue/test-utils';
import CFormSelectCustom from './form-select-custom';
import * as vClickOutside from 'v-click-outside-x';
import { CList, CListItem } from '@/components/list';
import { CDropdown } from '@/components/dropdown';
import { CFormInput } from '@/components/form-input';

describe('Form Select Custom ', () => {
    const localVue = new createLocalVue();
    localVue.use(vClickOutside);

    it('open/close, v-model', async () => {
        const App = localVue.extend({
            components: {
                CFormInput,
                CDropdown,
                CList,
                CListItem
            },

            data() {
                return {
                    model: null
                };
            },

            render(h) {
                return h(CFormSelectCustom, {
                    props: {
                        modelValue: this.model,
                        data: [
                            {
                                value: 1,
                                label: 'label1'
                            },
                            {
                                value: 2,
                                label: 'label2'
                            }
                        ],
                        label: 'label'
                    },
                    on: {
                        change: val => (this.model = val)
                    }
                });
            }
        });

        const wrapper = mount(App, {
            localVue
        });

        const holder = wrapper.find({ ref: 'holder' });

        holder.trigger('click');
        await wrapper.vm.$nextTick();

        const firstOption = wrapper.find('li');

        expect(wrapper.vm.model).toEqual(null);

        firstOption.trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.model).toEqual(1);

        wrapper.destroy();
    });

    it('custom value&label keys, v-model', async () => {
        const App = localVue.extend({
            components: {
                CFormInput,
                CDropdown,
                CList,
                CListItem
            },

            data() {
                return {
                    model: null
                };
            },

            render(h) {
                return h(CFormSelectCustom, {
                    props: {
                        modelValue: this.model,
                        data: [
                            {
                                id: 1,
                                name: 'label1'
                            },
                            {
                                id: 2,
                                name: 'label2'
                            }
                        ],
                        optionValue: 'id',
                        optionLabel: 'name',
                        label: 'label'
                    },
                    on: {
                        change: val => (this.model = val)
                    }
                });
            }
        });

        const wrapper = mount(App, {
            localVue
        });

        const holder = wrapper.find({ ref: 'holder' });
        holder.trigger('click');
        await wrapper.vm.$nextTick();

        const firstOption = wrapper.find('li');

        expect(wrapper.vm.model).toEqual(null);

        firstOption.trigger('click');

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.model).toEqual(1);

        wrapper.destroy();
    });

    it('option state', async () => {
        const App = localVue.extend({
            components: {
                CFormInput,
                CDropdown,
                CList,
                CListItem
            },

            data() {
                return {
                    model: 1
                };
            },

            render(h) {
                return h(CFormSelectCustom, {
                    props: {
                        modelValue: this.model,
                        data: [
                            {
                                value: 1,
                                label: 'label1'
                            },
                            {
                                value: 2,
                                label: 'label2'
                            }
                        ],
                        label: 'label'
                    },
                    on: {
                        change: val => (this.model = val)
                    }
                });
            }
        });

        const wrapper = mount(App, {
            localVue
        });

        const holder = wrapper.find({ ref: 'holder' });
        holder.trigger('click');
        await wrapper.vm.$nextTick();

        const options = wrapper.findAll(CListItem);
        expect(options.at(0).classes('bg-tertiary-100')).toBe(true);

        expect(options.at(1).classes('bg-white')).toBe(true);
        expect(options.at(1).classes('hover:bg-tertiary-100')).toBe(true);

        wrapper.destroy();
    });
});
