var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
import "gsap";
import "@googlemaps/markerclusterer";
import "@use-gesture/vanilla";
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
function lowercase_keys(obj) {
  const clone = {};
  for (const key in obj) {
    clone[key.toLowerCase()] = obj[key];
  }
  return clone;
}
function error$1(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const params = route.params(match);
  const response = await handler({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error$1(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error$1(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
const s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page && page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page && page.path)},
						query: new URLSearchParams(${page ? s$1(page.query.toString()) : ""}),
						params: ${page && s$1(page.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  if (loaded.context) {
    throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
  }
  return loaded;
}
const s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  stuff,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module } = node;
  let uses_credentials = false;
  const fetched = [];
  let set_cookie_headers = [];
  let loaded;
  const page_proxy = new Proxy(page, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 === "set-cookie") {
                    set_cookie_headers = set_cookie_headers.concat(value);
                  } else if (key2 !== "etag") {
                    headers[key2] = value;
                  }
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape$1(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      stuff: { ...stuff }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    stuff: loaded.stuff || stuff,
    fetched,
    set_cookie_headers,
    uses_credentials
  };
}
const escaped$2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape$1(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
const absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    stuff: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      stuff: loaded ? loaded.stuff : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  let set_cookie_headers = [];
  ssr:
    if (page_config.ssr) {
      let stuff = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              stuff,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
            if (loaded.loaded.redirect) {
              return with_cookies({
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              }, set_cookie_headers);
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    stuff: node_loaded.stuff,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return with_cookies(await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            }), set_cookie_headers);
          }
        }
        if (loaded && loaded.loaded.stuff) {
          stuff = {
            ...stuff,
            ...loaded.loaded.stuff
          };
        }
      }
    }
  try {
    return with_cookies(await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    }), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return with_cookies(await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    }), set_cookie_headers);
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    response.headers["set-cookie"] = set_cookie_headers;
  }
  return response;
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
class ReadOnlyFormData {
  constructor(map) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
}
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        const decoded = decodeURI(request2.path);
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(decoded);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
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
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
const escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
const missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
let on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var root_svelte_svelte_type_style_lang = "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}";
const css$2 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$2);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
let base = "";
let assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
const template = ({ head, body }) => '<!DOCTYPE html>\r\n<html lang="en">\r\n  <head>\r\n    <script\r\n      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCuQBbHnOXGEZ7ZtNlYQiaf3KnJx56abYY"\r\n      async\r\n    ><\/script>\r\n    <link rel="preconnect" href="https://fonts.googleapis.com" />\r\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\r\n    <link\r\n      href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap"\r\n      rel="stylesheet"\r\n    />\r\n    <meta charset="utf-8" />\r\n    <link rel="icon" href="/logo.inline.svg" />\r\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\r\n    ' + head + '\r\n  </head>\r\n  <body>\r\n    <div id="svelte">' + body + "</div>\r\n  </body>\r\n</html>\r\n";
let options = null;
const default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-1e761d54.js",
      css: [assets + "/_app/assets/start-61d1577b.css"],
      js: [assets + "/_app/start-1e761d54.js", assets + "/_app/chunks/vendor-6710fca7.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
const empty = () => ({});
const manifest = {
  assets: [{ "file": "logo.inline.svg", "size": 37735, "type": "image/svg+xml" }, { "file": "_headers.txt", "size": 35, "type": "text/plain" }],
  layout: ".svelte-kit/build/components/layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: [".svelte-kit/build/components/layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
const get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
const module_lookup = {
  ".svelte-kit/build/components/layout.svelte": () => Promise.resolve().then(function() {
    return layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  })
};
const metadata_lookup = { ".svelte-kit/build/components/layout.svelte": { "entry": "layout.svelte-736b531e.js", "css": [], "js": ["layout.svelte-736b531e.js", "chunks/vendor-6710fca7.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-4bc74f01.js", "css": [], "js": ["error.svelte-4bc74f01.js", "chunks/vendor-6710fca7.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-6a26ccbb.js", "css": ["assets/pages/index.svelte-f999f68d.css"], "js": ["pages/index.svelte-6a26ccbb.js", "chunks/vendor-6710fca7.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${slots.default ? slots.default({}) : ``}`;
});
var layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Layout
});
function load({ error: error2, status }) {
  return { props: { error: error2, status } };
}
const Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error2 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
});
var error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load
});
var Logo_svelte_svelte_type_style_lang$1 = ".logo.svelte-1qios99{height:100%;width:100%}";
var MobileHome_svelte_svelte_type_style_lang = ".content-container.svelte-1yay9qo.svelte-1yay9qo{display:flex;flex-direction:column;gap:10px;align-items:center;width:100%;overflow-y:scroll}.video-stroke.svelte-1yay9qo.svelte-1yay9qo{position:fixed;z-index:1;height:60px;width:100%;top:0}.video-stroke.svelte-1yay9qo .video-bg.svelte-1yay9qo{width:100%}.header-container.svelte-1yay9qo.svelte-1yay9qo{font-family:Orator;width:100%;display:flex;z-index:3;gap:10px;flex-direction:column;justify-content:center;align-items:center;white-space:nowrap;text-align:center;text-transform:uppercase}.container.svelte-1yay9qo.svelte-1yay9qo{color:white;display:flex;align-items:center;overflow:hidden;gap:10px;height:100vh;padding:10px;overflow:hidden;background-color:black;flex-direction:column;justify-content:center}.logo-container.svelte-1yay9qo.svelte-1yay9qo{width:350px}.thumbnail-container.svelte-1yay9qo.svelte-1yay9qo{width:40px;height:40px;overflow:hidden}.thumbnail-container.svelte-1yay9qo img.svelte-1yay9qo{border-radius:50%;width:100%;height:100%;display:block;object-fit:cover}.list-container.svelte-1yay9qo.svelte-1yay9qo{display:flex;gap:20px;text-transform:uppercase;flex-direction:column;width:100%;padding:0 20px}.item-container.svelte-1yay9qo.svelte-1yay9qo{padding:1rem 1rem;border-radius:72px;font-family:unisansB;font-size:2em;display:flex;width:100%;justify-content:space-between;align-items:center;background-color:#68208e}.content-container.svelte-1yay9qo.svelte-1yay9qo{z-index:1}";
var brush1 = "/_app/assets/brush-121e5538.mp4";
var Bar_svelte_svelte_type_style_lang = ".bar-container.svelte-136oxf1{z-index:1;opacity:1;pointer-events:none;overflow:hidden;height:100%;position:absolute;background-color:white}@media screen and (max-width: 1350px){.bar-container.svelte-136oxf1:nth-child(6){display:none}.bar-container.svelte-136oxf1:nth-child(24){display:none}}@media screen and (max-width: 950px){.bar-container.svelte-136oxf1:nth-child(3n){display:none}}@media screen and (max-width: 590px){.bar-container.svelte-136oxf1{display:none}}.bar-container.svelte-136oxf1:nth-child(1){left:2%;top:0%;width:1%}.bar-container.svelte-136oxf1:nth-child(2){left:3.6%;top:0%;width:0.9%}.bar-container.svelte-136oxf1:nth-child(3){left:6.9%;top:0%;width:2%}.bar-container.svelte-136oxf1:nth-child(4){left:0;top:0%}.bar-container.svelte-136oxf1:nth-child(5){left:14.3%;top:0%}.bar-container.svelte-136oxf1:nth-child(6){left:17.8%;top:0%;width:1.5%}.bar-container.svelte-136oxf1:nth-child(7){left:20%;top:0%;width:1.1%}.bar-container.svelte-136oxf1:nth-child(8){left:23.1%;top:0%;width:1.9%}.bar-container.svelte-136oxf1:nth-child(9){left:25.7%;top:0%;width:1%}.bar-container.svelte-136oxf1:nth-child(10){left:28.8%;top:0%;width:1%}.bar-container.svelte-136oxf1:nth-child(11){left:32%;top:0%;width:1.9%}.bar-container.svelte-136oxf1:nth-child(13){left:46.6%;top:0%;width:1%}.bar-container.svelte-136oxf1:nth-child(14){left:49.8%;top:0%;width:1.9%}.bar-container.svelte-136oxf1:nth-child(15){left:54%;top:0%;width:0.9%}.bar-container.svelte-136oxf1:nth-child(16){left:55.6%;top:0%;width:1.8%}.bar-container.svelte-136oxf1:nth-child(17){left:59.5%;top:0%;width:1.1%}.bar-container.svelte-136oxf1:nth-child(19){left:91.3%;top:0%;width:1.1%}.bar-container.svelte-136oxf1:nth-child(20){left:64.5%;top:0%;width:1%}.bar-container.svelte-136oxf1:nth-child(21){left:66.4%;top:0%;width:0.9%}.bar-container.svelte-136oxf1:nth-child(22){left:69.4%;top:0%;width:1.9%}.bar-container.svelte-136oxf1:nth-child(23){left:73.5%;top:0%;width:0.9%}.bar-container.svelte-136oxf1:nth-child(24){left:79.9%;top:0%;width:1.7%}.bar-container.svelte-136oxf1:nth-child(25){left:82.5%;top:0%;width:0.8%}.bar-container.svelte-136oxf1:nth-child(26){left:85.5%;top:0%;width:1.2%}.bar-container.svelte-136oxf1:nth-child(27){left:88.9%;top:0%;width:1.7%}.bar-container.svelte-136oxf1:nth-child(28){right:0;top:0%}.bar-container.svelte-136oxf1:nth-child(29){left:97.9%;top:0%;width:1.7%}";
var GalleryModal_svelte_svelte_type_style_lang = ".modal-container.svelte-1qcq391.svelte-1qcq391{z-index:10;position:fixed;height:100vh;width:100vw;overflow-y:auto;top:0;padding:20px;right:0;background-color:rgba(10, 10, 10, 0.705)}.gallery-container-flex.svelte-1qcq391.svelte-1qcq391{display:flex;flex-direction:column;justify-content:center;align-items:center}.gallery-container.svelte-1qcq391.svelte-1qcq391{max-width:800px;width:100%;display:flex;flex-direction:column;gap:5px}.image-container.svelte-1qcq391.svelte-1qcq391{width:100%}.image-container.svelte-1qcq391 .gallery-img.svelte-1qcq391{width:100%;object-fit:cover}";
var LeftArrow_svelte_svelte_type_style_lang = ".close-main.svelte-g4x0ir{display:block;cursor:pointer;width:20px;position:absolute;right:30px;height:20px}";
var Navbar_svelte_svelte_type_style_lang = ".top-nav-container.svelte-6gz00a.svelte-6gz00a{width:100%;background-color:black;padding:10px;display:flex;justify-content:center;align-items:center;box-shadow:0 2px 4px -1px rgba(0, 0, 0, 0.25)}.top-nav-container.svelte-6gz00a .logo-container.svelte-6gz00a{cursor:pointer;width:350px;position:relative;pointer-events:all;z-index:5}";
var MapArrow_svelte_svelte_type_style_lang = ".icon.svelte-mytkhd{width:35px;top:-25px;left:0;right:0;margin:auto;position:absolute}";
var MapBar_svelte_svelte_type_style_lang = '.container.svelte-1xeecl0.svelte-1xeecl0{z-index:3;font-family:unisansB}.container.svelte-1xeecl0 .bottom-bar-container.svelte-1xeecl0{text-transform:uppercase;font-size:2em;padding:5px;cursor:pointer;letter-spacing:0.1em;background-image:url("__VITE_ASSET__b2060247__");text-align:center}';
var Bar3GalleryImage_svelte_svelte_type_style_lang = ".grid-item-container.svelte-10ppc9f.svelte-10ppc9f{display:flex;flex:calc(100% / 5);opacity:0;flex-direction:column}@media screen and (max-width: 975px){.grid-item-container.svelte-10ppc9f.svelte-10ppc9f{flex:calc(100% / 3);gap:0px}}@media screen and (max-width: 600px){.grid-item-container.svelte-10ppc9f.svelte-10ppc9f{flex:100%;max-width:100%}}.grid-item-container.svelte-10ppc9f .label.svelte-10ppc9f{text-align:left;font-size:1em;line-height:0.8em;font-weight:900;letter-spacing:3px;font-family:unisansB;padding:1.2rem;color:#68208e;text-transform:uppercase}.grid-item-container.svelte-10ppc9f .image-container.svelte-10ppc9f{cursor:pointer;height:300px;width:100%;overflow:hidden}@media screen and (max-width: 600px){.grid-item-container.svelte-10ppc9f .image-container.svelte-10ppc9f{height:auto;width:100%}}.grid-item-container.svelte-10ppc9f .image-container .grid-image.svelte-10ppc9f{object-fit:cover;width:100%;height:100%;object-position:center center}";
var Bar3Gallery_svelte_svelte_type_style_lang = ".container.svelte-wh9tq7.svelte-wh9tq7{display:flex;flex-direction:column;align-items:center;width:100%;overflow:hidden;justify-content:center}.container.svelte-wh9tq7 .content-container.svelte-wh9tq7{width:100%;max-width:1200px}.gallery-container.svelte-wh9tq7.svelte-wh9tq7{display:grid;gap:10px;overflow-y:auto;max-width:1300px;width:100%;display:flex;flex-wrap:wrap}";
var Modal_svelte_svelte_type_style_lang = ".container.svelte-sha4yt.svelte-sha4yt{position:fixed;height:100vh;width:100vw;overflow-y:auto;top:0;display:flex;align-items:center;justify-content:center;right:0;z-index:20;background-color:rgba(10, 10, 10, 0.705)}.container.svelte-sha4yt .image-container .image.svelte-sha4yt{max-height:80vh;max-width:60vw;height:auto;width:auto;object-fit:cover;object-position:center center}";
var About_svelte_svelte_type_style_lang = '.glitch-image-container.svelte-15c66y.svelte-15c66y{position:absolute;top:0;left:0;width:100%;height:100%}.glitch-image-container.svelte-15c66y.svelte-15c66y:hover{opacity:1}.glitch-image-container.svelte-15c66y .glitch-image.svelte-15c66y{pointer-events:none;background-size:cover;background-position:50% 50%;position:absolute;top:0;left:0;width:100%;height:100%;transform:translate3d(0, 0, 0);background-image:url("__VITE_ASSET__07a16dc1__")}.glitch-image-container.svelte-15c66y .glitch-image.svelte-15c66y:nth-child(n+2){opacity:0;top:calc(-1 * 2px);left:calc(-1 * 10px);width:calc(100% + 10px * 2);height:calc(100% + 2px * 2)}.glitch-container.svelte-15c66y .glitch-image.svelte-15c66y{opacity:1 !important}.glitch-container.svelte-15c66y .glitch-image.svelte-15c66y:nth-child(2){transform:translate3d(10px, 0, 0);animation:svelte-15c66y-glitch-anim-1 2s linear alternate}.glitch-container.svelte-15c66y .glitch-image.svelte-15c66y:nth-child(3){transform:translate3d(calc(-1 * 10px), 0, 0);animation:svelte-15c66y-glitch-anim-2 2s linear alternate}.glitch-container.svelte-15c66y .glitch-image.svelte-15c66y:nth-child(4){transform:translate3d(0, calc(-1 * 2px), 0) scale3d(-1, -1, 1);animation:svelte-15c66y-glitch-anim-3 2s linear alternate}.glitch-container.svelte-15c66y .glitch-image.svelte-15c66y:nth-child(5){animation:svelte-15c66y-glitch-anim-flash 0.5s steps(1, end)}@keyframes svelte-15c66y-glitch-anim-flash{0%{opacity:0.2;transform:translate3d(var(--gap), var(--gap-vertical), 0)}33%,100%{opacity:0;transform:translate3d(0, 0, 0)}}@keyframes svelte-15c66y-glitch-anim-1{0%{-webkit-clip-path:polygon(0 2%, 100% 2%, 100% 5%, 0 5%);clip-path:polygon(0 2%, 100% 2%, 100% 5%, 0 5%)}10%{-webkit-clip-path:polygon(0 15%, 100% 15%, 100% 15%, 0 15%);clip-path:polygon(0 15%, 100% 15%, 100% 15%, 0 15%)}20%{-webkit-clip-path:polygon(0 10%, 100% 10%, 100% 20%, 0 20%);clip-path:polygon(0 10%, 100% 10%, 100% 20%, 0 20%)}30%{-webkit-clip-path:polygon(0 1%, 100% 1%, 100% 2%, 0 2%);clip-path:polygon(0 1%, 100% 1%, 100% 2%, 0 2%)}40%{-webkit-clip-path:polygon(0 33%, 100% 33%, 100% 33%, 0 33%);clip-path:polygon(0 33%, 100% 33%, 100% 33%, 0 33%)}50%{-webkit-clip-path:polygon(0 44%, 100% 44%, 100% 44%, 0 44%);clip-path:polygon(0 44%, 100% 44%, 100% 44%, 0 44%)}60%{-webkit-clip-path:polygon(0 50%, 100% 50%, 100% 20%, 0 20%);clip-path:polygon(0 50%, 100% 50%, 100% 20%, 0 20%)}70%{-webkit-clip-path:polygon(0 70%, 100% 70%, 100% 70%, 0 70%);clip-path:polygon(0 70%, 100% 70%, 100% 70%, 0 70%)}80%{-webkit-clip-path:polygon(0 80%, 100% 80%, 100% 80%, 0 80%);clip-path:polygon(0 80%, 100% 80%, 100% 80%, 0 80%)}90%{-webkit-clip-path:polygon(0 50%, 100% 50%, 100% 55%, 0 55%);clip-path:polygon(0 50%, 100% 50%, 100% 55%, 0 55%)}100%{-webkit-clip-path:polygon(0 70%, 100% 70%, 100% 80%, 0 80%);clip-path:polygon(0 70%, 100% 70%, 100% 80%, 0 80%)}}@keyframes svelte-15c66y-glitch-anim-2{0%{-webkit-clip-path:polygon(0 25%, 100% 25%, 100% 30%, 0 30%);clip-path:polygon(0 25%, 100% 25%, 100% 30%, 0 30%)}15%{-webkit-clip-path:polygon(0 3%, 100% 3%, 100% 3%, 0 3%);clip-path:polygon(0 3%, 100% 3%, 100% 3%, 0 3%)}22%{-webkit-clip-path:polygon(0 5%, 100% 5%, 100% 20%, 0 20%);clip-path:polygon(0 5%, 100% 5%, 100% 20%, 0 20%)}31%{-webkit-clip-path:polygon(0 20%, 100% 20%, 100% 20%, 0 20%);clip-path:polygon(0 20%, 100% 20%, 100% 20%, 0 20%)}45%{-webkit-clip-path:polygon(0 40%, 100% 40%, 100% 40%, 0 40%);clip-path:polygon(0 40%, 100% 40%, 100% 40%, 0 40%)}51%{-webkit-clip-path:polygon(0 52%, 100% 52%, 100% 59%, 0 59%);clip-path:polygon(0 52%, 100% 52%, 100% 59%, 0 59%)}63%{-webkit-clip-path:polygon(0 60%, 100% 60%, 100% 60%, 0 60%);clip-path:polygon(0 60%, 100% 60%, 100% 60%, 0 60%)}76%{-webkit-clip-path:polygon(0 75%, 100% 75%, 100% 75%, 0 75%);clip-path:polygon(0 75%, 100% 75%, 100% 75%, 0 75%)}81%{-webkit-clip-path:polygon(0 65%, 100% 65%, 100% 40%, 0 40%);clip-path:polygon(0 65%, 100% 65%, 100% 40%, 0 40%)}94%{-webkit-clip-path:polygon(0 45%, 100% 45%, 100% 50%, 0 50%);clip-path:polygon(0 45%, 100% 45%, 100% 50%, 0 50%)}100%{-webkit-clip-path:polygon(0 14%, 100% 14%, 100% 33%, 0 33%);clip-path:polygon(0 14%, 100% 14%, 100% 33%, 0 33%)}}@keyframes svelte-15c66y-glitch-anim-3{0%{-webkit-clip-path:polygon(0 1%, 100% 1%, 100% 3%, 0 3%);clip-path:polygon(0 1%, 100% 1%, 100% 3%, 0 3%)}5%{-webkit-clip-path:polygon(0 10%, 100% 10%, 100% 9%, 0 9%);clip-path:polygon(0 10%, 100% 10%, 100% 9%, 0 9%)}10%{-webkit-clip-path:polygon(0 5%, 100% 5%, 100% 6%, 0 6%);clip-path:polygon(0 5%, 100% 5%, 100% 6%, 0 6%)}25%{-webkit-clip-path:polygon(0 20%, 100% 20%, 100% 20%, 0 20%);clip-path:polygon(0 20%, 100% 20%, 100% 20%, 0 20%)}27%{-webkit-clip-path:polygon(0 10%, 100% 10%, 100% 10%, 0 10%);clip-path:polygon(0 10%, 100% 10%, 100% 10%, 0 10%)}30%{-webkit-clip-path:polygon(0 30%, 100% 30%, 100% 25%, 0 25%);clip-path:polygon(0 30%, 100% 30%, 100% 25%, 0 25%)}33%{-webkit-clip-path:polygon(0 15%, 100% 15%, 100% 16%, 0 16%);clip-path:polygon(0 15%, 100% 15%, 100% 16%, 0 16%)}37%{-webkit-clip-path:polygon(0 40%, 100% 40%, 100% 39%, 0 39%);clip-path:polygon(0 40%, 100% 40%, 100% 39%, 0 39%)}40%{-webkit-clip-path:polygon(0 20%, 100% 20%, 100% 21%, 0 21%);clip-path:polygon(0 20%, 100% 20%, 100% 21%, 0 21%)}45%{-webkit-clip-path:polygon(0 60%, 100% 60%, 100% 55%, 0 55%);clip-path:polygon(0 60%, 100% 60%, 100% 55%, 0 55%)}50%{-webkit-clip-path:polygon(0 30%, 100% 30%, 100% 31%, 0 31%);clip-path:polygon(0 30%, 100% 30%, 100% 31%, 0 31%)}53%{-webkit-clip-path:polygon(0 70%, 100% 70%, 100% 69%, 0 69%);clip-path:polygon(0 70%, 100% 70%, 100% 69%, 0 69%)}57%{-webkit-clip-path:polygon(0 40%, 100% 40%, 100% 41%, 0 41%);clip-path:polygon(0 40%, 100% 40%, 100% 41%, 0 41%)}60%{-webkit-clip-path:polygon(0 80%, 100% 80%, 100% 75%, 0 75%);clip-path:polygon(0 80%, 100% 80%, 100% 75%, 0 75%)}65%{-webkit-clip-path:polygon(0 50%, 100% 50%, 100% 51%, 0 51%);clip-path:polygon(0 50%, 100% 50%, 100% 51%, 0 51%)}70%{-webkit-clip-path:polygon(0 90%, 100% 90%, 100% 90%, 0 90%);clip-path:polygon(0 90%, 100% 90%, 100% 90%, 0 90%)}73%{-webkit-clip-path:polygon(0 60%, 100% 60%, 100% 60%, 0 60%);clip-path:polygon(0 60%, 100% 60%, 100% 60%, 0 60%)}80%{-webkit-clip-path:polygon(0 100%, 100% 100%, 100% 99%, 0 99%);clip-path:polygon(0 100%, 100% 100%, 100% 99%, 0 99%)}100%{-webkit-clip-path:polygon(0 70%, 100% 70%, 100% 71%, 0 71%);clip-path:polygon(0 70%, 100% 70%, 100% 71%, 0 71%)}}.container.svelte-15c66y.svelte-15c66y{overflow-y:auto}.content-container.svelte-15c66y.svelte-15c66y{display:flex;gap:40px;flex-direction:column;align-items:center}.main-text-content.svelte-15c66y.svelte-15c66y{color:black;font-family:"Open Sans", sans-serif;text-align:center;font-size:1.5em;max-width:1200px;width:100%}.image.svelte-15c66y.svelte-15c66y{width:100%}.glitch-image-wrapper.svelte-15c66y.svelte-15c66y{max-width:568px;width:100%;overflow:hidden;position:relative}.main-image-container.svelte-15c66y.svelte-15c66y{width:100%;height:100%}.main-image-container.svelte-15c66y .image-main.svelte-15c66y{background-position:50% 50%;width:100%;height:100%;background-image:url()}.content-image-container.svelte-15c66y.svelte-15c66y{width:100%;pointer-events:none}.container.svelte-15c66y.svelte-15c66y{gap:40px}';
var ArtImage_svelte_svelte_type_style_lang = ".item-container.svelte-1nm718o.svelte-1nm718o{flex:calc(100% / 6);width:100%;cursor:pointer;opacity:0}.item-container.svelte-1nm718o .image-container.svelte-1nm718o{overflow:hidden;width:100%;height:100%}.item-container.svelte-1nm718o .image-container .image.svelte-1nm718o{width:100%;height:100%;object-fit:cover;object-position:center center}@media screen and (max-width: 900px){.item-container.svelte-1nm718o.svelte-1nm718o{flex:calc(100% / 5)}}@media screen and (max-width: 600px){.item-container.svelte-1nm718o.svelte-1nm718o{flex:calc(100% / 3)}}@media screen and (max-width: 480px){.item-container.svelte-1nm718o.svelte-1nm718o{flex:calc(100% / 1)}}";
var Art_svelte_svelte_type_style_lang = ".container.svelte-8kdlbv{display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%}.flex-container.svelte-8kdlbv{display:flex;gap:10px;flex-wrap:wrap;width:100%;max-width:1700px}";
var MalibuRebuild_svelte_svelte_type_style_lang = '.bottom-text-container.svelte-m1dsk4.svelte-m1dsk4{font-size:0.6em}.container.svelte-m1dsk4.svelte-m1dsk4{font-family:unisans;display:flex;align-items:center;justify-content:center;flex-direction:column;color:#68208e}h3.svelte-m1dsk4.svelte-m1dsk4{font-weight:900;font-size:2em;text-align:center;margin-bottom:40px;font-family:"unisansB"}.text-container.svelte-m1dsk4.svelte-m1dsk4{text-align:center;font-size:2em;display:flex;flex-direction:column;gap:20px;max-width:900px}.text-container.svelte-m1dsk4 p.svelte-m1dsk4{font-size:0.8em;font-weight:700}.text-container.svelte-m1dsk4 p.svelte-m1dsk4:last-child{font-size:0.6em}.text-container.svelte-m1dsk4 .credit p.svelte-m1dsk4{font-size:0.4em}@media screen and (max-width: 720px){.text-container.svelte-m1dsk4.svelte-m1dsk4{font-size:1.5em}}';
var Card_svelte_svelte_type_style_lang = '.card-container.svelte-1viah24{transform:rotateX(0deg);transform-style:preserve-3d;display:flex;justify-content:center;align-items:center;position:absolute;width:300px;height:500px;will-change:transform;touch-action:none;box-shadow:0 12.5px 100px -10px rgba(50, 50, 73, 0.2), 0 10px 10px -10px rgba(50, 50, 73, 0.2)}@media screen and (max-width: 510px){.card-container.svelte-1viah24{width:200px;height:350px}}.image-container.svelte-1viah24{overflow:hidden;border-radius:10px;transform:rotateY(-180deg);height:100%}img.svelte-1viah24{height:100%;width:100%;touch-action:none;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.back-container.svelte-1viah24{content:"";z-index:-1;position:absolute;transform:rotateX(0deg) translate3d(0px, 0px, 1px);display:block;width:100%}@media screen and (max-width: 510px){.back-container.svelte-1viah24{width:200px;height:350px}}';
var MeetTheTeam_svelte_svelte_type_style_lang = `.card-outline.svelte-1o41gfy.svelte-1o41gfy{width:300px;height:500px;border-radius:20px;margin-right:50px;background-image:url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='53' ry='53' stroke='white' stroke-width='4'  stroke-dasharray='36%2c 18%2c 28%2c 25' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");border-radius:53px}.card-layout-container.svelte-1o41gfy.svelte-1o41gfy{display:flex;width:100%;margin-bottom:140px;align-items:center;justify-content:center}.image-container.svelte-1o41gfy.svelte-1o41gfy{width:60px;margin-right:50px}.image-container.svelte-1o41gfy img.svelte-1o41gfy{width:100%;object-fit:cover}.page-container.svelte-1o41gfy.svelte-1o41gfy{height:100%;display:flex;align-items:center}.card-wrapper.svelte-1o41gfy.svelte-1o41gfy{width:300px;height:500px}@media screen and (max-width: 510px){.card-wrapper.svelte-1o41gfy.svelte-1o41gfy{width:200px;height:400px}}.container.svelte-1o41gfy.svelte-1o41gfy{max-width:1600px;width:100%}`;
var MainPageHeader_svelte_svelte_type_style_lang = ".main-text-header.svelte-oygvb9{font-size:6em;line-height:0.8em;font-weight:900;letter-spacing:3px;white-space:nowrap;font-family:unisansB;text-align:center;top:5vh;right:0;left:0;padding:20px;color:#68208e;text-transform:uppercase}@media screen and (max-width: 820px){.main-text-header.svelte-oygvb9{font-size:10vw}}";
var PageContent_svelte_svelte_type_style_lang = ".page-content-container.svelte-17c2bkx{width:100%;height:100%;display:flex;flex-direction:column;align-items:center}@media screen and (max-width: 900px){.page-content-container.svelte-17c2bkx{font-size:0.8rem}}@media screen and (max-width: 500px){.page-content-container.svelte-17c2bkx{font-size:0.6rem}}.main-page-container.svelte-17c2bkx{overflow:auto;width:100vw;height:100%}";
var PressCard_svelte_svelte_type_style_lang = ".image-container.svelte-1gomnhd{opacity:0;height:100%;height:fit-content;filter:grayscale(1)}.image-container.svelte-1gomnhd:nth-child(2){grid-area:8/11/20/16;opacity:1;width:100%}@media screen and (max-width: 740px){.image-container.svelte-1gomnhd:nth-child(2){grid-area:8/8/20/17}}.image-container.svelte-1gomnhd:nth-child(3){grid-row-start:22;grid-row-end:30;grid-column-start:13;grid-column-end:18;opacity:1}@media screen and (max-width: 740px){.image-container.svelte-1gomnhd:nth-child(3){grid-row-start:22;grid-row-end:30;grid-column-start:15;grid-column-end:24;opacity:1}}.image-container.svelte-1gomnhd:nth-child(4){grid-row-start:5;grid-row-end:14;grid-column-start:3;grid-column-end:7;opacity:1}@media screen and (max-width: 740px){.image-container.svelte-1gomnhd:nth-child(4){grid-row-start:4;grid-row-end:14;grid-column-start:2;grid-column-end:7;opacity:1}}.image-container.svelte-1gomnhd:nth-child(5){grid-row-start:18;grid-row-end:23;grid-column-start:21;grid-column-end:24;opacity:1}@media screen and (max-width: 740px){.image-container.svelte-1gomnhd:nth-child(5){grid-row-start:16;grid-row-end:23;grid-column-start:17;grid-column-end:25;opacity:1}}.image-container.svelte-1gomnhd:nth-child(6){grid-row-start:5;grid-row-end:16;grid-column-start:20;grid-column-end:25;opacity:1;z-index:2}.image-container.svelte-1gomnhd:nth-child(7){grid-row-start:18;grid-row-end:21;grid-column-start:4;grid-column-end:9;opacity:1}@media screen and (max-width: 740px){.image-container.svelte-1gomnhd:nth-child(7){grid-row-start:20;grid-row-end:21;grid-column-start:1;grid-column-end:9;opacity:1}}.image-container.svelte-1gomnhd:nth-child(8){grid-row-start:3;grid-row-end:6;grid-column-start:18;grid-column-end:22;opacity:1;z-index:1}.image.svelte-1gomnhd{cursor:pointer;width:100%;object-position:center center;object-fit:cover}";
var Press_svelte_svelte_type_style_lang = ".text-image-wrapper.svelte-brrvbf.svelte-brrvbf{max-height:700px;grid-area:6/1/26/26;display:grid;grid-template-columns:repeat(25, 4%);grid-template-rows:repeat(25, 4%);padding:0 7vw;align-items:center;justify-content:center;height:100%;width:100%;pointer-events:none;z-index:4}.text-image-wrapper.svelte-brrvbf img.svelte-brrvbf{height:100%;width:100%;object-fit:cover}.text-image-wrapper.svelte-brrvbf .text-image-container.svelte-brrvbf:nth-child(1){grid-area:1/21/13/28;transform:rotateZ(25.8deg)}.text-image-wrapper.svelte-brrvbf .text-image-container.svelte-brrvbf:nth-child(2){grid-area:24/3/13/9;transform:rotateZ(-7.7deg)}.text-image-wrapper.svelte-brrvbf .text-image-container.svelte-brrvbf:nth-child(3){grid-area:26/15/13/28;transform:rotateZ(7.7deg)}.text-image-wrapper.svelte-brrvbf .text-image-container.svelte-brrvbf:nth-child(4){grid-area:11/3/16/24}.text-image-wrapper.svelte-brrvbf .text-image-container.svelte-brrvbf:nth-child(5){transform:rotateZ(-10deg);grid-area:2/3/12/11}.content-container.svelte-brrvbf.svelte-brrvbf{grid-template-columns:repeat(25, 4%);grid-template-rows:repeat(25, 4%);max-width:1788px;display:grid;width:100%;height:100%}.container.svelte-brrvbf.svelte-brrvbf{position:relative;width:100%;height:100%;display:flex;justify-content:center;align-items:center}";
var SculptureImage_svelte_svelte_type_style_lang = "@media screen and (max-width: 800px){.expand-height.svelte-td3usn.svelte-td3usn{height:23.8%}.expand-height.svelte-td3usn .image-container.svelte-td3usn{height:100%}}.item-container.svelte-td3usn.svelte-td3usn{width:100%;display:flex}@media screen and (max-width: 800px){.item-container.svelte-td3usn.svelte-td3usn{flex-direction:column}}.item-container.svelte-td3usn .image-container.svelte-td3usn{overflow:hidden;width:100%}.item-container.svelte-td3usn .image-container .image.svelte-td3usn{height:100%;width:100%;opacity:0;object-fit:cover;object-position:center center}.label.svelte-td3usn.svelte-td3usn{color:#68208e;font-family:unisansB;font-size:1em;padding:5px}@media screen and (min-width: 800px){.label.svelte-td3usn.svelte-td3usn{transform:rotate(-180deg);padding-left:0.3rem;writing-mode:vertical-lr;text-align:right;line-height:0.8em;font-weight:900;letter-spacing:3px;text-transform:uppercase}}";
var Sculpture_svelte_svelte_type_style_lang = ".flex-container.svelte-1f3lzoq{display:flex;gap:20px;width:100%;flex-wrap:wrap;max-width:1700px}@media screen and (max-width: 800px){.flex-container.svelte-1f3lzoq{gap:10px}}@media screen and (max-width: 600px){.flex-container.svelte-1f3lzoq{-ms-flex:100%;flex:100%;max-width:100%}}.container.svelte-1f3lzoq{display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%}.flex-col.svelte-1f3lzoq:last-child{justify-content:flex-start}@media screen and (max-width: 800px){.flex-col.svelte-1f3lzoq{flex:49%;gap:0px;max-width:49%}}@media screen and (min-width: 800px){.flex-col.svelte-1f3lzoq{display:flex;flex-direction:column;gap:10px;flex:calc(100% / 5);width:100%}}@media screen and (max-width: 600px){.flex-col.svelte-1f3lzoq{flex:100%;max-width:100%}}";
var WhatWeDo_svelte_svelte_type_style_lang = ".content-container.svelte-10yexgh.svelte-10yexgh{max-width:900px;font-size:1.4em;color:#68208e;text-align:center;font-weight:700}.content-container.svelte-10yexgh .video-container.svelte-10yexgh{margin:1rem 0rem}.content-container.svelte-10yexgh .video-container .video.svelte-10yexgh{width:100%}.container.svelte-10yexgh.svelte-10yexgh{display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%}";
var BgLogo_svelte_svelte_type_style_lang = ".logo-caption.svelte-ns37sf.svelte-ns37sf{display:block;height:fit-content;font-family:unisansB;white-space:nowrap;color:#a5a5a5;font-weight:900;transform:rotate(-180deg);font-size:5em;writing-mode:vertical-lr;text-transform:uppercase}.logo-container.svelte-ns37sf.svelte-ns37sf{max-width:200px;display:flex;position:absolute;left:0;top:0;transform:translateY(20%);justify-content:center;width:100%;z-index:3}.logo-container.svelte-ns37sf img.svelte-ns37sf{object-fit:cover;height:auto;width:100%}";
var FurnitureImage_svelte_svelte_type_style_lang = ".label.svelte-1j40xuz.svelte-1j40xuz{writing-mode:vertical-lr;text-align:left;font-size:1em;line-height:0.8em;font-weight:900;transform-origin:center center;letter-spacing:3px;font-family:unisansB;padding:1.2rem;float:left;color:#68208e;text-transform:uppercase}@media screen and (max-width: 600px){.label.svelte-1j40xuz.svelte-1j40xuz{writing-mode:horizontal-tb}}.item-container.svelte-1j40xuz.svelte-1j40xuz{width:100%;display:flex;flex:32%;opacity:0;max-width:32%;cursor:pointer}.item-container.svelte-1j40xuz .image-container.svelte-1j40xuz{width:100%;height:100%;float:right}.item-container.svelte-1j40xuz .image-container .image.svelte-1j40xuz{display:block;height:100%;width:100%;object-fit:cover;object-position:center center}@media screen and (max-width: 800px){.item-container.svelte-1j40xuz.svelte-1j40xuz{flex:49%;max-width:49%}}@media screen and (max-width: 600px){.item-container.svelte-1j40xuz.svelte-1j40xuz{flex:100%;max-width:100%;flex-direction:column-reverse}}";
var Furniture_svelte_svelte_type_style_lang = "@media screen and (max-width: 800px){}@media screen and (min-width: 800px){}@media screen and (max-width: 600px){}.container.svelte-1a52hcx{display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%}.flex-container.svelte-1a52hcx{width:100%;display:flex;flex-wrap:wrap;gap:10px;max-width:1500px}";
var MenuItem_svelte_svelte_type_style_lang = "@keyframes svelte-1w32dzc-marquee{100%{transform:translate3d(-50%, 0, 0)}}.marquee__inner.svelte-1w32dzc.svelte-1w32dzc{animation:svelte-1w32dzc-marquee 15s linear infinite}.marquee__img.svelte-1w32dzc.svelte-1w32dzc{width:15vw;height:70%;margin:0 2vw;border-radius:5vw;background-size:cover;background-position:50% 50%}.menu__item.svelte-1w32dzc.svelte-1w32dzc{cursor:default;position:relative;overflow:hidden;z-index:5;font-family:unisansB;text-align:center;box-shadow:0 -1px black}.menu__item.svelte-1w32dzc.svelte-1w32dzc:last-child{box-shadow:0 1px black, 0 -1px black}.menu__item-link.svelte-1w32dzc.svelte-1w32dzc{display:block;position:relative;cursor:pointer;color:black;text-decoration:none}.marquee.svelte-1w32dzc.svelte-1w32dzc{position:absolute;top:0;left:0;overflow:hidden;width:100%;height:100%;pointer-events:none;background:#68208e;transform:translate3d(0, 101%, 0)}.marquee__inner-wrap.svelte-1w32dzc.svelte-1w32dzc{height:100%;width:100%;transform:translate3d(0, -101%, 0)}.marquee__inner.svelte-1w32dzc.svelte-1w32dzc{height:100%;width:fit-content;align-items:center;display:flex;position:relative;animation:svelte-1w32dzc-marquee 15s linear infinite;will-change:transform}@keyframes svelte-1w32dzc-marquee{100%{transform:translate3d(-50%, 0, 0)}}.menu__item-link.svelte-1w32dzc.svelte-1w32dzc,.marquee.svelte-1w32dzc span.svelte-1w32dzc{white-space:nowrap;font-size:6vw;line-height:1.2;font-weight:600;padding:1vh 1vw 0;text-transform:uppercase}@media screen and (max-width: 820px){.menu__item-link.svelte-1w32dzc.svelte-1w32dzc,.marquee.svelte-1w32dzc span.svelte-1w32dzc{font-size:10vw}}.marquee.svelte-1w32dzc span.svelte-1w32dzc{text-align:center;color:var(--marquee-text);font-weight:400}";
({
  3: {
    pages: [
      {
        title: "meet amit apel",
        labels: Array(8).fill("meet amit apel")
      },
      {
        title: "meet the team",
        labels: Array(8).fill("meet the team")
      },
      {
        title: "what we do",
        labels: Array(8).fill("what we do")
      },
      {
        title: "malibu rebuild",
        labels: Array(8).fill("malibu rebuild")
      },
      {
        title: "press",
        labels: Array(8).fill("press")
      }
    ],
    category: "apel design"
  },
  17: {
    pages: [
      {
        title: "private homes",
        labels: Array(8).fill("private homes")
      },
      {
        title: "multi units",
        labels: Array(8).fill("multi units")
      },
      {
        title: "concept",
        labels: Array(8).fill("concept")
      },
      {
        title: "render videos",
        labels: Array(8).fill("render videos")
      }
    ],
    category: "architecture"
  },
  23: {
    pages: [
      {
        title: "sculpture",
        labels: Array(8).fill("sculpture")
      },
      {
        title: "furniture",
        labels: Array(8).fill("furniture")
      },
      {
        title: "art",
        labels: Array(8).fill("art")
      }
    ],
    category: "design"
  }
});
var Map_svelte_svelte_type_style_lang = ".container.svelte-1pr72ox{color:black;height:100%}#map.svelte-1pr72ox{width:100%;height:100%}.inactive.svelte-1pr72ox{display:none}";
var MapWrapper_svelte_svelte_type_style_lang = ".map-container.svelte-1eobast{position:relative}.container.svelte-1eobast{position:absolute;bottom:0;background-color:white;width:100%;z-index:3}";
var Marque_svelte_svelte_type_style_lang = '.page-content-container.svelte-7tfzfl{padding:20px 20px 0 20px;overflow:hidden;display:flex;justify-content:center;align-items:center;gap:25px;z-index:10;position:absolute;width:100vw;height:100%}.page-transition-black.svelte-7tfzfl{background-color:black;width:100vw;position:absolute;bottom:0;height:0vh;z-index:3}.container.svelte-7tfzfl{height:100%;margin:0;--color-text:#111;--color-bg:white;--color-link:#000;--color-link-hover:#000;--color-border:#a7927b;--marquee-bg:#000;--marquee-text:#fff;--menu-focus:#775e41;z-index:6;position:relative;background-color:white;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background-repeat:no-repeat;background-size:cover;background-image:url("__VITE_ASSET__112e1098__")}.menu-wrap.svelte-7tfzfl{font-family:reason-new, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;display:flex;background-size:cover;z-index:10;flex-direction:column;width:100vw;height:100%;position:relative;justify-content:center}.page-wrapper.svelte-7tfzfl{height:100vh;display:flex;flex-direction:column}';
var LargeBar_svelte_svelte_type_style_lang = ".bar-container.svelte-fopok.svelte-fopok{width:100%;position:relative;height:100%;overflow:hidden}.main-label-container.svelte-fopok.svelte-fopok{text-transform:uppercase;position:absolute;opacity:0;font-size:1.4em;text-align:center;top:0}.cover-image.svelte-fopok.svelte-fopok{height:100%;object-position:center center;width:100%;object-fit:cover}.should-animate.svelte-fopok.svelte-fopok{opacity:0;pointer-events:none}.bar-wrapper.svelte-fopok.svelte-fopok{width:20%;top:0;position:absolute;display:flex;flex-direction:column;align-items:center;z-index:1;background-color:transparent;height:100%}.opened.svelte-fopok.svelte-fopok{z-index:3}.bar-3.svelte-fopok.svelte-fopok{left:0}.bar-3.svelte-fopok .main-label-container.svelte-fopok{top:-50px}.bar-17.svelte-fopok.svelte-fopok{left:20vw}.bar-17.svelte-fopok .main-label-container.svelte-fopok{top:-25px}.bar-23.svelte-fopok.svelte-fopok{right:20vw}.bar-23.svelte-fopok .main-label-container.svelte-fopok{top:-25px}.bar-28.svelte-fopok.svelte-fopok{right:0}.bar-28.svelte-fopok .main-label-container.svelte-fopok{top:-25px}";
var Logo_svelte_svelte_type_style_lang = ".bar-container.svelte-29y9aa{height:70vh;z-index:3;display:flex;gap:20px;width:100%;max-width:1700px;align-items:center;justify-content:center;position:relative}";
var Home_svelte_svelte_type_style_lang = '.main-text.svelte-1b4g18x.svelte-1b4g18x{padding-bottom:2.8rem}.video-bg.svelte-1b4g18x.svelte-1b4g18x{position:fixed;left:50%;top:50%;object-fit:cover;width:100vw;height:100vh;transform:translate(-50%, -50%)}.video-stroke.svelte-1b4g18x.svelte-1b4g18x{width:100vw;object-fit:cover}.logo-text-container.svelte-1b4g18x.svelte-1b4g18x{max-width:500px;width:100%;z-index:2;opacity:0;padding-top:20px}.logo-text-container.svelte-1b4g18x .logo-text.svelte-1b4g18x{height:auto;object-fit:cover;width:100%}.container.svelte-1b4g18x.svelte-1b4g18x{background-repeat:no-repeat;font-family:Orator;color:white;background-size:cover;display:flex;flex-direction:column;padding:80px;gap:25px;justify-content:center;align-items:center;height:100vh;overflow:hidden}.container.svelte-1b4g18x.svelte-1b4g18x::after{position:absolute;top:0;bottom:0;left:0;right:0;width:100%;height:100%;content:""}h5.svelte-1b4g18x.svelte-1b4g18x{z-index:2;opacity:0;display:none;letter-spacing:5px;font-weight:100;font-size:4em;position:relative;text-transform:uppercase}';
const css$1 = {
  code: '.main-text.svelte-1b4g18x.svelte-1b4g18x{padding-bottom:2.8rem}.video-bg.svelte-1b4g18x.svelte-1b4g18x{position:fixed;left:50%;top:50%;object-fit:cover;width:100vw;height:100vh;transform:translate(-50%, -50%)}.video-stroke.svelte-1b4g18x.svelte-1b4g18x{width:100vw;object-fit:cover}.logo-text-container.svelte-1b4g18x.svelte-1b4g18x{max-width:500px;width:100%;z-index:2;opacity:0;padding-top:20px}.logo-text-container.svelte-1b4g18x .logo-text.svelte-1b4g18x{height:auto;object-fit:cover;width:100%}.container.svelte-1b4g18x.svelte-1b4g18x{background-repeat:no-repeat;font-family:Orator;color:white;background-size:cover;display:flex;flex-direction:column;padding:80px;gap:25px;justify-content:center;align-items:center;height:100vh;overflow:hidden}.container.svelte-1b4g18x.svelte-1b4g18x::after{position:absolute;top:0;bottom:0;left:0;right:0;width:100%;height:100%;content:""}h5.svelte-1b4g18x.svelte-1b4g18x{z-index:2;opacity:0;display:none;letter-spacing:5px;font-weight:100;font-size:4em;position:relative;text-transform:uppercase}',
  map: '{"version":3,"file":"Home.svelte","sources":["Home.svelte"],"sourcesContent":["<script>\\r\\n  import MobileHome from \\"./MobileHome/MobileHome.svelte\\";\\r\\n  import gsap from \\"gsap\\";\\r\\n  import { afterUpdate, onMount } from \\"svelte\\";\\r\\n  import brush1 from \\"../images/brush.mp4\\";\\r\\n  import logoText from \\"../images/home/logo Text.png\\";\\r\\n  import brush2 from \\"../images/Render.mp4\\";\\r\\n  import { shouldAnimate } from \\"./../animationController.js\\";\\r\\n  import Logo from \\"./Bar/Logo.svelte\\";\\r\\n\\r\\n  let loading = true;\\r\\n  let loaded = false;\\r\\n  let mobile = false;\\r\\n  const handleResize = () => {\\r\\n    if (window.innerWidth <= 950) {\\r\\n      mobile = true;\\r\\n    } else {\\r\\n      mobile = false;\\r\\n    }\\r\\n  };\\r\\n  onMount(() => {\\r\\n    window.addEventListener(\\"resize\\", handleResize);\\r\\n    if (window.innerWidth <= 950) {\\r\\n      mobile = true;\\r\\n    } else {\\r\\n      mobile = false;\\r\\n    }\\r\\n    gsap.to(\\".video-stroke\\", {\\r\\n      opacity: 0,\\r\\n      delay: 3,\\r\\n    });\\r\\n  });\\r\\n  afterUpdate(() => {\\r\\n    if (!loading) {\\r\\n      gsap.to(\\".fade\\", {\\r\\n        opacity: 1,\\r\\n        delay: 5,\\r\\n      });\\r\\n    }\\r\\n  });\\r\\n<\/script>\\r\\n\\r\\n<!-- {#if !mobile} -->\\r\\n{#if shouldAnimate}\\r\\n  <div class=\\"video-stroke\\">\\r\\n    <video\\r\\n      on:ended={() => {\\r\\n        loading = false;\\r\\n      }}\\r\\n      class=\\"video-bg\\"\\r\\n      autoplay\\r\\n      muted\\r\\n    >\\r\\n      <source class=\\"brush\\" muted src={brush1} type=\\"video/mp4\\" />\\r\\n    </video>\\r\\n  </div>\\r\\n{/if}\\r\\n\\r\\n{#if !loading || shouldAnimate === false}\\r\\n  <video class=\\"video-bg\\" autoplay muted loop id=\\"myVideo\\">\\r\\n    <source src={brush2} type=\\"video/mp4\\" />\\r\\n  </video>\\r\\n  <div class=\\"container\\">\\r\\n    <h5 class=\\"main-text fade\\">connecting people</h5>\\r\\n\\r\\n    <Logo />\\r\\n\\r\\n    <div class=\\"logo-text-container fade\\">\\r\\n      <img class=\\"logo-text\\" src={logoText} alt=\\"\\" />\\r\\n    </div>\\r\\n\\r\\n    <h5 class=\\"fade\\">to the art of living</h5>\\r\\n  </div>\\r\\n{/if}\\r\\n<!-- {:else}\\r\\n  <MobileHome /> -->\\r\\n\\r\\n<!-- {/if} -->\\r\\n<style lang=\\"scss\\">.main-text {\\n  padding-bottom: 2.8rem;\\n}\\n\\n.video-bg {\\n  position: fixed;\\n  left: 50%;\\n  top: 50%;\\n  object-fit: cover;\\n  width: 100vw;\\n  height: 100vh;\\n  transform: translate(-50%, -50%);\\n}\\n\\n.video-stroke {\\n  width: 100vw;\\n  object-fit: cover;\\n}\\n\\n.logo-text-container {\\n  max-width: 500px;\\n  width: 100%;\\n  z-index: 2;\\n  opacity: 0;\\n  padding-top: 20px;\\n}\\n.logo-text-container .logo-text {\\n  height: auto;\\n  object-fit: cover;\\n  width: 100%;\\n}\\n\\n.container {\\n  background-repeat: no-repeat;\\n  font-family: Orator;\\n  color: white;\\n  background-size: cover;\\n  display: flex;\\n  flex-direction: column;\\n  padding: 80px;\\n  gap: 25px;\\n  justify-content: center;\\n  align-items: center;\\n  height: 100vh;\\n  overflow: hidden;\\n}\\n.container::after {\\n  position: absolute;\\n  top: 0;\\n  bottom: 0;\\n  left: 0;\\n  right: 0;\\n  width: 100%;\\n  height: 100%;\\n  content: \\"\\";\\n}\\n\\nh5 {\\n  z-index: 2;\\n  opacity: 0;\\n  display: none;\\n  letter-spacing: 5px;\\n  font-weight: 100;\\n  font-size: 4em;\\n  position: relative;\\n  text-transform: uppercase;\\n}</style>\\r\\n"],"names":[],"mappings":"AA8EmB,UAAU,8BAAC,CAAC,AAC7B,cAAc,CAAE,MAAM,AACxB,CAAC,AAED,SAAS,8BAAC,CAAC,AACT,QAAQ,CAAE,KAAK,CACf,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,GAAG,CACR,UAAU,CAAE,KAAK,CACjB,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,KAAK,CACb,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,AAClC,CAAC,AAED,aAAa,8BAAC,CAAC,AACb,KAAK,CAAE,KAAK,CACZ,UAAU,CAAE,KAAK,AACnB,CAAC,AAED,oBAAoB,8BAAC,CAAC,AACpB,SAAS,CAAE,KAAK,CAChB,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,CAAC,CACV,OAAO,CAAE,CAAC,CACV,WAAW,CAAE,IAAI,AACnB,CAAC,AACD,mCAAoB,CAAC,UAAU,eAAC,CAAC,AAC/B,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,KAAK,CACjB,KAAK,CAAE,IAAI,AACb,CAAC,AAED,UAAU,8BAAC,CAAC,AACV,iBAAiB,CAAE,SAAS,CAC5B,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,KAAK,CACZ,eAAe,CAAE,KAAK,CACtB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,IAAI,CACT,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,MAAM,CAAE,KAAK,CACb,QAAQ,CAAE,MAAM,AAClB,CAAC,AACD,wCAAU,OAAO,AAAC,CAAC,AACjB,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,EAAE,AACb,CAAC,AAED,EAAE,8BAAC,CAAC,AACF,OAAO,CAAE,CAAC,CACV,OAAO,CAAE,CAAC,CACV,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,GAAG,CACd,QAAQ,CAAE,QAAQ,CAClB,cAAc,CAAE,SAAS,AAC3B,CAAC"}'
};
const Home = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `
${`<div class="${"video-stroke svelte-1b4g18x"}"><video class="${"video-bg svelte-1b4g18x"}" autoplay muted><source class="${"brush"}" muted${add_attribute("src", brush1, 0)} type="${"video/mp4"}"></video></div>`}

${``}


`;
});
var global = '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n@font-face {\n  font-family: "unisans";\n  src: url("__VITE_ASSET__a2e7014c__") format("opentype");\n}\n@font-face {\n  font-family: "unisansB";\n  src: url("__VITE_ASSET__43ec5e8d__") format("opentype");\n}\n@font-face {\n  font-family: "Orator";\n  src: url("__VITE_ASSET__b76fd88c__") format("truetype");\n}\n@font-face {\n  font-family: "Orator";\n  src: url("__VITE_ASSET__b76fd88c__") format("truetype");\n}\nhtml {\n  font-family: Orator;\n  overflow-x: hidden;\n}\n\n.close-x::before {\n  height: 2px;\n  width: 100%;\n}\n\n.close-x::after {\n  height: 100%;\n  width: 2px;\n}\n\n.close-x::after,\n.close-x::before {\n  background-color: white;\n  content: "";\n  display: block;\n  left: 50%;\n  position: absolute;\n  top: 50%;\n  transform: translateX(-50%) translateY(-50%) rotate(45deg);\n  transform-origin: center center;\n}\n\n.close-x {\n  position: absolute;\n  width: 20px;\n  height: 20px;\n  right: 20px;\n  cursor: pointer;\n}\n\n.black {\n  right: 15px;\n  top: 15px;\n  position: absolute;\n}\n\n.black::after,\n.black::before {\n  background-color: black;\n}\n\n.page-container {\n  display: flex;\n  justify-content: center;\n  width: 100%;\n  overflow: hidden;\n  padding: 15px;\n}';
var index_svelte_svelte_type_style_lang = ".container.svelte-1y1s0ny{width:100vw;height:100vh;background-color:black}";
const css = {
  code: ".container.svelte-1y1s0ny{width:100vw;height:100vh;background-color:black}",
  map: '{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script>\\r\\n  import Home from \\"./../components/Home.svelte\\";\\r\\n  import MobileHome from \\"./../components/MobileHome/MobileHome.svelte\\";\\r\\n  import MeetTheTeam from \\"./../components/meetTheTeam/MeetTheTeam.svelte\\";\\r\\n  import Map from \\"../components/Map/MapBar.svelte\\";\\r\\n  import Art from \\"./../components/Art/Art.svelte\\";\\r\\n  import Furniture from \\"./../components/Furniture/Furniture.svelte\\";\\r\\n  import Sculpture from \\"./../components/Sculpture/Sculpture.svelte\\";\\r\\n  import { onMount } from \\"svelte\\";\\r\\n\\r\\n  import \\"../global.scss\\";\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"container\\">\\r\\n  <Home />\\r\\n</div>\\r\\n\\r\\n<style lang=\\"scss\\">.container {\\n  width: 100vw;\\n  height: 100vh;\\n  background-color: black;\\n}\\n\\n#map {\\n  width: 100%;\\n  height: 100%;\\n}</style>\\r\\n"],"names":[],"mappings":"AAiBmB,UAAU,eAAC,CAAC,AAC7B,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,KAAK,CACb,gBAAgB,CAAE,KAAK,AACzB,CAAC"}'
};
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="${"container svelte-1y1s0ny"}">${validate_component(Home, "Home").$$render($$result, {}, {}, {})}
</div>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
export { init, render };
