import OtMessageBox from '../../components/OtMessageBox.vue/index.vue';

const defaults = {
    name: 'alert', // confirm , prompt

    closedCallback: null,
    closeText: '',
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    title: '标题名称',
    description: '',
    message: '',
    icon: '',
    center: '',
    customClass: '',
    closable: true,

    showCancelButton: true,
    showConfirmButton: true,
};

let instance;
const instances = {};

const hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

function isVNode(node) {
    return node !== null && typeof node === 'object' && hasOwn(node, 'componentOptions');
}

export default Vue => {
    const OtMessageBoxConstructor = Vue.extend(OtMessageBox);

    const initInstance = options => {

        let vnode = null;
        if (isVNode(options.message)) {
            vnode = [ options.message ];
            options.message = null;
        }

        const key = options.name;
        if (!instances[key]) {
            instance = new OtMessageBoxConstructor({
                data: options,
            });
        } else {
            instance = instances[options.name];
            Object.keys(defaults).forEach(key => {
                const value = options[key];
                instance[key] = value === undefined ? null : value;
            });
        }

        instance.closedCallback = function() {
            console.log('close...');
        };
        // instance.callback = defaultCallback;

        if (vnode) {
            instance.$slots.default = vnode;
            instance.message = null;
        } else {
            delete instance.$slots.default;
        }
        instance.vm = instance.$mount();

        Vue.nextTick(() => {
            instance.show();
        });

        if (!instances[key]) {
            instances[key] = instance;
            document.body.appendChild(instance.vm.$el);
        }
    };

    const MessageBox = function(options) {
        if (Vue.prototype.$isServer) return;

        if (typeof options === 'string' || isVNode(options)) {
            options = {
                description: options,
            };
            if (typeof arguments[1] === 'string') {
                options.title = arguments[1];
            }
        }

        options = Object.assign({}, defaults, options);
        initInstance(options);

        return new Promise((resolve, reject) => {
            instance.__callback__ = {
                resolve, reject,
            };
        });
    };

    MessageBox.alert = (description, title, options) => {
        if (typeof title === 'object') {
            options = title;
            title = '';
        } else if (title === undefined) {
            title = '';
        }
        return MessageBox(Object.assign({
            title,
            description,
        }, options, {
            name: 'alert',
            showCancelButton: false,
        }));
    };

    MessageBox.confirm = (description, title, options) => {
        if (typeof title === 'object') {
            options = title;
            title = '';
        } else if (title === undefined) {
            title = '';
        }
        return MessageBox(Object.assign({
            title,
            description,
        }, options, {
            name: 'confirm',
            showCancelButton: true,
            showConfirmButton: true,
        }));
    };

    MessageBox.prompt = (description, title, options) => {
        if (typeof title === 'object') {
            options = title;
            title = '';
        } else if (title === undefined) {
            title = '';
        }
        return MessageBox(Object.assign({
            title,
            description,
        }, options, {
            name: 'prompt',
            showCancelButton: true,
            showConfirmButton: true,
        }));
    };

    MessageBox.close = () => {
        instance.hide();
    };

    // 挂载
    Vue.prototype.$otMessageBox = MessageBox; // $otMessageBox(options)

    // $otAlert(description, title, options) 或 $otAlert(description, options)
    // $otConfirm(description, title, options) 或 $otConfirm(description, options)
    // $otPrompt(description, title, options) 或 $otPrompt(description, options)
    Vue.prototype.$otAlert = MessageBox.alert;
    Vue.prototype.$otConfirm = MessageBox.confirm;
    Vue.prototype.$otPrompt = MessageBox.prompt;
};
