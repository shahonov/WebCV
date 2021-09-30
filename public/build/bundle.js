
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }

    function blur(node, { delay = 0, duration = 400, easing = cubicInOut, amount = 5, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const f = style.filter === 'none' ? '' : style.filter;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `opacity: ${target_opacity - (od * u)}; filter: ${f} blur(${u * amount}px);`
        };
    }
    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    const slidesConfig = {
        speed: 500,
        loadParallax: () => {
            const parallaxElements = document.getElementsByClassName("parallax");
            window.addEventListener("mousemove", (e) => {
                for (const element of parallaxElements) {
                    const sign = element.getAttribute("sign");
                    const speed = element.getAttribute("speed");
                    const width = e.pageX * speed;
                    const height = e.pageY * speed;
                    let x = 0;
                    let y = 0;
                    if (sign === "+") {
                        x = (window.innerWidth + width) / 100;
                        y = (window.innerHeight + height) / 100;
                    } else if (sign === "-") {
                        x = (window.innerWidth - width) / 100;
                        y = (window.innerHeight - height) / 100;
                    }
                    element.style.transform = `translateX(${x}px) translateY(${y}px)`;
                }
            });
        }
    };

    /* src\slides\OverviewSlide.svelte generated by Svelte v3.43.0 */
    const file$8 = "src\\slides\\OverviewSlide.svelte";

    function create_fragment$8(ctx) {
    	let section;
    	let div;
    	let h10;
    	let t1;
    	let h11;
    	let t3;
    	let h12;
    	let t5;
    	let h13;
    	let section_intro;
    	let section_outro;
    	let current;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			h10 = element("h1");
    			h10.textContent = "Overview slide";
    			t1 = space();
    			h11 = element("h1");
    			h11.textContent = "Overview slide";
    			t3 = space();
    			h12 = element("h1");
    			h12.textContent = "Overview slide";
    			t5 = space();
    			h13 = element("h1");
    			h13.textContent = "Overview slide";
    			attr_dev(h10, "class", "parallax svelte-1pw5oyt");
    			attr_dev(h10, "speed", "12");
    			attr_dev(h10, "sign", "+");
    			add_location(h10, file$8, 14, 8, 361);
    			attr_dev(h11, "class", "parallax svelte-1pw5oyt");
    			attr_dev(h11, "speed", "5");
    			attr_dev(h11, "sign", "-");
    			add_location(h11, file$8, 15, 8, 431);
    			attr_dev(h12, "class", "parallax svelte-1pw5oyt");
    			attr_dev(h12, "speed", "17");
    			attr_dev(h12, "sign", "-");
    			add_location(h12, file$8, 16, 8, 500);
    			attr_dev(h13, "class", "parallax svelte-1pw5oyt");
    			attr_dev(h13, "speed", "10");
    			attr_dev(h13, "sign", "+");
    			add_location(h13, file$8, 17, 8, 570);
    			attr_dev(div, "class", "overview-slide svelte-1pw5oyt");
    			add_location(div, file$8, 13, 4, 323);
    			attr_dev(section, "class", "slide svelte-1pw5oyt");
    			add_location(section, file$8, 12, 0, 278);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			append_dev(div, h10);
    			append_dev(div, t1);
    			append_dev(div, h11);
    			append_dev(div, t3);
    			append_dev(div, h12);
    			append_dev(div, t5);
    			append_dev(div, h13);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (section_outro) section_outro.end(1);
    				section_intro = create_in_transition(section, /*inT*/ ctx[0], {});
    				section_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (section_intro) section_intro.invalidate();
    			section_outro = create_out_transition(section, /*outT*/ ctx[1], {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (detaching && section_outro) section_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OverviewSlide', slots, []);
    	const globals = getContext("global");
    	const { inT, outT } = globals;

    	onMount(() => {
    		slidesConfig.loadParallax();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OverviewSlide> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		getContext,
    		slidesConfig,
    		globals,
    		inT,
    		outT
    	});

    	return [inT, outT];
    }

    class OverviewSlide extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverviewSlide",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\slides\experiences\Clustermarket.svelte generated by Svelte v3.43.0 */

    const file$7 = "src\\slides\\experiences\\Clustermarket.svelte";

    function create_fragment$7(ctx) {
    	let div4;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let p0;
    	let t3;
    	let div2;
    	let ul;
    	let li0;
    	let t5;
    	let li1;
    	let t7;
    	let li2;
    	let t9;
    	let li3;
    	let t11;
    	let div3;
    	let p1;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "2021 - current";
    			t1 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Some brief overview on what we were developing";
    			t3 = space();
    			div2 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Svelte";
    			t5 = space();
    			li1 = element("li");
    			li1.textContent = "GraphQL";
    			t7 = space();
    			li2 = element("li");
    			li2.textContent = "Postgres SQL";
    			t9 = space();
    			li3 = element("li");
    			li3.textContent = "Ruby on Rails";
    			t11 = space();
    			div3 = element("div");
    			p1 = element("p");
    			p1.textContent = "Like Jira, GitLab, Agile, etc.";
    			add_location(h3, file$7, 2, 8, 65);
    			attr_dev(div0, "class", "period svelte-l6smjc");
    			add_location(div0, file$7, 1, 4, 35);
    			add_location(p0, file$7, 5, 8, 138);
    			attr_dev(div1, "class", "overview svelte-l6smjc");
    			add_location(div1, file$7, 4, 4, 106);
    			add_location(li0, file$7, 9, 12, 261);
    			add_location(li1, file$7, 10, 12, 290);
    			add_location(li2, file$7, 11, 12, 320);
    			add_location(li3, file$7, 12, 12, 355);
    			add_location(ul, file$7, 8, 8, 243);
    			attr_dev(div2, "class", "tech-stack svelte-l6smjc");
    			add_location(div2, file$7, 7, 4, 209);
    			add_location(p1, file$7, 16, 8, 443);
    			attr_dev(div3, "class", "org-stack svelte-l6smjc");
    			add_location(div3, file$7, 15, 4, 410);
    			attr_dev(div4, "class", "experience-info svelte-l6smjc");
    			add_location(div4, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, h3);
    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			append_dev(div1, p0);
    			append_dev(div4, t3);
    			append_dev(div4, div2);
    			append_dev(div2, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			append_dev(ul, t7);
    			append_dev(ul, li2);
    			append_dev(ul, t9);
    			append_dev(ul, li3);
    			append_dev(div4, t11);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Clustermarket', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Clustermarket> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Clustermarket extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Clustermarket",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\slides\experiences\MotionSoftware.svelte generated by Svelte v3.43.0 */

    const file$6 = "src\\slides\\experiences\\MotionSoftware.svelte";

    function create_fragment$6(ctx) {
    	let div4;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let p0;
    	let t3;
    	let div2;
    	let ul;
    	let li0;
    	let t5;
    	let li1;
    	let t7;
    	let li2;
    	let t9;
    	let li3;
    	let t11;
    	let li4;
    	let t13;
    	let div3;
    	let p1;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "2020-2021";
    			t1 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Some brief overview on what we were developing";
    			t3 = space();
    			div2 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "JavaScript";
    			t5 = space();
    			li1 = element("li");
    			li1.textContent = "React";
    			t7 = space();
    			li2 = element("li");
    			li2.textContent = "Redux";
    			t9 = space();
    			li3 = element("li");
    			li3.textContent = "Node.js";
    			t11 = space();
    			li4 = element("li");
    			li4.textContent = "MongoDB";
    			t13 = space();
    			div3 = element("div");
    			p1 = element("p");
    			p1.textContent = "Like Jira, GitLab, Agile, etc.";
    			add_location(h3, file$6, 2, 8, 65);
    			attr_dev(div0, "class", "period svelte-1rplqtu");
    			add_location(div0, file$6, 1, 4, 35);
    			add_location(p0, file$6, 5, 8, 133);
    			attr_dev(div1, "class", "overview svelte-1rplqtu");
    			add_location(div1, file$6, 4, 4, 101);
    			add_location(li0, file$6, 9, 12, 256);
    			add_location(li1, file$6, 10, 12, 289);
    			add_location(li2, file$6, 11, 12, 317);
    			add_location(li3, file$6, 12, 12, 345);
    			add_location(li4, file$6, 13, 12, 375);
    			add_location(ul, file$6, 8, 8, 238);
    			attr_dev(div2, "class", "tech-stack svelte-1rplqtu");
    			add_location(div2, file$6, 7, 4, 204);
    			add_location(p1, file$6, 17, 8, 457);
    			attr_dev(div3, "class", "org-stack svelte-1rplqtu");
    			add_location(div3, file$6, 16, 4, 424);
    			attr_dev(div4, "class", "experience-info svelte-1rplqtu");
    			add_location(div4, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, h3);
    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			append_dev(div1, p0);
    			append_dev(div4, t3);
    			append_dev(div4, div2);
    			append_dev(div2, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			append_dev(ul, t7);
    			append_dev(ul, li2);
    			append_dev(ul, t9);
    			append_dev(ul, li3);
    			append_dev(ul, t11);
    			append_dev(ul, li4);
    			append_dev(div4, t13);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MotionSoftware', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MotionSoftware> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class MotionSoftware extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MotionSoftware",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\slides\experiences\SBTech.svelte generated by Svelte v3.43.0 */

    const file$5 = "src\\slides\\experiences\\SBTech.svelte";

    function create_fragment$5(ctx) {
    	let div5;
    	let div4;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let p0;
    	let t3;
    	let div2;
    	let ul;
    	let li0;
    	let t5;
    	let li1;
    	let t7;
    	let li2;
    	let t9;
    	let li3;
    	let t11;
    	let li4;
    	let t13;
    	let div3;
    	let p1;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "2018-2020";
    			t1 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Some brief overview on what we were developing";
    			t3 = space();
    			div2 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = ".NET Core";
    			t5 = space();
    			li1 = element("li");
    			li1.textContent = "MS SQL";
    			t7 = space();
    			li2 = element("li");
    			li2.textContent = "React";
    			t9 = space();
    			li3 = element("li");
    			li3.textContent = "MobX";
    			t11 = space();
    			li4 = element("li");
    			li4.textContent = "TypeScript";
    			t13 = space();
    			div3 = element("div");
    			p1 = element("p");
    			p1.textContent = "Like Jira, GitLab, Agile, etc.";
    			add_location(h3, file$5, 3, 12, 108);
    			attr_dev(div0, "class", "period svelte-l6smjc");
    			add_location(div0, file$5, 2, 8, 74);
    			add_location(p0, file$5, 6, 12, 188);
    			attr_dev(div1, "class", "overview svelte-l6smjc");
    			add_location(div1, file$5, 5, 8, 152);
    			add_location(li0, file$5, 10, 16, 327);
    			add_location(li1, file$5, 11, 16, 363);
    			add_location(li2, file$5, 12, 16, 396);
    			add_location(li3, file$5, 13, 16, 428);
    			add_location(li4, file$5, 14, 16, 459);
    			add_location(ul, file$5, 9, 12, 305);
    			attr_dev(div2, "class", "tech-stack svelte-l6smjc");
    			add_location(div2, file$5, 8, 8, 267);
    			add_location(p1, file$5, 18, 12, 560);
    			attr_dev(div3, "class", "org-stack svelte-l6smjc");
    			add_location(div3, file$5, 17, 8, 523);
    			attr_dev(div4, "class", "experience-info svelte-l6smjc");
    			add_location(div4, file$5, 1, 4, 35);
    			attr_dev(div5, "class", "experience-info svelte-l6smjc");
    			add_location(div5, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			append_dev(div0, h3);
    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			append_dev(div1, p0);
    			append_dev(div4, t3);
    			append_dev(div4, div2);
    			append_dev(div2, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			append_dev(ul, t7);
    			append_dev(ul, li2);
    			append_dev(ul, t9);
    			append_dev(ul, li3);
    			append_dev(ul, t11);
    			append_dev(ul, li4);
    			append_dev(div4, t13);
    			append_dev(div4, div3);
    			append_dev(div3, p1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SBTech', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SBTech> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SBTech extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SBTech",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\slides\ExperienceSlide.svelte generated by Svelte v3.43.0 */

    const { Object: Object_1$1 } = globals;
    const file$4 = "src\\slides\\ExperienceSlide.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (39:12) {#each Object.keys(tabs) as tab, i (i)}
    function create_each_block$1(key_1, ctx) {
    	let h4;
    	let t0_value = /*tab*/ ctx[8] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*tab*/ ctx[8]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(h4, "class", "tab svelte-pqzgg0");
    			toggle_class(h4, "active", /*tab*/ ctx[8] === /*currentTab*/ ctx[0]);
    			add_location(h4, file$4, 39, 16, 1126);
    			this.first = h4;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t0);
    			append_dev(h4, t1);

    			if (!mounted) {
    				dispose = listen_dev(h4, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*Object, tabs, currentTab*/ 5) {
    				toggle_class(h4, "active", /*tab*/ ctx[8] === /*currentTab*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(39:12) {#each Object.keys(tabs) as tab, i (i)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let div2;
    	let nav;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let div1;
    	let div0;
    	let switch_instance;
    	let section_intro;
    	let section_outro;
    	let current;
    	let each_value = Object.keys(/*tabs*/ ctx[2]);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[10];
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	var switch_value = /*component*/ ctx[1];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			div2 = element("div");
    			nav = element("nav");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			div1 = element("div");
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(nav, "class", "tabs parallax svelte-pqzgg0");
    			attr_dev(nav, "speed", "2");
    			attr_dev(nav, "sign", "-");
    			add_location(nav, file$4, 37, 8, 1009);
    			attr_dev(div0, "class", "parallax main");
    			attr_dev(div0, "speed", "5");
    			attr_dev(div0, "sign", "+");
    			add_location(div0, file$4, 49, 12, 1421);
    			attr_dev(div1, "class", "content svelte-pqzgg0");
    			add_location(div1, file$4, 48, 8, 1386);
    			attr_dev(div2, "class", "experience-slide svelte-pqzgg0");
    			add_location(div2, file$4, 36, 4, 969);
    			attr_dev(section, "class", "slide svelte-pqzgg0");
    			add_location(section, file$4, 35, 0, 924);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div2);
    			append_dev(div2, nav);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(nav, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Object, tabs, currentTab, changeTab*/ 13) {
    				each_value = Object.keys(/*tabs*/ ctx[2]);
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, nav, destroy_block, create_each_block$1, null, get_each_context$1);
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			add_render_callback(() => {
    				if (section_outro) section_outro.end(1);
    				section_intro = create_in_transition(section, /*inT*/ ctx[4], {});
    				section_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			if (section_intro) section_intro.invalidate();
    			section_outro = create_out_transition(section, /*outT*/ ctx[5], {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (switch_instance) destroy_component(switch_instance);
    			if (detaching && section_outro) section_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let component;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExperienceSlide', slots, []);

    	const tabs = {
    		["SBTech"]: SBTech,
    		["Motion Software"]: MotionSoftware,
    		["Clustermarket"]: Clustermarket
    	};

    	let currentTab = "Clustermarket";

    	function changeTab(tab) {
    		if (tab !== currentTab) {
    			$$invalidate(0, currentTab = "");

    			setTimeout(
    				() => {
    					$$invalidate(0, currentTab = tab);
    				},
    				slidesConfig.speed
    			);
    		}
    	}

    	const globals = getContext("global");
    	const { inT, outT } = globals;

    	onMount(() => {
    		slidesConfig.loadParallax();
    	});

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExperienceSlide> was created with unknown prop '${key}'`);
    	});

    	const click_handler = tab => changeTab(tab);

    	$$self.$capture_state = () => ({
    		onMount,
    		getContext,
    		Clustermarket,
    		MotionSoftware,
    		SbTech: SBTech,
    		slidesConfig,
    		tabs,
    		currentTab,
    		changeTab,
    		globals,
    		inT,
    		outT,
    		component
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentTab' in $$props) $$invalidate(0, currentTab = $$props.currentTab);
    		if ('component' in $$props) $$invalidate(1, component = $$props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*currentTab*/ 1) {
    			$$invalidate(1, component = tabs[currentTab]);
    		}
    	};

    	return [currentTab, component, tabs, changeTab, inT, outT, click_handler];
    }

    class ExperienceSlide extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExperienceSlide",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\slides\SoftSkillsSlide.svelte generated by Svelte v3.43.0 */
    const file$3 = "src\\slides\\SoftSkillsSlide.svelte";

    function create_fragment$3(ctx) {
    	let section;
    	let div;
    	let h10;
    	let t1;
    	let h11;
    	let t3;
    	let h12;
    	let t5;
    	let h13;
    	let section_intro;
    	let section_outro;
    	let current;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			h10 = element("h1");
    			h10.textContent = "Soft skills slide";
    			t1 = space();
    			h11 = element("h1");
    			h11.textContent = "Soft skills slide";
    			t3 = space();
    			h12 = element("h1");
    			h12.textContent = "Soft skills slide";
    			t5 = space();
    			h13 = element("h1");
    			h13.textContent = "Soft skills slide";
    			attr_dev(h10, "class", "parallax svelte-10rzjuv");
    			attr_dev(h10, "speed", "4");
    			attr_dev(h10, "sign", "+");
    			add_location(h10, file$3, 14, 8, 364);
    			attr_dev(h11, "class", "parallax svelte-10rzjuv");
    			attr_dev(h11, "speed", "8");
    			attr_dev(h11, "sign", "+");
    			add_location(h11, file$3, 15, 8, 436);
    			attr_dev(h12, "class", "parallax svelte-10rzjuv");
    			attr_dev(h12, "speed", "12");
    			attr_dev(h12, "sign", "-");
    			add_location(h12, file$3, 16, 8, 508);
    			attr_dev(h13, "class", "parallax svelte-10rzjuv");
    			attr_dev(h13, "speed", "16");
    			attr_dev(h13, "sign", "-");
    			add_location(h13, file$3, 17, 8, 581);
    			attr_dev(div, "class", "soft-skills-slide svelte-10rzjuv");
    			add_location(div, file$3, 13, 4, 323);
    			attr_dev(section, "class", "slide svelte-10rzjuv");
    			add_location(section, file$3, 12, 0, 278);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			append_dev(div, h10);
    			append_dev(div, t1);
    			append_dev(div, h11);
    			append_dev(div, t3);
    			append_dev(div, h12);
    			append_dev(div, t5);
    			append_dev(div, h13);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (section_outro) section_outro.end(1);
    				section_intro = create_in_transition(section, /*inT*/ ctx[0], {});
    				section_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (section_intro) section_intro.invalidate();
    			section_outro = create_out_transition(section, /*outT*/ ctx[1], {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (detaching && section_outro) section_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SoftSkillsSlide', slots, []);
    	const globals = getContext("global");
    	const { inT, outT } = globals;

    	onMount(() => {
    		slidesConfig.loadParallax();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SoftSkillsSlide> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		getContext,
    		slidesConfig,
    		globals,
    		inT,
    		outT
    	});

    	return [inT, outT];
    }

    class SoftSkillsSlide extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SoftSkillsSlide",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\slides\PlaygroundSlide.svelte generated by Svelte v3.43.0 */
    const file$2 = "src\\slides\\PlaygroundSlide.svelte";

    function create_fragment$2(ctx) {
    	let section;
    	let div;
    	let h10;
    	let t1;
    	let h11;
    	let t3;
    	let h12;
    	let t5;
    	let h13;
    	let section_intro;
    	let section_outro;
    	let current;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			h10 = element("h1");
    			h10.textContent = "Playground slide";
    			t1 = space();
    			h11 = element("h1");
    			h11.textContent = "Playground slide";
    			t3 = space();
    			h12 = element("h1");
    			h12.textContent = "Playground slide";
    			t5 = space();
    			h13 = element("h1");
    			h13.textContent = "Playground slide";
    			attr_dev(h10, "class", "parallax svelte-1rmma01");
    			attr_dev(h10, "speed", "4");
    			attr_dev(h10, "sign", "+");
    			add_location(h10, file$2, 14, 8, 363);
    			attr_dev(h11, "class", "parallax svelte-1rmma01");
    			attr_dev(h11, "speed", "10");
    			attr_dev(h11, "sign", "+");
    			add_location(h11, file$2, 15, 8, 434);
    			attr_dev(h12, "class", "parallax svelte-1rmma01");
    			attr_dev(h12, "speed", "15");
    			attr_dev(h12, "sign", "-");
    			add_location(h12, file$2, 16, 8, 506);
    			attr_dev(h13, "class", "parallax svelte-1rmma01");
    			attr_dev(h13, "speed", "8");
    			attr_dev(h13, "sign", "+");
    			add_location(h13, file$2, 17, 8, 578);
    			attr_dev(div, "class", "playground-slide svelte-1rmma01");
    			add_location(div, file$2, 13, 4, 323);
    			attr_dev(section, "class", "slide svelte-1rmma01");
    			add_location(section, file$2, 12, 0, 278);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			append_dev(div, h10);
    			append_dev(div, t1);
    			append_dev(div, h11);
    			append_dev(div, t3);
    			append_dev(div, h12);
    			append_dev(div, t5);
    			append_dev(div, h13);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (section_outro) section_outro.end(1);
    				section_intro = create_in_transition(section, /*inT*/ ctx[0], {});
    				section_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (section_intro) section_intro.invalidate();
    			section_outro = create_out_transition(section, /*outT*/ ctx[1], {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (detaching && section_outro) section_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlaygroundSlide', slots, []);
    	const globals = getContext("global");
    	const { inT, outT } = globals;

    	onMount(() => {
    		slidesConfig.loadParallax();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlaygroundSlide> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		getContext,
    		slidesConfig,
    		globals,
    		inT,
    		outT
    	});

    	return [inT, outT];
    }

    class PlaygroundSlide extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlaygroundSlide",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\slides\TechnicalSkillsSlide.svelte generated by Svelte v3.43.0 */
    const file$1 = "src\\slides\\TechnicalSkillsSlide.svelte";

    function create_fragment$1(ctx) {
    	let section;
    	let div;
    	let h10;
    	let t1;
    	let h11;
    	let t3;
    	let h12;
    	let t5;
    	let h13;
    	let section_intro;
    	let section_outro;
    	let current;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			h10 = element("h1");
    			h10.textContent = "Technical skills slide";
    			t1 = space();
    			h11 = element("h1");
    			h11.textContent = "Technical skills slide";
    			t3 = space();
    			h12 = element("h1");
    			h12.textContent = "Technical skills slide";
    			t5 = space();
    			h13 = element("h1");
    			h13.textContent = "Technical skills slide";
    			attr_dev(h10, "class", "parallax svelte-15xs4t9");
    			attr_dev(h10, "speed", "7");
    			attr_dev(h10, "sign", "-");
    			add_location(h10, file$1, 14, 8, 369);
    			attr_dev(h11, "class", "parallax svelte-15xs4t9");
    			attr_dev(h11, "speed", "10");
    			attr_dev(h11, "sign", "+");
    			add_location(h11, file$1, 15, 8, 446);
    			attr_dev(h12, "class", "parallax svelte-15xs4t9");
    			attr_dev(h12, "speed", "15");
    			attr_dev(h12, "sign", "-");
    			add_location(h12, file$1, 16, 8, 524);
    			attr_dev(h13, "class", "parallax svelte-15xs4t9");
    			attr_dev(h13, "speed", "2");
    			attr_dev(h13, "sign", "+");
    			add_location(h13, file$1, 17, 8, 602);
    			attr_dev(div, "class", "technical-skills-slide svelte-15xs4t9");
    			add_location(div, file$1, 13, 4, 323);
    			attr_dev(section, "class", "slide svelte-15xs4t9");
    			add_location(section, file$1, 12, 0, 278);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			append_dev(div, h10);
    			append_dev(div, t1);
    			append_dev(div, h11);
    			append_dev(div, t3);
    			append_dev(div, h12);
    			append_dev(div, t5);
    			append_dev(div, h13);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (section_outro) section_outro.end(1);
    				section_intro = create_in_transition(section, /*inT*/ ctx[0], {});
    				section_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (section_intro) section_intro.invalidate();
    			section_outro = create_out_transition(section, /*outT*/ ctx[1], {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (detaching && section_outro) section_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TechnicalSkillsSlide', slots, []);
    	const globals = getContext("global");
    	const { inT, outT } = globals;

    	onMount(() => {
    		slidesConfig.loadParallax();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TechnicalSkillsSlide> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		getContext,
    		slidesConfig,
    		globals,
    		inT,
    		outT
    	});

    	return [inT, outT];
    }

    class TechnicalSkillsSlide extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TechnicalSkillsSlide",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const layoutConfig = {
        mediumGrey: '#111',
        lightGrey: '#333'
    };

    /* src\App.svelte generated by Svelte v3.43.0 */

    const { Object: Object_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (112:3) {#each topControls as control, i (i)}
    function create_each_block_1(key_1, ctx) {
    	let div;
    	let t0_value = /*control*/ ctx[19] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[14](/*control*/ ctx[19]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "nav-control svelte-1fd4b3t");
    			toggle_class(div, "active", /*currentSlide*/ ctx[0] === /*control*/ ctx[19]);
    			add_location(div, file, 112, 4, 3203);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*currentSlide, topControls*/ 2049) {
    				toggle_class(div, "active", /*currentSlide*/ ctx[0] === /*control*/ ctx[19]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(112:3) {#each topControls as control, i (i)}",
    		ctx
    	});

    	return block;
    }

    // (212:3) {#each topControls as control, i (i)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let t0_value = /*i*/ ctx[21] + 1 + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[15](/*control*/ ctx[19]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "nav-control svelte-1fd4b3t");
    			toggle_class(div, "active", /*currentSlide*/ ctx[0] === /*control*/ ctx[19]);
    			add_location(div, file, 212, 4, 5539);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*currentSlide, topControls*/ 2049) {
    				toggle_class(div, "active", /*currentSlide*/ ctx[0] === /*control*/ ctx[19]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(212:3) {#each topControls as control, i (i)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div5;
    	let div0;
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let t0;
    	let div1;
    	let svg0;
    	let path0;
    	let t1;
    	let div2;
    	let switch_instance;
    	let t2;
    	let div3;
    	let svg1;
    	let path1;
    	let t3;
    	let div4;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*topControls*/ ctx[11];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*i*/ ctx[21];
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_1(key, child_ctx));
    	}

    	var switch_value = /*component*/ ctx[3];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	let each_value = /*topControls*/ ctx[11];
    	validate_each_argument(each_value);
    	const get_key_1 = ctx => /*i*/ ctx[21];
    	validate_each_keys(ctx, each_value, get_each_context, get_key_1);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div5 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			div1 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t1 = space();
    			div2 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t3 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "top-controls svelte-1fd4b3t");
    			add_location(div0, file, 110, 2, 3129);
    			attr_dev(path0, "d", "m213.667969 \r\n\t\t\t\t\t181.332031c0 \r\n\t\t\t\t\t4.269531-1.28125 \r\n\t\t\t\t\t8.535157-3.628907 \r\n\t\t\t\t\t11.734375l-106.664062 \r\n\t\t\t\t\t160c-3.839844 \r\n\t\t\t\t\t5.761719-10.242188 \r\n\t\t\t\t\t9.601563-17.707031 \r\n\t\t\t\t\t9.601563h-64c-11.734375 \r\n\t\t\t\t\t0-21.335938-9.601563-21.335938-21.335938 \r\n\t\t\t\t\t0-4.265625 \r\n\t\t\t\t\t1.28125-8.53125 \r\n\t\t\t\t\t3.628907-11.730469l98.773437-148.269531-98.773437-148.265625c-2.347657-3.199218-3.628907-7.464844-3.628907-11.734375 \r\n\t\t\t\t\t0-11.730469 \r\n\t\t\t\t\t9.601563-21.332031 \r\n\t\t\t\t\t21.335938-21.332031h64c7.464843 \r\n\t\t\t\t\t0 \r\n\t\t\t\t\t13.867187 \r\n\t\t\t\t\t3.839844 \r\n\t\t\t\t\t17.707031 \r\n\t\t\t\t\t9.601562l106.664062 \r\n\t\t\t\t\t160c2.347657 \r\n\t\t\t\t\t3.199219 \r\n\t\t\t\t\t3.628907 \r\n\t\t\t\t\t7.464844 \r\n\t\t\t\t\t3.628907 \r\n\t\t\t\t\t11.730469zm0 \r\n\t\t\t\t\t0");
    			add_location(path0, file, 132, 4, 3626);
    			attr_dev(svg0, "fill", /*prevArrowColor*/ ctx[2]);
    			attr_dev(svg0, "viewBox", "-74 0 362 362.66667");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "svelte-1fd4b3t");
    			add_location(svg0, file, 127, 3, 3508);
    			attr_dev(div1, "class", "left-arrow svelte-1fd4b3t");
    			add_location(div1, file, 121, 2, 3384);
    			attr_dev(div2, "class", "content svelte-1fd4b3t");
    			add_location(div2, file, 164, 2, 4384);
    			attr_dev(path1, "d", "m213.667969 \r\n\t\t\t\t\t181.332031c0 \r\n\t\t\t\t\t4.269531-1.28125 \r\n\t\t\t\t\t8.535157-3.628907 \r\n\t\t\t\t\t11.734375l-106.664062 \r\n\t\t\t\t\t160c-3.839844 \r\n\t\t\t\t\t5.761719-10.242188 \r\n\t\t\t\t\t9.601563-17.707031 \r\n\t\t\t\t\t9.601563h-64c-11.734375 \r\n\t\t\t\t\t0-21.335938-9.601563-21.335938-21.335938 \r\n\t\t\t\t\t0-4.265625 \r\n\t\t\t\t\t1.28125-8.53125 \r\n\t\t\t\t\t3.628907-11.730469l98.773437-148.269531-98.773437-148.265625c-2.347657-3.199218-3.628907-7.464844-3.628907-11.734375 \r\n\t\t\t\t\t0-11.730469 \r\n\t\t\t\t\t9.601563-21.332031 \r\n\t\t\t\t\t21.335938-21.332031h64c7.464843 \r\n\t\t\t\t\t0 \r\n\t\t\t\t\t13.867187 \r\n\t\t\t\t\t3.839844 \r\n\t\t\t\t\t17.707031 \r\n\t\t\t\t\t9.601562l106.664062 \r\n\t\t\t\t\t160c2.347657 \r\n\t\t\t\t\t3.199219 \r\n\t\t\t\t\t3.628907 \r\n\t\t\t\t\t7.464844 \r\n\t\t\t\t\t3.628907 \r\n\t\t\t\t\t11.730469zm0 \r\n\t\t\t\t\t0");
    			add_location(path1, file, 178, 4, 4704);
    			attr_dev(svg1, "fill", /*nextArrowColor*/ ctx[1]);
    			attr_dev(svg1, "viewBox", "-74 0 362 362.66667");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "class", "svelte-1fd4b3t");
    			add_location(svg1, file, 173, 3, 4586);
    			attr_dev(div3, "class", "right-arrow svelte-1fd4b3t");
    			add_location(div3, file, 167, 2, 4461);
    			attr_dev(div4, "class", "bottom-controls svelte-1fd4b3t");
    			add_location(div4, file, 210, 2, 5462);
    			attr_dev(div5, "class", "main-screen svelte-1fd4b3t");
    			add_location(div5, file, 109, 1, 3100);
    			attr_dev(main, "class", "svelte-1fd4b3t");
    			add_location(main, file, 108, 0, 3091);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div5);
    			append_dev(div5, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div5, t0);
    			append_dev(div5, div1);
    			append_dev(div1, svg0);
    			append_dev(svg0, path0);
    			append_dev(div5, t1);
    			append_dev(div5, div2);

    			if (switch_instance) {
    				mount_component(switch_instance, div2, null);
    			}

    			append_dev(div5, t2);
    			append_dev(div5, div3);
    			append_dev(div3, svg1);
    			append_dev(svg1, path1);
    			append_dev(div5, t3);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*prevSlide*/ ctx[6], false, false, false),
    					listen_dev(div1, "mouseenter", /*hoverPrev*/ ctx[7], false, false, false),
    					listen_dev(div1, "mouseleave", /*unhoverPrev*/ ctx[8], false, false, false),
    					listen_dev(div3, "click", /*nextSlide*/ ctx[5], false, false, false),
    					listen_dev(div3, "mouseenter", /*hoverNext*/ ctx[9], false, false, false),
    					listen_dev(div3, "mouseleave", /*unhoverNext*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*currentSlide, topControls, changeSlide*/ 2065) {
    				each_value_1 = /*topControls*/ ctx[11];
    				validate_each_argument(each_value_1);
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_1, each0_lookup, div0, destroy_block, create_each_block_1, null, get_each_context_1);
    			}

    			if (!current || dirty & /*prevArrowColor*/ 4) {
    				attr_dev(svg0, "fill", /*prevArrowColor*/ ctx[2]);
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div2, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (!current || dirty & /*nextArrowColor*/ 2) {
    				attr_dev(svg1, "fill", /*nextArrowColor*/ ctx[1]);
    			}

    			if (dirty & /*currentSlide, topControls, changeSlide*/ 2065) {
    				each_value = /*topControls*/ ctx[11];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key_1);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx, each_value, each1_lookup, div4, destroy_block, create_each_block, null, get_each_context);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			if (switch_instance) destroy_component(switch_instance);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let currentSlideIndex;
    	let component;
    	let prevArrowColor;
    	let nextArrowColor;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const slides = {
    		["Overview"]: OverviewSlide,
    		["Experience"]: ExperienceSlide,
    		["Tech Skills"]: TechnicalSkillsSlide,
    		["Soft Skills"]: SoftSkillsSlide,
    		["Playground"]: PlaygroundSlide
    	};

    	let currentSlide = "Experience";

    	function changeSlide(slide) {
    		if (slide !== currentSlide) {
    			$$invalidate(0, currentSlide = "");

    			setTimeout(
    				() => {
    					$$invalidate(0, currentSlide = slide);
    				},
    				slidesConfig.speed
    			);
    		}
    	}

    	function nextSlide() {
    		if (currentSlideIndex < Object.keys(slides).length - 1) {
    			const prevIndex = currentSlideIndex;
    			$$invalidate(0, currentSlide = "");

    			setTimeout(
    				() => {
    					const nextIndex = prevIndex + 1;
    					$$invalidate(0, currentSlide = Object.keys(slides)[nextIndex]);
    				},
    				slidesConfig.speed
    			);
    		}
    	}

    	function prevSlide() {
    		if (currentSlideIndex > 0) {
    			const prevIndex = currentSlideIndex;
    			$$invalidate(0, currentSlide = "");

    			setTimeout(
    				() => {
    					const nextIndex = prevIndex - 1;
    					$$invalidate(0, currentSlide = Object.keys(slides)[nextIndex]);
    				},
    				slidesConfig.speed
    			);
    		}
    	}

    	setContext("global", {
    		changeSlide,
    		inT: node => fade(node, { delay: 0, duration: slidesConfig.speed }),
    		outT: node => blur(node, { delay: 0, duration: slidesConfig.speed })
    	});

    	let lastCall = 0;

    	window.addEventListener("keyup", ev => {
    		if (lastCall + slidesConfig.speed > Date.now()) {
    			return;
    		}

    		lastCall = Date.now();

    		if (ev.code === "ArrowRight") {
    			if (currentSlideIndex < Object.keys(slides).length - 1) {
    				const prevIndex = currentSlideIndex;
    				$$invalidate(0, currentSlide = "");

    				setTimeout(
    					() => {
    						const nextIndex = prevIndex + 1;
    						$$invalidate(0, currentSlide = Object.keys(slides)[nextIndex]);
    					},
    					slidesConfig.speed
    				);
    			}
    		} else if (ev.code === "ArrowLeft") {
    			if (currentSlideIndex > 0) {
    				const prevIndex = currentSlideIndex;
    				$$invalidate(0, currentSlide = "");

    				setTimeout(
    					() => {
    						const nextIndex = prevIndex - 1;
    						$$invalidate(0, currentSlide = Object.keys(slides)[nextIndex]);
    					},
    					slidesConfig.speed
    				);
    			}
    		}
    	});

    	let isPrevHovered = false;
    	const hoverPrev = () => $$invalidate(12, isPrevHovered = true);
    	const unhoverPrev = () => $$invalidate(12, isPrevHovered = false);
    	let isNextHovered = false;
    	const hoverNext = () => $$invalidate(13, isNextHovered = true);
    	const unhoverNext = () => $$invalidate(13, isNextHovered = false);
    	const topControls = Object.keys(slides);
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = control => changeSlide(control);
    	const click_handler_1 = control => changeSlide(control);

    	$$self.$capture_state = () => ({
    		setContext,
    		blur,
    		fade,
    		Overview: OverviewSlide,
    		Experience: ExperienceSlide,
    		SoftSkills: SoftSkillsSlide,
    		Playground: PlaygroundSlide,
    		TechnicalSkills: TechnicalSkillsSlide,
    		slidesConfig,
    		layoutConfig,
    		slides,
    		currentSlide,
    		changeSlide,
    		nextSlide,
    		prevSlide,
    		lastCall,
    		isPrevHovered,
    		hoverPrev,
    		unhoverPrev,
    		isNextHovered,
    		hoverNext,
    		unhoverNext,
    		topControls,
    		nextArrowColor,
    		prevArrowColor,
    		currentSlideIndex,
    		component
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentSlide' in $$props) $$invalidate(0, currentSlide = $$props.currentSlide);
    		if ('lastCall' in $$props) lastCall = $$props.lastCall;
    		if ('isPrevHovered' in $$props) $$invalidate(12, isPrevHovered = $$props.isPrevHovered);
    		if ('isNextHovered' in $$props) $$invalidate(13, isNextHovered = $$props.isNextHovered);
    		if ('nextArrowColor' in $$props) $$invalidate(1, nextArrowColor = $$props.nextArrowColor);
    		if ('prevArrowColor' in $$props) $$invalidate(2, prevArrowColor = $$props.prevArrowColor);
    		if ('currentSlideIndex' in $$props) currentSlideIndex = $$props.currentSlideIndex;
    		if ('component' in $$props) $$invalidate(3, component = $$props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*currentSlide*/ 1) {
    			currentSlideIndex = Object.keys(slides).indexOf(currentSlide);
    		}

    		if ($$self.$$.dirty & /*currentSlide*/ 1) {
    			$$invalidate(3, component = slides[currentSlide]);
    		}

    		if ($$self.$$.dirty & /*isPrevHovered*/ 4096) {
    			$$invalidate(2, prevArrowColor = isPrevHovered
    			? layoutConfig.lightGrey
    			: layoutConfig.mediumGrey);
    		}

    		if ($$self.$$.dirty & /*isNextHovered*/ 8192) {
    			$$invalidate(1, nextArrowColor = isNextHovered
    			? layoutConfig.lightGrey
    			: layoutConfig.mediumGrey);
    		}
    	};

    	return [
    		currentSlide,
    		nextArrowColor,
    		prevArrowColor,
    		component,
    		changeSlide,
    		nextSlide,
    		prevSlide,
    		hoverPrev,
    		unhoverPrev,
    		hoverNext,
    		unhoverNext,
    		topControls,
    		isPrevHovered,
    		isNextHovered,
    		click_handler,
    		click_handler_1
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
