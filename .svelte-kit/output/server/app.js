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
  var names2 = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names2.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names2.has(thing)) {
      return names2.get(thing);
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
  if (names2.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names2.forEach(function(name, thing) {
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
function noop$2() {
}
function safe_not_equal$1(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
const subscriber_queue$1 = [];
function writable$1(value, start = noop$2) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal$1(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue$1.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue$1.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue$1.length; i += 2) {
            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
          }
          subscriber_queue$1.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop$2) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop$2;
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
  return { set, update, subscribe: subscribe2 };
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
    const session = writable$1($session);
    const props = {
      stores: {
        page: writable$1(null),
        navigating: writable$1(null),
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
function noop$1() {
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
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop$1;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
function compute_rest_props(props, keys) {
  const rest = {};
  keys = new Set(keys);
  for (const k in props)
    if (!keys.has(k) && k[0] !== "$")
      rest[k] = props[k];
  return rest;
}
function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
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
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
Promise.resolve();
const boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function spread(args, classes_to_add) {
  const attributes = Object.assign({}, ...args);
  if (classes_to_add) {
    if (attributes.class == null) {
      attributes.class = classes_to_add;
    } else {
      attributes.class += " " + classes_to_add;
    }
  }
  let str = "";
  Object.keys(attributes).forEach((name) => {
    if (invalid_attribute_name_character.test(name))
      return;
    const value = attributes[name];
    if (value === true)
      str += " " + name;
    else if (boolean_attributes.has(name.toLowerCase())) {
      if (value)
        str += " " + name;
    } else if (value != null) {
      str += ` ${name}="${value}"`;
    }
  });
  return str;
}
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
function escape_attribute_value(value) {
  return typeof value === "string" ? escape(value) : value;
}
function escape_object(obj) {
  const result = {};
  for (const key in obj) {
    result[key] = escape_attribute_value(obj[key]);
  }
  return result;
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
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
const css$4 = {
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
  $$result.css.add(css$4);
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
const template = ({ head, body }) => '<!DOCTYPE html>\r\n<html lang="en">\r\n  <head>\r\n    <meta charset="utf-8" />\r\n    <link rel="icon" href="/logo.inline.svg" />\r\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\r\n    ' + head + '\r\n  </head>\r\n  <body>\r\n    <div id="svelte">' + body + "</div>\r\n  </body>\r\n</html>\r\n";
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
      file: assets + "/_app/start-ca41325c.js",
      css: [assets + "/_app/assets/start-61d1577b.css"],
      js: [assets + "/_app/start-ca41325c.js", assets + "/_app/chunks/vendor-659fe237.js"]
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
const metadata_lookup = { ".svelte-kit/build/components/layout.svelte": { "entry": "layout.svelte-c21deeef.js", "css": [], "js": ["layout.svelte-c21deeef.js", "chunks/vendor-659fe237.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-2e0648ef.js", "css": [], "js": ["error.svelte-2e0648ef.js", "chunks/vendor-659fe237.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-543f4329.js", "css": ["assets/pages/index.svelte-6866f6db.css"], "js": ["pages/index.svelte-543f4329.js", "chunks/vendor-659fe237.js"], "styles": [] } };
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
var Presence;
(function(Presence2) {
  Presence2[Presence2["Entering"] = 0] = "Entering";
  Presence2[Presence2["Present"] = 1] = "Present";
  Presence2[Presence2["Exiting"] = 2] = "Exiting";
})(Presence || (Presence = {}));
var VisibilityAction;
(function(VisibilityAction2) {
  VisibilityAction2[VisibilityAction2["Hide"] = 0] = "Hide";
  VisibilityAction2[VisibilityAction2["Show"] = 1] = "Show";
})(VisibilityAction || (VisibilityAction = {}));
const fix = () => {
  try {
    if (!process.env) {
      process.env = {};
    }
    return true;
    ;
  } catch (e) {
  }
  if (!window || window.process && window.process.env) {
    return false;
  }
  if (!window.process) {
    window.process = {};
  }
  window.process.env = {};
  return true;
};
fix();
var defaultTimestep = 1 / 60 * 1e3;
var getCurrentTime = typeof performance !== "undefined" ? function() {
  return performance.now();
} : function() {
  return Date.now();
};
var onNextFrame = typeof window !== "undefined" ? function(callback) {
  return window.requestAnimationFrame(callback);
} : function(callback) {
  return setTimeout(function() {
    return callback(getCurrentTime());
  }, defaultTimestep);
};
function createRenderStep(runNextFrame2) {
  var toRun = [];
  var toRunNextFrame = [];
  var numToRun = 0;
  var isProcessing2 = false;
  var toKeepAlive = new WeakSet();
  var step = {
    schedule: function(callback, keepAlive, immediate) {
      if (keepAlive === void 0) {
        keepAlive = false;
      }
      if (immediate === void 0) {
        immediate = false;
      }
      var addToCurrentFrame = immediate && isProcessing2;
      var buffer = addToCurrentFrame ? toRun : toRunNextFrame;
      if (keepAlive)
        toKeepAlive.add(callback);
      if (buffer.indexOf(callback) === -1) {
        buffer.push(callback);
        if (addToCurrentFrame && isProcessing2)
          numToRun = toRun.length;
      }
      return callback;
    },
    cancel: function(callback) {
      var index2 = toRunNextFrame.indexOf(callback);
      if (index2 !== -1)
        toRunNextFrame.splice(index2, 1);
      toKeepAlive.delete(callback);
    },
    process: function(frameData) {
      var _a;
      isProcessing2 = true;
      _a = [toRunNextFrame, toRun], toRun = _a[0], toRunNextFrame = _a[1];
      toRunNextFrame.length = 0;
      numToRun = toRun.length;
      if (numToRun) {
        for (var i = 0; i < numToRun; i++) {
          var callback = toRun[i];
          callback(frameData);
          if (toKeepAlive.has(callback)) {
            step.schedule(callback);
            runNextFrame2();
          }
        }
      }
      isProcessing2 = false;
    }
  };
  return step;
}
var maxElapsed = 40;
var useDefaultElapsed = true;
var runNextFrame = false;
var isProcessing = false;
var frame = {
  delta: 0,
  timestamp: 0
};
var stepsOrder = ["read", "update", "preRender", "render", "postRender"];
var steps = /* @__PURE__ */ stepsOrder.reduce(function(acc, key) {
  acc[key] = createRenderStep(function() {
    return runNextFrame = true;
  });
  return acc;
}, {});
var sync = /* @__PURE__ */ stepsOrder.reduce(function(acc, key) {
  var step = steps[key];
  acc[key] = function(process2, keepAlive, immediate) {
    if (keepAlive === void 0) {
      keepAlive = false;
    }
    if (immediate === void 0) {
      immediate = false;
    }
    if (!runNextFrame)
      startLoop();
    return step.schedule(process2, keepAlive, immediate);
  };
  return acc;
}, {});
var cancelSync = /* @__PURE__ */ stepsOrder.reduce(function(acc, key) {
  acc[key] = steps[key].cancel;
  return acc;
}, {});
var processStep = function(stepId) {
  return steps[stepId].process(frame);
};
var processFrame = function(timestamp) {
  runNextFrame = false;
  frame.delta = useDefaultElapsed ? defaultTimestep : Math.max(Math.min(timestamp - frame.timestamp, maxElapsed), 1);
  frame.timestamp = timestamp;
  isProcessing = true;
  stepsOrder.forEach(processStep);
  isProcessing = false;
  if (runNextFrame) {
    useDefaultElapsed = false;
    onNextFrame(processFrame);
  }
};
var startLoop = function() {
  runNextFrame = true;
  useDefaultElapsed = true;
  if (!isProcessing)
    onNextFrame(processFrame);
};
var getFrameData = function() {
  return frame;
};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s2, i = 1, n = arguments.length; i < n; i++) {
      s2 = arguments[i];
      for (var p in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p))
          t[p] = s2[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __rest(s2, e) {
  var t = {};
  for (var p in s2)
    if (Object.prototype.hasOwnProperty.call(s2, p) && e.indexOf(p) < 0)
      t[p] = s2[p];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s2); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i]))
        t[p[i]] = s2[p[i]];
    }
  return t;
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m)
    return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
      ar.push(r.value);
  } catch (error2) {
    e = { error: error2 };
  } finally {
    try {
      if (r && !r.done && (m = i["return"]))
        m.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
}
var mix = function(from, to, progress) {
  return -progress * from + progress * to + from;
};
var clamp = function(min, max) {
  return function(v) {
    return Math.max(Math.min(v, max), min);
  };
};
var sanitize = function(v) {
  return v % 1 ? Number(v.toFixed(5)) : v;
};
var floatRegex = /(-)?([\d]*\.?[\d])+/g;
var colorRegex = /(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2,3}\s*\/*\s*[\d\.]+%?\))/gi;
var singleColorRegex = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2,3}\s*\/*\s*[\d\.]+%?\))$/i;
function isString(v) {
  return typeof v === "string";
}
var number = {
  test: function(v) {
    return typeof v === "number";
  },
  parse: parseFloat,
  transform: function(v) {
    return v;
  }
};
var alpha = __assign(__assign({}, number), { transform: clamp(0, 1) });
var scale = __assign(__assign({}, number), { default: 1 });
var createUnitType = function(unit) {
  return {
    test: function(v) {
      return isString(v) && v.endsWith(unit) && v.split(" ").length === 1;
    },
    parse: parseFloat,
    transform: function(v) {
      return "" + v + unit;
    }
  };
};
var degrees = createUnitType("deg");
var percent = createUnitType("%");
var px = createUnitType("px");
var vh = createUnitType("vh");
var vw = createUnitType("vw");
var progressPercentage = __assign(__assign({}, percent), { parse: function(v) {
  return percent.parse(v) / 100;
}, transform: function(v) {
  return percent.transform(v * 100);
} });
var isColorString = function(type, testProp) {
  return function(v) {
    return Boolean(isString(v) && singleColorRegex.test(v) && v.startsWith(type) || testProp && Object.prototype.hasOwnProperty.call(v, testProp));
  };
};
var splitColor = function(aName, bName, cName) {
  return function(v) {
    var _a;
    if (!isString(v))
      return v;
    var _b = v.match(floatRegex), a = _b[0], b = _b[1], c = _b[2], alpha2 = _b[3];
    return _a = {}, _a[aName] = parseFloat(a), _a[bName] = parseFloat(b), _a[cName] = parseFloat(c), _a.alpha = alpha2 !== void 0 ? parseFloat(alpha2) : 1, _a;
  };
};
var hsla = {
  test: isColorString("hsl", "hue"),
  parse: splitColor("hue", "saturation", "lightness"),
  transform: function(_a) {
    var hue = _a.hue, saturation = _a.saturation, lightness = _a.lightness, _b = _a.alpha, alpha$1 = _b === void 0 ? 1 : _b;
    return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
  }
};
var clampRgbUnit = clamp(0, 255);
var rgbUnit = __assign(__assign({}, number), { transform: function(v) {
  return Math.round(clampRgbUnit(v));
} });
var rgba = {
  test: isColorString("rgb", "red"),
  parse: splitColor("red", "green", "blue"),
  transform: function(_a) {
    var red = _a.red, green = _a.green, blue = _a.blue, _b = _a.alpha, alpha$1 = _b === void 0 ? 1 : _b;
    return "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
  }
};
function parseHex(v) {
  var r = "";
  var g = "";
  var b = "";
  var a = "";
  if (v.length > 5) {
    r = v.substr(1, 2);
    g = v.substr(3, 2);
    b = v.substr(5, 2);
    a = v.substr(7, 2);
  } else {
    r = v.substr(1, 1);
    g = v.substr(2, 1);
    b = v.substr(3, 1);
    a = v.substr(4, 1);
    r += r;
    g += g;
    b += b;
    a += a;
  }
  return {
    red: parseInt(r, 16),
    green: parseInt(g, 16),
    blue: parseInt(b, 16),
    alpha: a ? parseInt(a, 16) / 255 : 1
  };
}
var hex = {
  test: isColorString("#"),
  parse: parseHex,
  transform: rgba.transform
};
var color = {
  test: function(v) {
    return rgba.test(v) || hex.test(v) || hsla.test(v);
  },
  parse: function(v) {
    if (rgba.test(v)) {
      return rgba.parse(v);
    } else if (hsla.test(v)) {
      return hsla.parse(v);
    } else {
      return hex.parse(v);
    }
  },
  transform: function(v) {
    return isString(v) ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
  }
};
var colorToken = "${c}";
var numberToken = "${n}";
function test(v) {
  var _a, _b, _c, _d;
  return isNaN(v) && isString(v) && ((_b = (_a = v.match(floatRegex)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) + ((_d = (_c = v.match(colorRegex)) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 0;
}
function analyse(v) {
  var values = [];
  var numColors = 0;
  var colors = v.match(colorRegex);
  if (colors) {
    numColors = colors.length;
    v = v.replace(colorRegex, colorToken);
    values.push.apply(values, colors.map(color.parse));
  }
  var numbers = v.match(floatRegex);
  if (numbers) {
    v = v.replace(floatRegex, numberToken);
    values.push.apply(values, numbers.map(number.parse));
  }
  return { values, numColors, tokenised: v };
}
function parse(v) {
  return analyse(v).values;
}
function createTransformer(v) {
  var _a = analyse(v), values = _a.values, numColors = _a.numColors, tokenised = _a.tokenised;
  var numValues = values.length;
  return function(v2) {
    var output = tokenised;
    for (var i = 0; i < numValues; i++) {
      output = output.replace(i < numColors ? colorToken : numberToken, i < numColors ? color.transform(v2[i]) : sanitize(v2[i]));
    }
    return output;
  };
}
var convertNumbersToZero = function(v) {
  return typeof v === "number" ? 0 : v;
};
function getAnimatableNone$1(v) {
  var parsed = parse(v);
  var transformer = createTransformer(v);
  return transformer(parsed.map(convertNumbersToZero));
}
var complex = { test, parse, createTransformer, getAnimatableNone: getAnimatableNone$1 };
var maxDefaults = new Set(["brightness", "contrast", "saturate", "opacity"]);
function applyDefaultFilter(v) {
  var _a = v.slice(0, -1).split("("), name = _a[0], value = _a[1];
  if (name === "drop-shadow")
    return v;
  var number2 = (value.match(floatRegex) || [])[0];
  if (!number2)
    return v;
  var unit = value.replace(number2, "");
  var defaultValue = maxDefaults.has(name) ? 1 : 0;
  if (number2 !== value)
    defaultValue *= 100;
  return name + "(" + defaultValue + unit + ")";
}
var functionRegex = /([a-z-]*)\(.*?\)/g;
var filter = __assign(__assign({}, complex), { getAnimatableNone: function(v) {
  var functions = v.match(functionRegex);
  return functions ? functions.map(applyDefaultFilter).join(" ") : v;
} });
var isNum = function(v) {
  return typeof v === "number";
};
var combineFunctions = function(a, b) {
  return function(v) {
    return b(a(v));
  };
};
var pipe = function() {
  var transformers = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    transformers[_i] = arguments[_i];
  }
  return transformers.reduce(combineFunctions);
};
function velocityPerSecond(velocity, frameDuration) {
  return frameDuration ? velocity * (1e3 / frameDuration) : 0;
}
var isPoint = function(point) {
  return point.hasOwnProperty("x") && point.hasOwnProperty("y");
};
var isPoint3D = function(point) {
  return isPoint(point) && point.hasOwnProperty("z");
};
var distance1D = function(a, b) {
  return Math.abs(a - b);
};
function distance(a, b) {
  if (isNum(a) && isNum(b)) {
    return distance1D(a, b);
  } else if (isPoint(a) && isPoint(b)) {
    var xDelta = distance1D(a.x, b.x);
    var yDelta = distance1D(a.y, b.y);
    var zDelta = isPoint3D(a) && isPoint3D(b) ? distance1D(a.z, b.z) : 0;
    return Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2) + Math.pow(zDelta, 2));
  }
}
function addUniqueItem(arr, item) {
  arr.indexOf(item) === -1 && arr.push(item);
}
function removeItem(arr, item) {
  var index2 = arr.indexOf(item);
  index2 > -1 && arr.splice(index2, 1);
}
var SubscriptionManager = function() {
  function SubscriptionManager2() {
    this.subscriptions = [];
  }
  SubscriptionManager2.prototype.add = function(handler) {
    var _this = this;
    addUniqueItem(this.subscriptions, handler);
    return function() {
      return removeItem(_this.subscriptions, handler);
    };
  };
  SubscriptionManager2.prototype.notify = function(a, b, c) {
    var numSubscriptions = this.subscriptions.length;
    if (!numSubscriptions)
      return;
    if (numSubscriptions === 1) {
      this.subscriptions[0](a, b, c);
    } else {
      for (var i = 0; i < numSubscriptions; i++) {
        var handler = this.subscriptions[i];
        handler && handler(a, b, c);
      }
    }
  };
  SubscriptionManager2.prototype.getSize = function() {
    return this.subscriptions.length;
  };
  SubscriptionManager2.prototype.clear = function() {
    this.subscriptions.length = 0;
  };
  return SubscriptionManager2;
}();
var isFloat = function(value) {
  return !isNaN(parseFloat(value));
};
var MotionValue = function() {
  function MotionValue2(init2, startStopNotifier) {
    var _this = this;
    this.timeDelta = 0;
    this.lastUpdated = 0;
    this.updateSubscribers = new SubscriptionManager();
    this.velocityUpdateSubscribers = new SubscriptionManager();
    this.renderSubscribers = new SubscriptionManager();
    this.canTrackVelocity = false;
    this.updateAndNotify = function(v, render2) {
      if (render2 === void 0) {
        render2 = true;
      }
      _this.prev = _this.current;
      _this.current = v;
      var _a = getFrameData(), delta2 = _a.delta, timestamp = _a.timestamp;
      if (_this.lastUpdated !== timestamp) {
        _this.timeDelta = delta2;
        _this.lastUpdated = timestamp;
        sync.postRender(_this.scheduleVelocityCheck);
      }
      if (_this.prev !== _this.current) {
        _this.updateSubscribers.notify(_this.current);
      }
      if (_this.velocityUpdateSubscribers.getSize()) {
        _this.velocityUpdateSubscribers.notify(_this.getVelocity());
      }
      if (render2) {
        _this.renderSubscribers.notify(_this.current);
      }
    };
    this.scheduleVelocityCheck = function() {
      return sync.postRender(_this.velocityCheck);
    };
    this.velocityCheck = function(_a) {
      var timestamp = _a.timestamp;
      if (timestamp !== _this.lastUpdated) {
        _this.prev = _this.current;
        _this.velocityUpdateSubscribers.notify(_this.getVelocity());
      }
    };
    this.hasAnimated = false;
    this.prev = this.current = init2;
    this.canTrackVelocity = isFloat(this.current);
    this.onSubscription = () => {
    };
    this.onUnsubscription = () => {
    };
    if (startStopNotifier) {
      this.onSubscription = () => {
        if (this.updateSubscribers.getSize() + this.velocityUpdateSubscribers.getSize() + this.renderSubscribers.getSize() === 0) {
          const unsub = startStopNotifier();
          this.onUnsubscription = () => {
          };
          if (unsub) {
            this.onUnsubscription = () => {
              if (this.updateSubscribers.getSize() + this.velocityUpdateSubscribers.getSize() + this.renderSubscribers.getSize() === 0) {
                unsub();
              }
            };
          }
        }
      };
    }
  }
  MotionValue2.prototype.onChange = function(subscription) {
    this.onSubscription();
    const unsub = this.updateSubscribers.add(subscription);
    return () => {
      unsub();
      this.onUnsubscription();
    };
  };
  MotionValue2.prototype.subscribe = function(subscription) {
    return this.onChange(subscription);
  };
  MotionValue2.prototype.clearListeners = function() {
    this.updateSubscribers.clear();
    this.onUnsubscription();
  };
  MotionValue2.prototype.onRenderRequest = function(subscription) {
    this.onSubscription();
    subscription(this.get());
    const unsub = this.renderSubscribers.add(subscription);
    return () => {
      unsub();
      this.onUnsubscription();
    };
  };
  MotionValue2.prototype.attach = function(passiveEffect) {
    this.passiveEffect = passiveEffect;
  };
  MotionValue2.prototype.set = function(v, render2) {
    if (render2 === void 0) {
      render2 = true;
    }
    if (!render2 || !this.passiveEffect) {
      this.updateAndNotify(v, render2);
    } else {
      this.passiveEffect(v, this.updateAndNotify);
    }
  };
  MotionValue2.prototype.update = function(v) {
    this.set(v(this.get()));
  };
  MotionValue2.prototype.get = function() {
    this.onSubscription();
    const curr = this.current;
    this.onUnsubscription();
    return curr;
  };
  MotionValue2.prototype.getPrevious = function() {
    return this.prev;
  };
  MotionValue2.prototype.getVelocity = function() {
    this.onSubscription();
    const vel = this.canTrackVelocity ? velocityPerSecond(parseFloat(this.current) - parseFloat(this.prev), this.timeDelta) : 0;
    this.onUnsubscription();
    return vel;
  };
  MotionValue2.prototype.start = function(animation) {
    var _this = this;
    this.stop();
    return new Promise(function(resolve2) {
      _this.hasAnimated = true;
      _this.stopAnimation = animation(resolve2);
    }).then(function() {
      return _this.clearAnimation();
    });
  };
  MotionValue2.prototype.stop = function() {
    if (this.stopAnimation)
      this.stopAnimation();
    this.clearAnimation();
  };
  MotionValue2.prototype.isAnimating = function() {
    return !!this.stopAnimation;
  };
  MotionValue2.prototype.clearAnimation = function() {
    this.stopAnimation = null;
  };
  MotionValue2.prototype.destroy = function() {
    this.updateSubscribers.clear();
    this.renderSubscribers.clear();
    this.stop();
    this.onUnsubscription();
  };
  return MotionValue2;
}();
function motionValue(init2, startStopNotifier) {
  return new MotionValue(init2, startStopNotifier);
}
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop$1) {
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
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop$1;
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
  return { set, update, subscribe: subscribe2 };
}
const getDomContext = (name, el) => {
  if (!el || !window) {
    return void 0;
  }
  let par = el;
  while (par = par.parentNode) {
    if (par.motionDomContext && par.motionDomContext.has(name)) {
      return par.motionDomContext.get(name);
    }
  }
  return void 0;
};
const setDomContext = (name, el, value) => {
  if (el && window) {
    if (!el.motionDomContext) {
      el.motionDomContext = new Map();
    }
    el.motionDomContext.set(name, value);
  }
};
var MotionConfigContext = (c) => getDomContext("MotionConfig", c) || writable({
  transformPagePoint: function(p) {
    return p;
  },
  isStatic: false
});
const ScaleCorrectionContext = (isCustom) => getDomContext("ScaleCorrection", isCustom) || writable([]);
const ScaleCorrectionParentContext = () => writable([]);
const provideScaleCorrection = (isCustom) => {
  const fromParent = getContext(ScaleCorrectionContext) || ScaleCorrectionContext(isCustom);
  const ctx = ScaleCorrectionContext();
  setContext(ScaleCorrectionContext, ctx);
  setDomContext("ScaleCorrection", isCustom, ctx);
  setContext(ScaleCorrectionParentContext, fromParent);
};
const ScaleCorrectionProvider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { isCustom } = $$props;
  provideScaleCorrection(isCustom);
  if ($$props.isCustom === void 0 && $$bindings.isCustom && isCustom !== void 0)
    $$bindings.isCustom(isCustom);
  return `${slots.default ? slots.default({}) : ``}`;
});
var isKeyframesTarget = function(v) {
  return Array.isArray(v);
};
var int = __assign(__assign({}, number), { transform: Math.round });
var numberValueTypes = {
  borderWidth: px,
  borderTopWidth: px,
  borderRightWidth: px,
  borderBottomWidth: px,
  borderLeftWidth: px,
  borderRadius: px,
  radius: px,
  borderTopLeftRadius: px,
  borderTopRightRadius: px,
  borderBottomRightRadius: px,
  borderBottomLeftRadius: px,
  width: px,
  maxWidth: px,
  height: px,
  maxHeight: px,
  size: px,
  top: px,
  right: px,
  bottom: px,
  left: px,
  padding: px,
  paddingTop: px,
  paddingRight: px,
  paddingBottom: px,
  paddingLeft: px,
  margin: px,
  marginTop: px,
  marginRight: px,
  marginBottom: px,
  marginLeft: px,
  rotate: degrees,
  rotateX: degrees,
  rotateY: degrees,
  rotateZ: degrees,
  scale,
  scaleX: scale,
  scaleY: scale,
  scaleZ: scale,
  skew: degrees,
  skewX: degrees,
  skewY: degrees,
  distance: px,
  translateX: px,
  translateY: px,
  translateZ: px,
  x: px,
  y: px,
  z: px,
  perspective: px,
  transformPerspective: px,
  opacity: alpha,
  originX: progressPercentage,
  originY: progressPercentage,
  originZ: px,
  zIndex: int,
  fillOpacity: alpha,
  strokeOpacity: alpha,
  numOctaves: int
};
var defaultValueTypes = __assign(__assign({}, numberValueTypes), {
  color,
  backgroundColor: color,
  outlineColor: color,
  fill: color,
  stroke: color,
  borderColor: color,
  borderTopColor: color,
  borderRightColor: color,
  borderBottomColor: color,
  borderLeftColor: color,
  filter,
  WebkitFilter: filter
});
var getDefaultValueType = function(key) {
  return defaultValueTypes[key];
};
function getAnimatableNone(key, value) {
  var _a;
  var defaultValueType = getDefaultValueType(key);
  if (defaultValueType !== filter)
    defaultValueType = complex;
  return (_a = defaultValueType.getAnimatableNone) === null || _a === void 0 ? void 0 : _a.call(defaultValueType, value);
}
var isNumericalString = function(v) {
  return /^\-?\d*\.?\d+$/.test(v);
};
var isCustomValue = function(v) {
  return Boolean(v && typeof v === "object" && v.mix && v.toValue);
};
var testValueType = function(v) {
  return function(type) {
    return type.test(v);
  };
};
var auto = {
  test: function(v) {
    return v === "auto";
  },
  parse: function(v) {
    return v;
  }
};
var dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
var findDimensionValueType = function(v) {
  return dimensionValueTypes.find(testValueType(v));
};
var valueTypes = __spreadArray(__spreadArray([], __read(dimensionValueTypes)), [color, complex]);
var findValueType = function(v) {
  return valueTypes.find(testValueType(v));
};
function isVariantLabels(v) {
  return Array.isArray(v);
}
function isVariantLabel(v) {
  return typeof v === "string" || isVariantLabels(v);
}
function resolveVariantFromProps(props, definition, custom, currentValues, currentVelocity) {
  var _a;
  if (currentValues === void 0) {
    currentValues = {};
  }
  if (currentVelocity === void 0) {
    currentVelocity = {};
  }
  if (typeof definition === "string") {
    definition = (_a = props.variants) === null || _a === void 0 ? void 0 : _a[definition];
  }
  return typeof definition === "function" ? definition(custom !== null && custom !== void 0 ? custom : props.custom, currentValues, currentVelocity) : definition;
}
function checkIfControllingVariants(props) {
  var _a;
  return typeof ((_a = props.animate) === null || _a === void 0 ? void 0 : _a.start) === "function" || isVariantLabel(props.initial) || isVariantLabel(props.animate) || isVariantLabel(props.whileHover) || isVariantLabel(props.whileDrag) || isVariantLabel(props.whileTap) || isVariantLabel(props.whileFocus) || isVariantLabel(props.exit);
}
function checkIfVariantNode(props) {
  return Boolean(checkIfControllingVariants(props) || props.variants);
}
function checkTargetForNewValues(visualElement2, target, origin) {
  var _a, _b, _c;
  var _d;
  var newValueKeys = Object.keys(target).filter(function(key2) {
    return !visualElement2.hasValue(key2);
  });
  var numNewValues = newValueKeys.length;
  if (!numNewValues)
    return;
  for (var i = 0; i < numNewValues; i++) {
    var key = newValueKeys[i];
    var targetValue = target[key];
    var value = null;
    if (Array.isArray(targetValue)) {
      value = targetValue[0];
    }
    if (value === null) {
      value = (_b = (_a = origin[key]) !== null && _a !== void 0 ? _a : visualElement2.readValue(key)) !== null && _b !== void 0 ? _b : target[key];
    }
    if (value === void 0 || value === null)
      continue;
    if (typeof value === "string" && isNumericalString(value)) {
      value = parseFloat(value);
    } else if (!findValueType(value) && complex.test(targetValue)) {
      value = getAnimatableNone(key, targetValue);
    }
    visualElement2.addValue(key, motionValue(value));
    (_c = (_d = origin)[key]) !== null && _c !== void 0 ? _c : _d[key] = value;
    visualElement2.setBaseTarget(key, value);
  }
}
function getOriginFromTransition(key, transition) {
  if (!transition)
    return;
  var valueTransition = transition[key] || transition["default"] || transition;
  return valueTransition.from;
}
function getOrigin(target, transition, visualElement2) {
  var _a, _b;
  var origin = {};
  for (var key in target) {
    origin[key] = (_a = getOriginFromTransition(key, transition)) !== null && _a !== void 0 ? _a : (_b = visualElement2.getValue(key)) === null || _b === void 0 ? void 0 : _b.get();
  }
  return origin;
}
var valueScaleCorrection = {};
function eachAxis(handler) {
  return [handler("x"), handler("y")];
}
function noop(any) {
  return any;
}
function convertBoundingBoxToAxisBox(_a) {
  var top = _a.top, left = _a.left, right = _a.right, bottom = _a.bottom;
  return {
    x: { min: left, max: right },
    y: { min: top, max: bottom }
  };
}
function transformBoundingBox(_a, transformPoint) {
  var top = _a.top, left = _a.left, bottom = _a.bottom, right = _a.right;
  if (transformPoint === void 0) {
    transformPoint = noop;
  }
  var topLeft = transformPoint({ x: left, y: top });
  var bottomRight = transformPoint({ x: right, y: bottom });
  return {
    top: topLeft.y,
    left: topLeft.x,
    bottom: bottomRight.y,
    right: bottomRight.x
  };
}
function axisBox() {
  return { x: { min: 0, max: 1 }, y: { min: 0, max: 1 } };
}
var zeroDelta = {
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
};
function delta() {
  return {
    x: __assign({}, zeroDelta),
    y: __assign({}, zeroDelta)
  };
}
function isDraggable(visualElement2) {
  var _a = visualElement2.getProps(), drag = _a.drag, _dragX = _a._dragX;
  return drag && !_dragX;
}
function resetAxis(axis, originAxis) {
  axis.min = originAxis.min;
  axis.max = originAxis.max;
}
function resetBox(box, originBox) {
  resetAxis(box.x, originBox.x);
  resetAxis(box.y, originBox.y);
}
function scalePoint(point, scale2, originPoint) {
  var distanceFromOrigin = point - originPoint;
  var scaled = scale2 * distanceFromOrigin;
  return originPoint + scaled;
}
function applyPointDelta(point, translate, scale2, originPoint, boxScale) {
  if (boxScale !== void 0) {
    point = scalePoint(point, boxScale, originPoint);
  }
  return scalePoint(point, scale2, originPoint) + translate;
}
function applyAxisDelta(axis, translate, scale2, originPoint, boxScale) {
  if (translate === void 0) {
    translate = 0;
  }
  if (scale2 === void 0) {
    scale2 = 1;
  }
  axis.min = applyPointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = applyPointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function applyBoxDelta(box, _a) {
  var x = _a.x, y = _a.y;
  applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
  applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
}
function applyAxisTransforms(final, axis, transforms, _a) {
  var _b = __read(_a, 3), key = _b[0], scaleKey = _b[1], originKey = _b[2];
  final.min = axis.min;
  final.max = axis.max;
  var axisOrigin = transforms[originKey] !== void 0 ? transforms[originKey] : 0.5;
  var originPoint = mix(axis.min, axis.max, axisOrigin);
  applyAxisDelta(final, transforms[key], transforms[scaleKey], originPoint, transforms.scale);
}
var xKeys = ["x", "scaleX", "originX"];
var yKeys = ["y", "scaleY", "originY"];
function applyBoxTransforms(finalBox, box, transforms) {
  applyAxisTransforms(finalBox.x, box.x, transforms, xKeys);
  applyAxisTransforms(finalBox.y, box.y, transforms, yKeys);
}
function removePointDelta(point, translate, scale2, originPoint, boxScale) {
  point -= translate;
  point = scalePoint(point, 1 / scale2, originPoint);
  if (boxScale !== void 0) {
    point = scalePoint(point, 1 / boxScale, originPoint);
  }
  return point;
}
function removeAxisDelta(axis, translate, scale2, origin, boxScale) {
  if (translate === void 0) {
    translate = 0;
  }
  if (scale2 === void 0) {
    scale2 = 1;
  }
  if (origin === void 0) {
    origin = 0.5;
  }
  var originPoint = mix(axis.min, axis.max, origin) - translate;
  axis.min = removePointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = removePointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function removeAxisTransforms(axis, transforms, _a) {
  var _b = __read(_a, 3), key = _b[0], scaleKey = _b[1], originKey = _b[2];
  removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale);
}
function removeBoxTransforms(box, transforms) {
  removeAxisTransforms(box.x, transforms, xKeys);
  removeAxisTransforms(box.y, transforms, yKeys);
}
function applyTreeDeltas(box, treeScale, treePath) {
  var treeLength = treePath.length;
  if (!treeLength)
    return;
  treeScale.x = treeScale.y = 1;
  var node;
  var delta2;
  for (var i = 0; i < treeLength; i++) {
    node = treePath[i];
    delta2 = node.getLayoutState().delta;
    treeScale.x *= delta2.x.scale;
    treeScale.y *= delta2.y.scale;
    applyBoxDelta(box, delta2);
    if (isDraggable(node)) {
      applyBoxTransforms(box, box, node.getLatestValues());
    }
  }
}
function isNear(value, target, maxDistance) {
  if (target === void 0) {
    target = 0;
  }
  if (maxDistance === void 0) {
    maxDistance = 0.01;
  }
  return distance(value, target) < maxDistance;
}
function calcLength(axis) {
  return axis.max - axis.min;
}
function updateAxisDelta(delta2, source, target, origin) {
  if (origin === void 0) {
    origin = 0.5;
  }
  delta2.origin = origin;
  delta2.originPoint = mix(source.min, source.max, delta2.origin);
  delta2.scale = calcLength(target) / calcLength(source);
  if (isNear(delta2.scale, 1, 1e-4))
    delta2.scale = 1;
  delta2.translate = mix(target.min, target.max, delta2.origin) - delta2.originPoint;
  if (isNear(delta2.translate))
    delta2.translate = 0;
}
function updateBoxDelta(delta2, source, target, origin) {
  updateAxisDelta(delta2.x, source.x, target.x, defaultOrigin(origin.originX));
  updateAxisDelta(delta2.y, source.y, target.y, defaultOrigin(origin.originY));
}
function defaultOrigin(origin) {
  return typeof origin === "number" ? origin : 0.5;
}
function calcRelativeAxis(target, relative, parent) {
  target.min = parent.min + relative.min;
  target.max = target.min + calcLength(relative);
}
function calcRelativeBox(projection, parentProjection) {
  calcRelativeAxis(projection.target.x, projection.relativeTarget.x, parentProjection.target.x);
  calcRelativeAxis(projection.target.y, projection.relativeTarget.y, parentProjection.target.y);
}
var isMotionValue = function(value) {
  return value !== null && typeof value === "object" && value.getVelocity;
};
var createProjectionState = function() {
  return {
    isEnabled: false,
    isTargetLocked: false,
    target: axisBox(),
    targetFinal: axisBox()
  };
};
function createLayoutState() {
  return {
    isHydrated: false,
    layout: axisBox(),
    layoutCorrected: axisBox(),
    treeScale: { x: 1, y: 1 },
    delta: delta(),
    deltaFinal: delta(),
    deltaTransform: ""
  };
}
var zeroLayout = createLayoutState();
function buildLayoutProjectionTransform(_a, treeScale, latestTransform) {
  var x = _a.x, y = _a.y;
  var xTranslate = x.translate / treeScale.x;
  var yTranslate = y.translate / treeScale.y;
  var transform = "translate3d(" + xTranslate + "px, " + yTranslate + "px, 0) ";
  if (latestTransform) {
    var rotate = latestTransform.rotate, rotateX = latestTransform.rotateX, rotateY = latestTransform.rotateY;
    if (rotate)
      transform += "rotate(" + rotate + ") ";
    if (rotateX)
      transform += "rotateX(" + rotateX + ") ";
    if (rotateY)
      transform += "rotateY(" + rotateY + ") ";
  }
  transform += "scale(" + x.scale + ", " + y.scale + ")";
  return !latestTransform && transform === identityProjection ? "" : transform;
}
function buildLayoutProjectionTransformOrigin(_a) {
  var deltaFinal = _a.deltaFinal;
  return deltaFinal.x.origin * 100 + "% " + deltaFinal.y.origin * 100 + "% 0";
}
var identityProjection = buildLayoutProjectionTransform(zeroLayout.delta, zeroLayout.treeScale, { x: 1, y: 1 });
var isAnimationControls = function(v) {
  return typeof v === "object" && typeof v.start === "function";
};
var AnimationType;
(function(AnimationType2) {
  AnimationType2["Animate"] = "animate";
  AnimationType2["Hover"] = "whileHover";
  AnimationType2["Tap"] = "whileTap";
  AnimationType2["Drag"] = "whileDrag";
  AnimationType2["Focus"] = "whileFocus";
  AnimationType2["Exit"] = "exit";
})(AnimationType || (AnimationType = {}));
var variantPriorityOrder = [
  AnimationType.Animate,
  AnimationType.Hover,
  AnimationType.Tap,
  AnimationType.Drag,
  AnimationType.Focus,
  AnimationType.Exit
];
__spreadArray([], __read(variantPriorityOrder)).reverse();
variantPriorityOrder.length;
var names = [
  "LayoutMeasure",
  "BeforeLayoutMeasure",
  "LayoutUpdate",
  "ViewportBoxUpdate",
  "Update",
  "Render",
  "AnimationComplete",
  "LayoutAnimationComplete",
  "AnimationStart",
  "SetAxisTarget",
  "Unmount"
];
function createLifecycles() {
  var managers = names.map(function() {
    return new SubscriptionManager();
  });
  var propSubscriptions = {};
  var lifecycles = {
    clearAllListeners: function() {
      return managers.forEach(function(manager) {
        return manager.clear();
      });
    },
    updatePropListeners: function(props) {
      return names.forEach(function(name) {
        var _a;
        (_a = propSubscriptions[name]) === null || _a === void 0 ? void 0 : _a.call(propSubscriptions);
        var on = "on" + name;
        var propListener = props[on];
        if (propListener) {
          propSubscriptions[name] = lifecycles[on](propListener);
        }
      });
    }
  };
  managers.forEach(function(manager, i) {
    lifecycles["on" + names[i]] = function(handler) {
      return manager.add(handler);
    };
    lifecycles["notify" + names[i]] = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return manager.notify.apply(manager, __spreadArray([], __read(args)));
    };
  });
  return lifecycles;
}
function updateMotionValuesFromProps(element, next, prev) {
  var _a;
  for (var key in next) {
    var nextValue = next[key];
    var prevValue = prev[key];
    if (isMotionValue(nextValue)) {
      element.addValue(key, nextValue);
    } else if (isMotionValue(prevValue)) {
      element.addValue(key, motionValue(nextValue));
    } else if (prevValue !== nextValue) {
      if (element.hasValue(key)) {
        var existingValue = element.getValue(key);
        !existingValue.hasAnimated && existingValue.set(nextValue);
      } else {
        element.addValue(key, motionValue((_a = element.getStaticValue(key)) !== null && _a !== void 0 ? _a : nextValue));
      }
    }
  }
  for (var key in prev) {
    if (next[key] === void 0)
      element.removeValue(key);
  }
  return next;
}
function updateLayoutDeltas(_a, _b, treePath, transformOrigin) {
  var delta2 = _a.delta, layout2 = _a.layout, layoutCorrected = _a.layoutCorrected, treeScale = _a.treeScale;
  var target = _b.target;
  resetBox(layoutCorrected, layout2);
  applyTreeDeltas(layoutCorrected, treeScale, treePath);
  updateBoxDelta(delta2, layoutCorrected, target, transformOrigin);
}
var compareByDepth = function(a, b) {
  return a.depth - b.depth;
};
var FlatTree = function() {
  function FlatTree2() {
    this.children = [];
    this.isDirty = false;
  }
  FlatTree2.prototype.add = function(child) {
    addUniqueItem(this.children, child);
    this.isDirty = true;
  };
  FlatTree2.prototype.remove = function(child) {
    removeItem(this.children, child);
    this.isDirty = true;
  };
  FlatTree2.prototype.forEach = function(callback) {
    this.isDirty && this.children.sort(compareByDepth);
    var numChildren = this.children.length;
    for (var i = 0; i < numChildren; i++) {
      callback(this.children[i]);
    }
  };
  return FlatTree2;
}();
function calcRelativeOffsetAxis(parent, child) {
  return {
    min: child.min - parent.min,
    max: child.max - parent.min
  };
}
function calcRelativeOffset(parent, child) {
  return {
    x: calcRelativeOffsetAxis(parent.x, child.x),
    y: calcRelativeOffsetAxis(parent.y, child.y)
  };
}
function setCurrentViewportBox(visualElement2) {
  var projectionParent = visualElement2.getProjectionParent();
  if (!projectionParent) {
    visualElement2.rebaseProjectionTarget();
    return;
  }
  var relativeOffset = calcRelativeOffset(projectionParent.getLayoutState().layout, visualElement2.getLayoutState().layout);
  eachAxis(function(axis) {
    visualElement2.setProjectionTargetAxis(axis, relativeOffset[axis].min, relativeOffset[axis].max, true);
  });
}
var visualElement = function(_a) {
  var _b = _a.treeType, treeType = _b === void 0 ? "" : _b, build = _a.build, getBaseTarget = _a.getBaseTarget, makeTargetAnimatable = _a.makeTargetAnimatable, measureViewportBox = _a.measureViewportBox, renderInstance = _a.render, readValueFromInstance = _a.readValueFromInstance, resetTransform = _a.resetTransform, restoreTransform = _a.restoreTransform, removeValueFromRenderState = _a.removeValueFromRenderState, sortNodePosition = _a.sortNodePosition, scrapeMotionValuesFromProps2 = _a.scrapeMotionValuesFromProps;
  return function(_a2, options2) {
    var parent = _a2.parent, props = _a2.props, presenceId = _a2.presenceId, blockInitialAnimation = _a2.blockInitialAnimation, visualState = _a2.visualState;
    if (options2 === void 0) {
      options2 = {};
    }
    var latestValues = visualState.latestValues, renderState = visualState.renderState;
    var instance;
    var lifecycles = createLifecycles();
    var projection = createProjectionState();
    var projectionParent;
    var leadProjection = projection;
    var leadLatestValues = latestValues;
    var unsubscribeFromLeadVisualElement;
    var layoutState = createLayoutState();
    var crossfader;
    var hasViewportBoxUpdated = false;
    var values = new Map();
    var valueSubscriptions = new Map();
    var prevMotionValues = {};
    var projectionTargetProgress;
    var baseTarget = __assign({}, latestValues);
    var removeFromVariantTree;
    function render2() {
      if (!instance)
        return;
      if (element.isProjectionReady()) {
        applyBoxTransforms(leadProjection.targetFinal, leadProjection.target, leadLatestValues);
        updateBoxDelta(layoutState.deltaFinal, layoutState.layoutCorrected, leadProjection.targetFinal, latestValues);
      }
      triggerBuild();
      renderInstance(instance, renderState);
    }
    function triggerBuild() {
      var valuesToRender = latestValues;
      if (crossfader && crossfader.isActive()) {
        var crossfadedValues = crossfader.getCrossfadeState(element);
        if (crossfadedValues)
          valuesToRender = crossfadedValues;
      }
      build(element, renderState, valuesToRender, leadProjection, layoutState, options2, props);
    }
    function update() {
      lifecycles.notifyUpdate(latestValues);
    }
    function updateLayoutProjection() {
      if (!element.isProjectionReady())
        return;
      var delta2 = layoutState.delta, treeScale = layoutState.treeScale;
      var prevTreeScaleX = treeScale.x;
      var prevTreeScaleY = treeScale.y;
      var prevDeltaTransform = layoutState.deltaTransform;
      updateLayoutDeltas(layoutState, leadProjection, element.path, latestValues);
      hasViewportBoxUpdated && element.notifyViewportBoxUpdate(leadProjection.target, delta2);
      hasViewportBoxUpdated = false;
      var deltaTransform = buildLayoutProjectionTransform(delta2, treeScale);
      if (deltaTransform !== prevDeltaTransform || prevTreeScaleX !== treeScale.x || prevTreeScaleY !== treeScale.y) {
        element.scheduleRender();
      }
      layoutState.deltaTransform = deltaTransform;
    }
    function updateTreeLayoutProjection() {
      element.layoutTree.forEach(fireUpdateLayoutProjection);
    }
    function bindToMotionValue(key2, value2) {
      var removeOnChange = value2.onChange(function(latestValue) {
        latestValues[key2] = latestValue;
        props.onUpdate && sync.update(update, false, true);
      });
      var removeOnRenderRequest = value2.onRenderRequest(element.scheduleRender);
      valueSubscriptions.set(key2, function() {
        removeOnChange();
        removeOnRenderRequest();
      });
    }
    var initialMotionValues = scrapeMotionValuesFromProps2(props);
    for (var key in initialMotionValues) {
      var value = initialMotionValues[key];
      if (latestValues[key] !== void 0 && isMotionValue(value)) {
        value.set(latestValues[key], false);
      }
    }
    var isControllingVariants = checkIfControllingVariants(props);
    var isVariantNode = checkIfVariantNode(props);
    var element = __assign(__assign({
      treeType,
      current: null,
      depth: parent ? parent.depth + 1 : 0,
      parent,
      children: new Set(),
      path: parent ? __spreadArray(__spreadArray([], __read(parent.path)), [parent]) : [],
      layoutTree: parent ? parent.layoutTree : new FlatTree(),
      presenceId,
      projection,
      variantChildren: isVariantNode ? new Set() : void 0,
      isVisible: void 0,
      manuallyAnimateOnMount: Boolean(parent === null || parent === void 0 ? void 0 : parent.isMounted()),
      blockInitialAnimation,
      isMounted: function() {
        return Boolean(instance);
      },
      mount: function(newInstance) {
        instance = element.current = newInstance;
        element.pointTo(element);
        if (isVariantNode && parent && !isControllingVariants) {
          removeFromVariantTree = parent === null || parent === void 0 ? void 0 : parent.addVariantChild(element);
        }
        parent === null || parent === void 0 ? void 0 : parent.children.add(element);
      },
      unmount: function() {
        cancelSync.update(update);
        cancelSync.render(render2);
        cancelSync.preRender(element.updateLayoutProjection);
        valueSubscriptions.forEach(function(remove) {
          return remove();
        });
        element.stopLayoutAnimation();
        element.layoutTree.remove(element);
        removeFromVariantTree === null || removeFromVariantTree === void 0 ? void 0 : removeFromVariantTree();
        parent === null || parent === void 0 ? void 0 : parent.children.delete(element);
        unsubscribeFromLeadVisualElement === null || unsubscribeFromLeadVisualElement === void 0 ? void 0 : unsubscribeFromLeadVisualElement();
        lifecycles.clearAllListeners();
      },
      addVariantChild: function(child) {
        var _a3;
        var closestVariantNode = element.getClosestVariantNode();
        if (closestVariantNode) {
          (_a3 = closestVariantNode.variantChildren) === null || _a3 === void 0 ? void 0 : _a3.add(child);
          return function() {
            return closestVariantNode.variantChildren.delete(child);
          };
        }
      },
      sortNodePosition: function(other) {
        if (!sortNodePosition || treeType !== other.treeType)
          return 0;
        return sortNodePosition(element.getInstance(), other.getInstance());
      },
      getClosestVariantNode: function() {
        return isVariantNode ? element : parent === null || parent === void 0 ? void 0 : parent.getClosestVariantNode();
      },
      scheduleUpdateLayoutProjection: parent ? parent.scheduleUpdateLayoutProjection : function() {
        return sync.preRender(element.updateTreeLayoutProjection, false, true);
      },
      getLayoutId: function() {
        return props.layoutId;
      },
      getInstance: function() {
        return instance;
      },
      getStaticValue: function(key2) {
        return latestValues[key2];
      },
      setStaticValue: function(key2, value2) {
        return latestValues[key2] = value2;
      },
      getLatestValues: function() {
        return latestValues;
      },
      setVisibility: function(visibility) {
        if (element.isVisible === visibility)
          return;
        element.isVisible = visibility;
        element.scheduleRender();
      },
      makeTargetAnimatable: function(target, canMutate) {
        if (canMutate === void 0) {
          canMutate = true;
        }
        return makeTargetAnimatable(element, target, props, canMutate);
      },
      addValue: function(key2, value2) {
        if (element.hasValue(key2))
          element.removeValue(key2);
        values.set(key2, value2);
        latestValues[key2] = value2.get();
        bindToMotionValue(key2, value2);
      },
      removeValue: function(key2) {
        var _a3;
        values.delete(key2);
        (_a3 = valueSubscriptions.get(key2)) === null || _a3 === void 0 ? void 0 : _a3();
        valueSubscriptions.delete(key2);
        delete latestValues[key2];
        removeValueFromRenderState(key2, renderState);
      },
      hasValue: function(key2) {
        return values.has(key2);
      },
      getValue: function(key2, defaultValue) {
        var value2 = values.get(key2);
        if (value2 === void 0 && defaultValue !== void 0) {
          value2 = motionValue(defaultValue);
          element.addValue(key2, value2);
        }
        return value2;
      },
      forEachValue: function(callback) {
        return values.forEach(callback);
      },
      readValue: function(key2) {
        var _a3;
        return (_a3 = latestValues[key2]) !== null && _a3 !== void 0 ? _a3 : readValueFromInstance(instance, key2, options2);
      },
      setBaseTarget: function(key2, value2) {
        baseTarget[key2] = value2;
      },
      getBaseTarget: function(key2) {
        if (getBaseTarget) {
          var target = getBaseTarget(props, key2);
          if (target !== void 0 && !isMotionValue(target))
            return target;
        }
        return baseTarget[key2];
      }
    }, lifecycles), {
      build: function() {
        triggerBuild();
        return renderState;
      },
      scheduleRender: function() {
        sync.render(render2, false, true);
      },
      syncRender: render2,
      setProps: function(newProps) {
        props = newProps;
        lifecycles.updatePropListeners(newProps);
        prevMotionValues = updateMotionValuesFromProps(element, scrapeMotionValuesFromProps2(props), prevMotionValues);
      },
      getProps: function() {
        return props;
      },
      getVariant: function(name) {
        var _a3;
        return (_a3 = props.variants) === null || _a3 === void 0 ? void 0 : _a3[name];
      },
      getDefaultTransition: function() {
        return props.transition;
      },
      getVariantContext: function(startAtParent) {
        if (startAtParent === void 0) {
          startAtParent = false;
        }
        if (startAtParent)
          return parent === null || parent === void 0 ? void 0 : parent.getVariantContext();
        if (!isControllingVariants) {
          var context_1 = (parent === null || parent === void 0 ? void 0 : parent.getVariantContext()) || {};
          if (props.initial !== void 0) {
            context_1.initial = props.initial;
          }
          return context_1;
        }
        var context = {};
        for (var i = 0; i < numVariantProps; i++) {
          var name_1 = variantProps[i];
          var prop = props[name_1];
          if (isVariantLabel(prop) || prop === false) {
            context[name_1] = prop;
          }
        }
        return context;
      },
      enableLayoutProjection: function() {
        projection.isEnabled = true;
        element.layoutTree.add(element);
      },
      lockProjectionTarget: function() {
        projection.isTargetLocked = true;
      },
      unlockProjectionTarget: function() {
        element.stopLayoutAnimation();
        projection.isTargetLocked = false;
      },
      getLayoutState: function() {
        return layoutState;
      },
      setCrossfader: function(newCrossfader) {
        crossfader = newCrossfader;
      },
      isProjectionReady: function() {
        return projection.isEnabled && projection.isHydrated && layoutState.isHydrated;
      },
      startLayoutAnimation: function(axis, transition, isRelative) {
        if (isRelative === void 0) {
          isRelative = false;
        }
        var progress = element.getProjectionAnimationProgress()[axis];
        var _a3 = isRelative ? projection.relativeTarget[axis] : projection.target[axis], min = _a3.min, max = _a3.max;
        var length = max - min;
        progress.clearListeners();
        progress.set(min);
        progress.set(min);
        progress.onChange(function(v) {
          element.setProjectionTargetAxis(axis, v, v + length, isRelative);
        });
        return element.animateMotionValue(axis, progress, 0, transition);
      },
      stopLayoutAnimation: function() {
        eachAxis(function(axis) {
          return element.getProjectionAnimationProgress()[axis].stop();
        });
      },
      measureViewportBox: function(withTransform) {
        if (withTransform === void 0) {
          withTransform = true;
        }
        var viewportBox = measureViewportBox(instance, options2);
        if (!withTransform)
          removeBoxTransforms(viewportBox, latestValues);
        return viewportBox;
      },
      getProjectionAnimationProgress: function() {
        projectionTargetProgress || (projectionTargetProgress = {
          x: motionValue(0),
          y: motionValue(0)
        });
        return projectionTargetProgress;
      },
      setProjectionTargetAxis: function(axis, min, max, isRelative) {
        if (isRelative === void 0) {
          isRelative = false;
        }
        var target;
        if (isRelative) {
          if (!projection.relativeTarget) {
            projection.relativeTarget = axisBox();
          }
          target = projection.relativeTarget[axis];
        } else {
          projection.relativeTarget = void 0;
          target = projection.target[axis];
        }
        projection.isHydrated = true;
        target.min = min;
        target.max = max;
        hasViewportBoxUpdated = true;
        lifecycles.notifySetAxisTarget();
      },
      rebaseProjectionTarget: function(force, box) {
        if (box === void 0) {
          box = layoutState.layout;
        }
        var _a3 = element.getProjectionAnimationProgress(), x = _a3.x, y = _a3.y;
        var shouldRebase = !projection.relativeTarget && !projection.isTargetLocked && !x.isAnimating() && !y.isAnimating();
        if (force || shouldRebase) {
          eachAxis(function(axis) {
            var _a4 = box[axis], min = _a4.min, max = _a4.max;
            element.setProjectionTargetAxis(axis, min, max);
          });
        }
      },
      notifyLayoutReady: function(config) {
        setCurrentViewportBox(element);
        element.notifyLayoutUpdate(layoutState.layout, element.prevViewportBox || layoutState.layout, config);
      },
      resetTransform: function() {
        return resetTransform(element, instance, props);
      },
      restoreTransform: function() {
        return restoreTransform(instance, renderState);
      },
      updateLayoutProjection,
      updateTreeLayoutProjection: function() {
        element.layoutTree.forEach(fireResolveRelativeTargetBox);
        sync.preRender(updateTreeLayoutProjection, false, true);
      },
      getProjectionParent: function() {
        if (projectionParent === void 0) {
          var foundParent = false;
          for (var i = element.path.length - 1; i >= 0; i--) {
            var ancestor = element.path[i];
            if (ancestor.projection.isEnabled) {
              foundParent = ancestor;
              break;
            }
          }
          projectionParent = foundParent;
        }
        return projectionParent;
      },
      resolveRelativeTargetBox: function() {
        var relativeParent = element.getProjectionParent();
        if (!projection.relativeTarget || !relativeParent)
          return;
        calcRelativeBox(projection, relativeParent.projection);
        if (isDraggable(relativeParent)) {
          var target = projection.target;
          applyBoxTransforms(target, target, relativeParent.getLatestValues());
        }
      },
      shouldResetTransform: function() {
        return Boolean(props._layoutResetTransform);
      },
      pointTo: function(newLead) {
        leadProjection = newLead.projection;
        leadLatestValues = newLead.getLatestValues();
        unsubscribeFromLeadVisualElement === null || unsubscribeFromLeadVisualElement === void 0 ? void 0 : unsubscribeFromLeadVisualElement();
        unsubscribeFromLeadVisualElement = pipe(newLead.onSetAxisTarget(element.scheduleUpdateLayoutProjection), newLead.onLayoutAnimationComplete(function() {
          var _a3;
          if (element.isPresent) {
            element.presence = Presence.Present;
          } else {
            (_a3 = element.layoutSafeToRemove) === null || _a3 === void 0 ? void 0 : _a3.call(element);
          }
        }));
      },
      isPresent: true,
      presence: Presence.Entering
    });
    return element;
  };
};
function fireResolveRelativeTargetBox(child) {
  child.resolveRelativeTargetBox();
}
function fireUpdateLayoutProjection(child) {
  child.updateLayoutProjection();
}
var variantProps = __spreadArray(["initial"], __read(variantPriorityOrder));
var numVariantProps = variantProps.length;
var validMotionProps = new Set([
  "initial",
  "animate",
  "exit",
  "style",
  "variants",
  "transition",
  "transformTemplate",
  "transformValues",
  "custom",
  "inherit",
  "layout",
  "layoutId",
  "onLayoutAnimationComplete",
  "onViewportBoxUpdate",
  "onLayoutMeasure",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "drag",
  "dragControls",
  "dragListener",
  "dragConstraints",
  "dragDirectionLock",
  "_dragX",
  "_dragY",
  "dragElastic",
  "dragMomentum",
  "dragPropagation",
  "dragTransition",
  "whileDrag",
  "onPan",
  "onPanStart",
  "onPanEnd",
  "onPanSessionStart",
  "onTap",
  "onTapStart",
  "onTapCancel",
  "onHoverStart",
  "onHoverEnd",
  "whileFocus",
  "whileTap",
  "whileHover"
]);
function isValidMotionProp(key) {
  return validMotionProps.has(key);
}
const PresenceContext = (c) => getDomContext("Presence", c) || writable(null);
function isPresent(context) {
  return context === null ? true : context.isPresent;
}
const LayoutGroupContext = (c) => getDomContext("LayoutGroup", c) || writable(null);
const LazyContext = (c) => getDomContext("Lazy", c) || writable({ strict: false });
const MotionContext = (c) => getDomContext("Motion", c) || writable({});
const UseVisualElement = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $presenceContext, $$unsubscribe_presenceContext;
  let $config, $$unsubscribe_config;
  let $lazyContext, $$unsubscribe_lazyContext;
  let $layoutGroupId, $$unsubscribe_layoutGroupId;
  let $mc, $$unsubscribe_mc;
  let { createVisualElement = void 0, props, Component, visualState, isCustom } = $$props;
  const config = getContext(MotionConfigContext) || MotionConfigContext(isCustom);
  $$unsubscribe_config = subscribe(config, (value) => $config = value);
  const presenceContext = getContext(PresenceContext) || PresenceContext(isCustom);
  $$unsubscribe_presenceContext = subscribe(presenceContext, (value) => $presenceContext = value);
  const lazyContext = getContext(LazyContext) || LazyContext(isCustom);
  $$unsubscribe_lazyContext = subscribe(lazyContext, (value) => $lazyContext = value);
  const mc = getContext(MotionContext) || MotionContext(isCustom);
  $$unsubscribe_mc = subscribe(mc, (value) => $mc = value);
  let parent = get_store_value(mc).visualElement;
  const layoutGroupId = getContext(LayoutGroupContext) || LayoutGroupContext(isCustom);
  $$unsubscribe_layoutGroupId = subscribe(layoutGroupId, (value) => $layoutGroupId = value);
  let layoutId = $layoutGroupId && props.layoutId !== void 0 ? $layoutGroupId + "-" + props.layoutId : props.layoutId;
  let visualElementRef = void 0;
  if (!createVisualElement) {
    createVisualElement = $lazyContext.renderer;
  }
  let visualElement2 = visualElementRef;
  onDestroy(() => {
    visualElement2 == null ? void 0 : visualElement2.notifyUnmount();
  });
  if ($$props.createVisualElement === void 0 && $$bindings.createVisualElement && createVisualElement !== void 0)
    $$bindings.createVisualElement(createVisualElement);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.Component === void 0 && $$bindings.Component && Component !== void 0)
    $$bindings.Component(Component);
  if ($$props.visualState === void 0 && $$bindings.visualState && visualState !== void 0)
    $$bindings.visualState(visualState);
  if ($$props.isCustom === void 0 && $$bindings.isCustom && isCustom !== void 0)
    $$bindings.isCustom(isCustom);
  parent = $mc.visualElement;
  layoutId = $layoutGroupId && props.layoutId !== void 0 ? $layoutGroupId + "-" + props.layoutId : props.layoutId;
  {
    if (!visualElementRef && createVisualElement) {
      visualElementRef = createVisualElement(Component, {
        visualState,
        parent,
        props: { ...props, layoutId },
        presenceId: $presenceContext == null ? void 0 : $presenceContext.id,
        blockInitialAnimation: ($presenceContext == null ? void 0 : $presenceContext.initial) === false
      });
    }
  }
  visualElement2 = visualElementRef;
  {
    if (visualElement2) {
      visualElement2.setProps({ ...$config, ...props, layoutId });
      visualElement2.isPresent = isPresent($presenceContext);
      visualElement2.isPresenceRoot = !parent || parent.presenceId !== ($presenceContext == null ? void 0 : $presenceContext.id);
      visualElement2.syncRender();
    }
  }
  $$unsubscribe_presenceContext();
  $$unsubscribe_config();
  $$unsubscribe_lazyContext();
  $$unsubscribe_layoutGroupId();
  $$unsubscribe_mc();
  return `${slots.default ? slots.default({ visualElement: visualElement2 }) : ``}`;
});
var createDefinition = function(propNames) {
  return {
    isEnabled: function(props) {
      return propNames.some(function(name) {
        return !!props[name];
      });
    }
  };
};
var featureDefinitions = {
  measureLayout: createDefinition(["layout", "layoutId", "drag"]),
  animation: createDefinition([
    "animate",
    "exit",
    "variants",
    "whileHover",
    "whileTap",
    "whileFocus",
    "whileDrag"
  ]),
  exit: createDefinition(["exit"]),
  drag: createDefinition(["drag", "dragControls"]),
  focus: createDefinition(["whileFocus"]),
  hover: createDefinition(["whileHover", "onHoverStart", "onHoverEnd"]),
  tap: createDefinition(["whileTap", "onTap", "onTapStart", "onTapCancel"]),
  pan: createDefinition([
    "onPan",
    "onPanStart",
    "onPanSessionStart",
    "onPanEnd"
  ]),
  layoutAnimation: createDefinition(["layout", "layoutId"])
};
const UseFeatures = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const featureNames = Object.keys(featureDefinitions);
  const numFeatures = featureNames.length;
  let { visualElement: visualElement2, props } = $$props;
  let features = [];
  if ($$props.visualElement === void 0 && $$bindings.visualElement && visualElement2 !== void 0)
    $$bindings.visualElement(visualElement2);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  {
    {
      features = [];
      for (let i = 0; i < numFeatures; i++) {
        const name = featureNames[i];
        const { isEnabled, Component } = featureDefinitions[name];
        if (isEnabled(props) && Component) {
          features.push({
            Component,
            key: name,
            props,
            visualElement: visualElement2
          });
        }
      }
    }
  }
  return `${visualElement2 ? `${slots.default ? slots.default({ features }) : ``}` : ``}`;
});
const MotionContextProvider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value, isCustom } = $$props;
  let store = writable(value);
  setContext(MotionContext, store);
  setDomContext("Motion", isCustom, store);
  onDestroy(() => {
    var _a;
    (_a = value == null ? void 0 : value.visualElement) == null ? void 0 : _a.unmount();
  });
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.isCustom === void 0 && $$bindings.isCustom && isCustom !== void 0)
    $$bindings.isCustom(isCustom);
  {
    store.set(value);
  }
  return `${slots.default ? slots.default({}) : ``}`;
});
var createHtmlRenderState = function() {
  return {
    style: {},
    transform: {},
    transformKeys: [],
    transformOrigin: {},
    vars: {}
  };
};
var createSvgRenderState = function() {
  return __assign(__assign({}, createHtmlRenderState()), { attrs: {} });
};
var transformAxes = ["", "X", "Y", "Z"];
var order = ["translate", "scale", "rotate", "skew"];
var transformProps = ["transformPerspective", "x", "y", "z"];
order.forEach(function(operationKey) {
  return transformAxes.forEach(function(axesKey) {
    return transformProps.push(operationKey + axesKey);
  });
});
function sortTransformProps(a, b) {
  return transformProps.indexOf(a) - transformProps.indexOf(b);
}
var transformPropSet = new Set(transformProps);
function isTransformProp(key) {
  return transformPropSet.has(key);
}
var transformOriginProps = new Set(["originX", "originY", "originZ"]);
function isTransformOriginProp(key) {
  return transformOriginProps.has(key);
}
function isForcedMotionValue(key, _a) {
  var layout2 = _a.layout, layoutId = _a.layoutId;
  return isTransformProp(key) || isTransformOriginProp(key) || (layout2 || layoutId !== void 0) && !!valueScaleCorrection[key];
}
var translateAlias = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
};
function buildTransform(_a, _b, transformIsDefault, transformTemplate) {
  var transform = _a.transform, transformKeys2 = _a.transformKeys;
  var _c = _b.enableHardwareAcceleration, enableHardwareAcceleration = _c === void 0 ? true : _c, _d = _b.allowTransformNone, allowTransformNone = _d === void 0 ? true : _d;
  var transformString = "";
  transformKeys2.sort(sortTransformProps);
  var transformHasZ = false;
  var numTransformKeys = transformKeys2.length;
  for (var i = 0; i < numTransformKeys; i++) {
    var key = transformKeys2[i];
    transformString += (translateAlias[key] || key) + "(" + transform[key] + ") ";
    if (key === "z")
      transformHasZ = true;
  }
  if (!transformHasZ && enableHardwareAcceleration) {
    transformString += "translateZ(0)";
  } else {
    transformString = transformString.trim();
  }
  if (transformTemplate) {
    transformString = transformTemplate(transform, transformIsDefault ? "" : transformString);
  } else if (allowTransformNone && transformIsDefault) {
    transformString = "none";
  }
  return transformString;
}
function buildTransformOrigin(_a) {
  var _b = _a.originX, originX = _b === void 0 ? "50%" : _b, _c = _a.originY, originY = _c === void 0 ? "50%" : _c, _d = _a.originZ, originZ = _d === void 0 ? 0 : _d;
  return originX + " " + originY + " " + originZ;
}
function isCSSVariable$1(key) {
  return key.startsWith("--");
}
var getValueAsType = function(value, type) {
  return type && typeof value === "number" ? type.transform(value) : value;
};
function buildHTMLStyles(state, latestValues, projection, layoutState, options2, transformTemplate, buildProjectionTransform, buildProjectionTransformOrigin) {
  var _a;
  var style = state.style, vars = state.vars, transform = state.transform, transformKeys2 = state.transformKeys, transformOrigin = state.transformOrigin;
  transformKeys2.length = 0;
  var hasTransform = false;
  var hasTransformOrigin = false;
  var transformIsNone = true;
  for (var key in latestValues) {
    var value = latestValues[key];
    if (isCSSVariable$1(key)) {
      vars[key] = value;
      continue;
    }
    var valueType = numberValueTypes[key];
    var valueAsType = getValueAsType(value, valueType);
    if (isTransformProp(key)) {
      hasTransform = true;
      transform[key] = valueAsType;
      transformKeys2.push(key);
      if (!transformIsNone)
        continue;
      if (value !== ((_a = valueType.default) !== null && _a !== void 0 ? _a : 0))
        transformIsNone = false;
    } else if (isTransformOriginProp(key)) {
      transformOrigin[key] = valueAsType;
      hasTransformOrigin = true;
    } else {
      if (layoutState && projection && layoutState.isHydrated && valueScaleCorrection[key]) {
        var correctedValue = valueScaleCorrection[key].process(value, layoutState, projection);
        var applyTo = valueScaleCorrection[key].applyTo;
        if (applyTo) {
          var num = applyTo.length;
          for (var i = 0; i < num; i++) {
            style[applyTo[i]] = correctedValue;
          }
        } else {
          style[key] = correctedValue;
        }
      } else {
        style[key] = valueAsType;
      }
    }
  }
  if (layoutState && projection && buildProjectionTransform && buildProjectionTransformOrigin) {
    style.transform = buildProjectionTransform(layoutState.deltaFinal, layoutState.treeScale, hasTransform ? transform : void 0);
    if (transformTemplate) {
      style.transform = transformTemplate(transform, style.transform);
    }
    style.transformOrigin = buildProjectionTransformOrigin(layoutState);
  } else {
    if (hasTransform) {
      style.transform = buildTransform(state, options2, transformIsNone, transformTemplate);
    }
    if (hasTransformOrigin) {
      style.transformOrigin = buildTransformOrigin(transformOrigin);
    }
  }
}
const UseInitialMotionValues = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let styles;
  let { visualState, isStatic, props } = $$props;
  const memo = () => {
    let state = createHtmlRenderState();
    buildHTMLStyles(state, visualState, void 0, void 0, { enableHardwareAcceleration: !isStatic }, props.transformTemplate);
    const { vars, style } = state;
    return { ...vars, ...style };
  };
  if ($$props.visualState === void 0 && $$bindings.visualState && visualState !== void 0)
    $$bindings.visualState(visualState);
  if ($$props.isStatic === void 0 && $$bindings.isStatic && isStatic !== void 0)
    $$bindings.isStatic(isStatic);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  styles = memo();
  return `${slots.default ? slots.default({ styles }) : ``}`;
});
function copyRawValuesOnly(target, source, props) {
  for (const key in source) {
    if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
      target[key] = source[key];
    }
  }
}
const UseStyle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let styleProp;
  let { visualState, props, isStatic } = $$props;
  let style = {};
  const cRVO = copyRawValuesOnly;
  const toStyle = (s1) => {
    Object.assign(style, s1);
    if (props.transformValues) {
      style = props.transformValues(style);
    }
    return style;
  };
  if ($$props.visualState === void 0 && $$bindings.visualState && visualState !== void 0)
    $$bindings.visualState(visualState);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.isStatic === void 0 && $$bindings.isStatic && isStatic !== void 0)
    $$bindings.isStatic(isStatic);
  styleProp = props.style || {};
  {
    cRVO(style, styleProp, props);
  }
  return `${validate_component(UseInitialMotionValues, "UseInitialMotionValues").$$render($$result, { props, visualState, isStatic }, {}, {
    default: ({ styles: s1 }) => `${slots.default ? slots.default({ styles: toStyle(s1) }) : ``}`
  })}`;
});
const UseHTMLProps = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { props, visualState, isStatic } = $$props;
  const getHTMLProps = (style, props2) => {
    let htmlProps = {};
    if (Boolean(props2.drag)) {
      htmlProps.draggable = false;
      style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = "none";
      style.touchAction = props2.drag === true ? "none" : `pan-${props2.drag === "x" ? "y" : "x"}`;
    }
    htmlProps.style = style;
    return htmlProps;
  };
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.visualState === void 0 && $$bindings.visualState && visualState !== void 0)
    $$bindings.visualState(visualState);
  if ($$props.isStatic === void 0 && $$bindings.isStatic && isStatic !== void 0)
    $$bindings.isStatic(isStatic);
  return `${validate_component(UseStyle, "UseStyle").$$render($$result, { visualState, props, isStatic }, {}, {
    default: ({ styles }) => `${slots.default ? slots.default({ visualProps: getHTMLProps(styles, props) }) : ``}`
  })}`;
});
function calcOrigin(origin, offset, size) {
  return typeof origin === "string" ? origin : px.transform(offset + size * origin);
}
function calcSVGTransformOrigin(dimensions, originX, originY) {
  var pxOriginX = calcOrigin(originX, dimensions.x, dimensions.width);
  var pxOriginY = calcOrigin(originY, dimensions.y, dimensions.height);
  return pxOriginX + " " + pxOriginY;
}
var progressToPixels = function(progress, length) {
  return px.transform(progress * length);
};
var dashKeys = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
};
var camelKeys = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function buildSVGPath(attrs, totalLength, length, spacing, offset, useDashCase) {
  if (spacing === void 0) {
    spacing = 1;
  }
  if (offset === void 0) {
    offset = 0;
  }
  if (useDashCase === void 0) {
    useDashCase = true;
  }
  var keys = useDashCase ? dashKeys : camelKeys;
  attrs[keys.offset] = progressToPixels(-offset, totalLength);
  var pathLength = progressToPixels(length, totalLength);
  var pathSpacing = progressToPixels(spacing, totalLength);
  attrs[keys.array] = pathLength + " " + pathSpacing;
}
function buildSVGAttrs(state, _a, projection, layoutState, options2, transformTemplate, buildProjectionTransform, buildProjectionTransformOrigin) {
  var attrX = _a.attrX, attrY = _a.attrY, originX = _a.originX, originY = _a.originY, pathLength = _a.pathLength, _b = _a.pathSpacing, pathSpacing = _b === void 0 ? 1 : _b, _c = _a.pathOffset, pathOffset = _c === void 0 ? 0 : _c, latest = __rest(_a, ["attrX", "attrY", "originX", "originY", "pathLength", "pathSpacing", "pathOffset"]);
  buildHTMLStyles(state, latest, projection, layoutState, options2, transformTemplate, buildProjectionTransform, buildProjectionTransformOrigin);
  state.attrs = state.style;
  state.style = {};
  var attrs = state.attrs, style = state.style, dimensions = state.dimensions, totalPathLength = state.totalPathLength;
  if (attrs.transform) {
    if (dimensions)
      style.transform = attrs.transform;
    delete attrs.transform;
  }
  if (dimensions && (originX !== void 0 || originY !== void 0 || style.transform)) {
    style.transformOrigin = calcSVGTransformOrigin(dimensions, originX !== void 0 ? originX : 0.5, originY !== void 0 ? originY : 0.5);
  }
  if (attrX !== void 0)
    attrs.x = attrX;
  if (attrY !== void 0)
    attrs.y = attrY;
  if (totalPathLength !== void 0 && pathLength !== void 0) {
    buildSVGPath(attrs, totalPathLength, pathLength, pathSpacing, pathOffset, false);
  }
}
const UseSVGProps = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let visualProps;
  let { visualState, props } = $$props;
  let memo = () => {
    const state = createSvgRenderState();
    buildSVGAttrs(state, visualState, void 0, void 0, { enableHardwareAcceleration: false }, props.transformTemplate);
    return {
      ...state.attrs,
      style: { ...state.style }
    };
  };
  if ($$props.visualState === void 0 && $$bindings.visualState && visualState !== void 0)
    $$bindings.visualState(visualState);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  visualProps = memo();
  {
    if (props.style) {
      const rawStyles = {};
      copyRawValuesOnly(rawStyles, props.style, props);
      visualProps.style = { ...rawStyles, ...visualProps.style };
    }
  }
  return `${slots.default ? slots.default({ visualProps }) : ``}`;
});
var shouldForward = function(key) {
  return !isValidMotionProp(key);
};
try {
  var emotionIsPropValid_1 = require("@emotion/is-prop-valid").default;
  shouldForward = function(key) {
    if (key.startsWith("on")) {
      return !isValidMotionProp(key);
    } else {
      return emotionIsPropValid_1(key);
    }
  };
} catch (_a) {
}
function filterProps(props, isDom, forwardMotionProps) {
  var filteredProps = {};
  for (var key in props) {
    if (shouldForward(key) || forwardMotionProps === true && isValidMotionProp(key) || !isDom && !isValidMotionProp(key)) {
      filteredProps[key] = props[key];
    }
  }
  return filteredProps;
}
const UseRender = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredProps;
  let { props, visualState, Component, forwardMotionProps = false, isStatic, ref, targetEl = void 0 } = $$props;
  const motion = (node) => {
    ref(node);
  };
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.visualState === void 0 && $$bindings.visualState && visualState !== void 0)
    $$bindings.visualState(visualState);
  if ($$props.Component === void 0 && $$bindings.Component && Component !== void 0)
    $$bindings.Component(Component);
  if ($$props.forwardMotionProps === void 0 && $$bindings.forwardMotionProps && forwardMotionProps !== void 0)
    $$bindings.forwardMotionProps(forwardMotionProps);
  if ($$props.isStatic === void 0 && $$bindings.isStatic && isStatic !== void 0)
    $$bindings.isStatic(isStatic);
  if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0)
    $$bindings.ref(ref);
  if ($$props.targetEl === void 0 && $$bindings.targetEl && targetEl !== void 0)
    $$bindings.targetEl(targetEl);
  filteredProps = filterProps(props, typeof Component === "string", forwardMotionProps);
  {
    if (targetEl) {
      motion(targetEl);
    }
  }
  return `${validate_component((Component === "SVG" ? UseSVGProps : UseHTMLProps) || missing_component, "svelte:component").$$render($$result, { visualState, isStatic, props }, {}, {
    default: ({ visualProps }) => `${slots.default ? slots.default({
      motion,
      props: { ...filteredProps, ...visualProps }
    }) : ``}`
  })}`;
});
function getBoundingBox(element, transformPagePoint) {
  var box = element.getBoundingClientRect();
  return convertBoundingBoxToAxisBox(transformBoundingBox(box, transformPagePoint));
}
function isCSSVariable(value) {
  return typeof value === "string" && value.startsWith("var(--");
}
var cssVariableRegex = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;
function parseCSSVariable(current) {
  var match = cssVariableRegex.exec(current);
  if (!match)
    return [,];
  var _a = __read(match, 3), token = _a[1], fallback = _a[2];
  return [token, fallback];
}
function getVariableValue(current, element, depth) {
  var _a = __read(parseCSSVariable(current), 2), token = _a[0], fallback = _a[1];
  if (!token)
    return;
  var resolved = window.getComputedStyle(element).getPropertyValue(token);
  if (resolved) {
    return resolved.trim();
  } else if (isCSSVariable(fallback)) {
    return getVariableValue(fallback, element);
  } else {
    return fallback;
  }
}
function resolveCSSVariables(visualElement2, _a, transitionEnd) {
  var _b;
  var target = __rest(_a, []);
  var element = visualElement2.getInstance();
  if (!(element instanceof HTMLElement))
    return { target, transitionEnd };
  if (transitionEnd) {
    transitionEnd = __assign({}, transitionEnd);
  }
  visualElement2.forEachValue(function(value) {
    var current2 = value.get();
    if (!isCSSVariable(current2))
      return;
    var resolved2 = getVariableValue(current2, element);
    if (resolved2)
      value.set(resolved2);
  });
  for (var key in target) {
    var current = target[key];
    if (!isCSSVariable(current))
      continue;
    var resolved = getVariableValue(current, element);
    if (!resolved)
      continue;
    target[key] = resolved;
    if (transitionEnd)
      (_b = transitionEnd[key]) !== null && _b !== void 0 ? _b : transitionEnd[key] = current;
  }
  return { target, transitionEnd };
}
var positionalKeys = new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "x",
  "y"
]);
var isPositionalKey = function(key) {
  return positionalKeys.has(key);
};
var hasPositionalKey = function(target) {
  return Object.keys(target).some(isPositionalKey);
};
var setAndResetVelocity = function(value, to) {
  value.set(to, false);
  value.set(to);
};
var isNumOrPxType = function(v) {
  return v === number || v === px;
};
var BoundingBoxDimension;
(function(BoundingBoxDimension2) {
  BoundingBoxDimension2["width"] = "width";
  BoundingBoxDimension2["height"] = "height";
  BoundingBoxDimension2["left"] = "left";
  BoundingBoxDimension2["right"] = "right";
  BoundingBoxDimension2["top"] = "top";
  BoundingBoxDimension2["bottom"] = "bottom";
})(BoundingBoxDimension || (BoundingBoxDimension = {}));
var getPosFromMatrix = function(matrix, pos) {
  return parseFloat(matrix.split(", ")[pos]);
};
var getTranslateFromMatrix = function(pos2, pos3) {
  return function(_bbox, _a) {
    var transform = _a.transform;
    if (transform === "none" || !transform)
      return 0;
    var matrix3d = transform.match(/^matrix3d\((.+)\)$/);
    if (matrix3d) {
      return getPosFromMatrix(matrix3d[1], pos3);
    } else {
      var matrix = transform.match(/^matrix\((.+)\)$/);
      if (matrix) {
        return getPosFromMatrix(matrix[1], pos2);
      } else {
        return 0;
      }
    }
  };
};
var transformKeys = new Set(["x", "y", "z"]);
var nonTranslationalTransformKeys = transformProps.filter(function(key) {
  return !transformKeys.has(key);
});
function removeNonTranslationalTransform(visualElement2) {
  var removedTransforms = [];
  nonTranslationalTransformKeys.forEach(function(key) {
    var value = visualElement2.getValue(key);
    if (value !== void 0) {
      removedTransforms.push([key, value.get()]);
      value.set(key.startsWith("scale") ? 1 : 0);
    }
  });
  if (removedTransforms.length)
    visualElement2.syncRender();
  return removedTransforms;
}
var positionalValues = {
  width: function(_a) {
    var x = _a.x;
    return x.max - x.min;
  },
  height: function(_a) {
    var y = _a.y;
    return y.max - y.min;
  },
  top: function(_bbox, _a) {
    var top = _a.top;
    return parseFloat(top);
  },
  left: function(_bbox, _a) {
    var left = _a.left;
    return parseFloat(left);
  },
  bottom: function(_a, _b) {
    var y = _a.y;
    var top = _b.top;
    return parseFloat(top) + (y.max - y.min);
  },
  right: function(_a, _b) {
    var x = _a.x;
    var left = _b.left;
    return parseFloat(left) + (x.max - x.min);
  },
  x: getTranslateFromMatrix(4, 13),
  y: getTranslateFromMatrix(5, 14)
};
var convertChangedValueTypes = function(target, visualElement2, changedKeys) {
  var originBbox = visualElement2.measureViewportBox();
  var element = visualElement2.getInstance();
  var elementComputedStyle = getComputedStyle(element);
  var display = elementComputedStyle.display, top = elementComputedStyle.top, left = elementComputedStyle.left, bottom = elementComputedStyle.bottom, right = elementComputedStyle.right, transform = elementComputedStyle.transform;
  var originComputedStyle = { top, left, bottom, right, transform };
  if (display === "none") {
    visualElement2.setStaticValue("display", target.display || "block");
  }
  visualElement2.syncRender();
  var targetBbox = visualElement2.measureViewportBox();
  changedKeys.forEach(function(key) {
    var value = visualElement2.getValue(key);
    setAndResetVelocity(value, positionalValues[key](originBbox, originComputedStyle));
    target[key] = positionalValues[key](targetBbox, elementComputedStyle);
  });
  return target;
};
var checkAndConvertChangedValueTypes = function(visualElement2, target, origin, transitionEnd) {
  if (origin === void 0) {
    origin = {};
  }
  if (transitionEnd === void 0) {
    transitionEnd = {};
  }
  target = __assign({}, target);
  transitionEnd = __assign({}, transitionEnd);
  var targetPositionalKeys = Object.keys(target).filter(isPositionalKey);
  var removedTransformValues = [];
  var hasAttemptedToRemoveTransformValues = false;
  var changedValueTypeKeys = [];
  targetPositionalKeys.forEach(function(key) {
    var value = visualElement2.getValue(key);
    if (!visualElement2.hasValue(key))
      return;
    var from = origin[key];
    var to = target[key];
    var fromType = findDimensionValueType(from);
    var toType;
    if (isKeyframesTarget(to)) {
      var numKeyframes = to.length;
      for (var i = to[0] === null ? 1 : 0; i < numKeyframes; i++) {
        if (!toType) {
          toType = findDimensionValueType(to[i]);
        }
      }
    } else {
      toType = findDimensionValueType(to);
    }
    if (fromType !== toType) {
      if (isNumOrPxType(fromType) && isNumOrPxType(toType)) {
        var current = value.get();
        if (typeof current === "string") {
          value.set(parseFloat(current));
        }
        if (typeof to === "string") {
          target[key] = parseFloat(to);
        } else if (Array.isArray(to) && toType === px) {
          target[key] = to.map(parseFloat);
        }
      } else if ((fromType === null || fromType === void 0 ? void 0 : fromType.transform) && (toType === null || toType === void 0 ? void 0 : toType.transform) && (from === 0 || to === 0)) {
        if (from === 0) {
          value.set(toType.transform(from));
        } else {
          target[key] = fromType.transform(to);
        }
      } else {
        if (!hasAttemptedToRemoveTransformValues) {
          removedTransformValues = removeNonTranslationalTransform(visualElement2);
          hasAttemptedToRemoveTransformValues = true;
        }
        changedValueTypeKeys.push(key);
        transitionEnd[key] = transitionEnd[key] !== void 0 ? transitionEnd[key] : target[key];
        setAndResetVelocity(value, to);
      }
    }
  });
  if (changedValueTypeKeys.length) {
    var convertedTarget = convertChangedValueTypes(target, visualElement2, changedValueTypeKeys);
    if (removedTransformValues.length) {
      removedTransformValues.forEach(function(_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        visualElement2.getValue(key).set(value);
      });
    }
    visualElement2.syncRender();
    return { target: convertedTarget, transitionEnd };
  } else {
    return { target, transitionEnd };
  }
};
function unitConversion(visualElement2, target, origin, transitionEnd) {
  return hasPositionalKey(target) ? checkAndConvertChangedValueTypes(visualElement2, target, origin, transitionEnd) : { target, transitionEnd };
}
var parseDomVariant = function(visualElement2, target, origin, transitionEnd) {
  var resolved = resolveCSSVariables(visualElement2, target, transitionEnd);
  target = resolved.target;
  transitionEnd = resolved.transitionEnd;
  return unitConversion(visualElement2, target, origin, transitionEnd);
};
function scrapeMotionValuesFromProps$1(props) {
  var style = props.style;
  var newValues = {};
  for (var key in style) {
    if (isMotionValue(style[key]) || isForcedMotionValue(key, props)) {
      newValues[key] = style[key];
    }
  }
  return newValues;
}
function renderHTML(element, _a) {
  var style = _a.style, vars = _a.vars;
  Object.assign(element.style, style);
  for (var key in vars) {
    element.style.setProperty(key, vars[key]);
  }
}
function getComputedStyle$1(element) {
  return window.getComputedStyle(element);
}
var htmlConfig = {
  treeType: "dom",
  readValueFromInstance: function(domElement, key) {
    if (isTransformProp(key)) {
      var defaultType = getDefaultValueType(key);
      return defaultType ? defaultType.default || 0 : 0;
    } else {
      var computedStyle = getComputedStyle$1(domElement);
      return (isCSSVariable$1(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
    }
  },
  sortNodePosition: function(a, b) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1;
  },
  getBaseTarget: function(props, key) {
    var _a;
    return (_a = props.style) === null || _a === void 0 ? void 0 : _a[key];
  },
  measureViewportBox: function(element, _a) {
    var transformPagePoint = _a.transformPagePoint;
    return getBoundingBox(element, transformPagePoint);
  },
  resetTransform: function(element, domElement, props) {
    var transformTemplate = props.transformTemplate;
    domElement.style.transform = transformTemplate ? transformTemplate({}, "") : "none";
    element.scheduleRender();
  },
  restoreTransform: function(instance, mutableState) {
    instance.style.transform = mutableState.style.transform;
  },
  removeValueFromRenderState: function(key, _a) {
    var vars = _a.vars, style = _a.style;
    delete vars[key];
    delete style[key];
  },
  makeTargetAnimatable: function(element, _a, _b, isMounted) {
    var transformValues = _b.transformValues;
    if (isMounted === void 0) {
      isMounted = true;
    }
    var transition = _a.transition, transitionEnd = _a.transitionEnd, target = __rest(_a, ["transition", "transitionEnd"]);
    var origin = getOrigin(target, transition || {}, element);
    if (transformValues) {
      if (transitionEnd)
        transitionEnd = transformValues(transitionEnd);
      if (target)
        target = transformValues(target);
      if (origin)
        origin = transformValues(origin);
    }
    if (isMounted) {
      checkTargetForNewValues(element, target, origin);
      var parsed = parseDomVariant(element, target, origin, transitionEnd);
      transitionEnd = parsed.transitionEnd;
      target = parsed.target;
    }
    return __assign({
      transition,
      transitionEnd
    }, target);
  },
  scrapeMotionValuesFromProps: scrapeMotionValuesFromProps$1,
  build: function(element, renderState, latestValues, projection, layoutState, options2, props) {
    if (element.isVisible !== void 0) {
      renderState.style.visibility = element.isVisible ? "visible" : "hidden";
    }
    var isProjectionTranform = projection.isEnabled && layoutState.isHydrated;
    buildHTMLStyles(renderState, latestValues, projection, layoutState, options2, props.transformTemplate, isProjectionTranform ? buildLayoutProjectionTransform : void 0, isProjectionTranform ? buildLayoutProjectionTransformOrigin : void 0);
  },
  render: renderHTML
};
var htmlVisualElement = visualElement(htmlConfig);
function scrapeMotionValuesFromProps(props) {
  var newValues = scrapeMotionValuesFromProps$1(props);
  for (var key in props) {
    if (isMotionValue(props[key])) {
      var targetKey = key === "x" || key === "y" ? "attr" + key.toUpperCase() : key;
      newValues[targetKey] = props[key];
    }
  }
  return newValues;
}
var CAMEL_CASE_PATTERN = /([a-z])([A-Z])/g;
var REPLACE_TEMPLATE = "$1-$2";
var camelToDash = function(str) {
  return str.replace(CAMEL_CASE_PATTERN, REPLACE_TEMPLATE).toLowerCase();
};
var camelCaseAttributes = new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox"
]);
function renderSVG(element, renderState) {
  renderHTML(element, renderState);
  for (var key in renderState.attrs) {
    element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
  }
}
var svgVisualElement = visualElement(__assign(__assign({}, htmlConfig), {
  getBaseTarget: function(props, key) {
    return props[key];
  },
  readValueFromInstance: function(domElement, key) {
    var _a;
    if (isTransformProp(key)) {
      return ((_a = getDefaultValueType(key)) === null || _a === void 0 ? void 0 : _a.default) || 0;
    }
    key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
    return domElement.getAttribute(key);
  },
  scrapeMotionValuesFromProps,
  build: function(_element, renderState, latestValues, projection, layoutState, options2, props) {
    var isProjectionTranform = projection.isEnabled && layoutState.isHydrated;
    buildSVGAttrs(renderState, latestValues, projection, layoutState, options2, props.transformTemplate, isProjectionTranform ? buildLayoutProjectionTransform : void 0, isProjectionTranform ? buildLayoutProjectionTransformOrigin : void 0);
  },
  render: renderSVG
}));
var createDomVisualElement = function(Component, options2) {
  return Component === "SVG" ? svgVisualElement(options2, { enableHardwareAcceleration: false }) : htmlVisualElement(options2, { enableHardwareAcceleration: true });
};
var svgMotionConfig = {
  scrapeMotionValuesFromProps,
  createRenderState: createSvgRenderState,
  onMount: function(props, instance, _a) {
    var renderState = _a.renderState, latestValues = _a.latestValues;
    try {
      renderState.dimensions = typeof instance.getBBox === "function" ? instance.getBBox() : instance.getBoundingClientRect();
    } catch (e) {
      renderState.dimensions = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }
    if (isPath(instance)) {
      renderState.totalPathLength = instance.getTotalLength();
    }
    buildSVGAttrs(renderState, latestValues, void 0, void 0, { enableHardwareAcceleration: false }, props.transformTemplate);
    renderSVG(instance, renderState);
  }
};
function isPath(element) {
  return element.tagName === "path";
}
var htmlMotionConfig = {
  scrapeMotionValuesFromProps: scrapeMotionValuesFromProps$1,
  createRenderState: createHtmlRenderState
};
function getCurrentTreeVariants(props, context) {
  if (checkIfControllingVariants(props)) {
    var initial = props.initial, animate = props.animate;
    return {
      initial: initial === false || isVariantLabel(initial) ? initial : void 0,
      animate: isVariantLabel(animate) ? animate : void 0
    };
  }
  return props.inherit !== false ? context || {} : {};
}
const UseCreateMotionContext = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $mc, $$unsubscribe_mc;
  let { props, isStatic, isCustom } = $$props;
  let mc = getContext(MotionContext) || MotionContext(isCustom);
  $$unsubscribe_mc = subscribe(mc, (value2) => $mc = value2);
  let { initial, animate } = getCurrentTreeVariants(props, get_store_value(mc));
  const variantLabelsAsDependency = (prop) => {
    return Array.isArray(prop) ? prop.join(" ") : prop;
  };
  const memo = () => {
    return { initial, animate };
  };
  let value = memo();
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.isStatic === void 0 && $$bindings.isStatic && isStatic !== void 0)
    $$bindings.isStatic(isStatic);
  if ($$props.isCustom === void 0 && $$bindings.isCustom && isCustom !== void 0)
    $$bindings.isCustom(isCustom);
  ({ initial, animate } = getCurrentTreeVariants(props, $mc));
  {
    if (isStatic) {
      value = memo(variantLabelsAsDependency(initial), variantLabelsAsDependency(animate));
    }
  }
  $$unsubscribe_mc();
  return `${slots.default ? slots.default({ value }) : ``}`;
});
function resolveMotionValue(value) {
  var unwrappedValue = isMotionValue(value) ? value.get() : value;
  return isCustomValue(unwrappedValue) ? unwrappedValue.toValue() : unwrappedValue;
}
const makeState = ({ scrapeMotionValuesFromProps: scrapeMotionValuesFromProps2, createRenderState, onMount }, props, context, presenceContext) => {
  const state = {
    latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps2),
    renderState: createRenderState()
  };
  if (onMount) {
    state.mount = (instance) => onMount(props, instance, state);
  }
  return state;
};
function makeLatestValues(props, context, presenceContext, scrapeMotionValues) {
  const values = {};
  const blockInitialAnimation = (presenceContext == null ? void 0 : presenceContext.initial) === false;
  const motionValues = scrapeMotionValues(props);
  for (const key in motionValues) {
    values[key] = resolveMotionValue(motionValues[key]);
  }
  let { initial, animate } = props;
  const isControllingVariants = checkIfControllingVariants(props);
  const isVariantNode = checkIfVariantNode(props);
  if (context && isVariantNode && !isControllingVariants && props.inherit !== false) {
    initial !== null && initial !== void 0 ? initial : initial = context.initial;
    animate !== null && animate !== void 0 ? animate : animate = context.animate;
  }
  const variantToSet = blockInitialAnimation || initial === false ? animate : initial;
  if (variantToSet && typeof variantToSet !== "boolean" && !isAnimationControls(variantToSet)) {
    const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
    list.forEach((definition) => {
      const resolved = resolveVariantFromProps(props, definition);
      if (!resolved)
        return;
      const { transitionEnd, transition, ...target } = resolved;
      for (const key in target)
        values[key] = target[key];
      for (const key in transitionEnd)
        values[key] = transitionEnd[key];
    });
  }
  return values;
}
const UseVisualState = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $presenceContext, $$unsubscribe_presenceContext;
  let $context, $$unsubscribe_context;
  let { config, props, isStatic, isCustom } = $$props;
  const context = getContext(MotionContext) || MotionContext(isCustom);
  $$unsubscribe_context = subscribe(context, (value) => $context = value);
  const presenceContext = getContext(PresenceContext) || PresenceContext(isCustom);
  $$unsubscribe_presenceContext = subscribe(presenceContext, (value) => $presenceContext = value);
  let state = makeState(config, props, get_store_value(context), get_store_value(presenceContext));
  const ms = makeState;
  if ($$props.config === void 0 && $$bindings.config && config !== void 0)
    $$bindings.config(config);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.isStatic === void 0 && $$bindings.isStatic && isStatic !== void 0)
    $$bindings.isStatic(isStatic);
  if ($$props.isCustom === void 0 && $$bindings.isCustom && isCustom !== void 0)
    $$bindings.isCustom(isCustom);
  {
    if (isStatic) {
      state = ms(config, props, $context, $presenceContext);
    }
  }
  $$unsubscribe_presenceContext();
  $$unsubscribe_context();
  return `${slots.default ? slots.default({ state }) : ``}`;
});
function isRefObject(ref) {
  return typeof ref === "object" && Object.prototype.hasOwnProperty.call(ref, "current");
}
function useMotionRef(visualState, visualElement2, externalRef) {
  return function(instance) {
    var _a;
    instance && ((_a = visualState.mount) === null || _a === void 0 ? void 0 : _a.call(visualState, instance));
    if (visualElement2) {
      instance ? visualElement2.mount(instance) : visualElement2.unmount();
    }
    if (externalRef) {
      if (typeof externalRef === "function") {
        externalRef(instance);
      } else if (isRefObject(externalRef)) {
        externalRef.current = instance;
      }
    }
  };
}
const Motion = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let motionProps;
  let isStatic;
  let $$restProps = compute_rest_props($$props, ["isSVG", "forwardMotionProps", "externalRef", "targetEl"]);
  let $a, $$unsubscribe_a;
  let { isSVG = false, forwardMotionProps = false, externalRef = void 0, targetEl = void 0 } = $$props;
  const isCustom = targetEl;
  let Component = isSVG ? "SVG" : "DOM";
  let createVisualElement = createDomVisualElement;
  let visualStateConfig = isSVG ? svgMotionConfig : htmlMotionConfig;
  const a = getContext(MotionConfigContext) || MotionConfigContext(isCustom);
  $$unsubscribe_a = subscribe(a, (value) => $a = value);
  const setContext2 = (c, v) => {
    c.visualElement = v;
    return v;
  };
  if ($$props.isSVG === void 0 && $$bindings.isSVG && isSVG !== void 0)
    $$bindings.isSVG(isSVG);
  if ($$props.forwardMotionProps === void 0 && $$bindings.forwardMotionProps && forwardMotionProps !== void 0)
    $$bindings.forwardMotionProps(forwardMotionProps);
  if ($$props.externalRef === void 0 && $$bindings.externalRef && externalRef !== void 0)
    $$bindings.externalRef(externalRef);
  if ($$props.targetEl === void 0 && $$bindings.targetEl && targetEl !== void 0)
    $$bindings.targetEl(targetEl);
  motionProps = $$restProps;
  ({ isStatic } = $a || {});
  $$unsubscribe_a();
  return `${validate_component(ScaleCorrectionProvider, "ScaleCorrectionProvider").$$render($$result, { isCustom }, {}, {
    default: () => `${validate_component(UseCreateMotionContext, "UseCreateMotionContext").$$render($$result, { props: motionProps, isStatic, isCustom }, {}, {
      default: ({ value: context }) => `${validate_component(UseVisualState, "UseVisualState").$$render($$result, {
        config: visualStateConfig,
        props: motionProps,
        isStatic,
        isCustom
      }, {}, {
        default: ({ state: visualState }) => `${validate_component(UseVisualElement, "UseVisualElement").$$render($$result, {
          Component,
          visualState,
          createVisualElement,
          props: motionProps,
          isCustom
        }, {}, {
          default: ({ visualElement: visualElement2 }) => `${validate_component(UseFeatures, "UseFeatures").$$render($$result, {
            visualElement: setContext2(context, visualElement2),
            props: motionProps
          }, {}, {
            default: ({ features: _features }) => `${validate_component(MotionContextProvider, "MotionContextProvider").$$render($$result, { value: context, isCustom }, {}, {
              default: () => `${validate_component(UseRender, "UseRender").$$render($$result, {
                Component,
                props: motionProps,
                ref: useMotionRef(visualState, context.visualElement, externalRef),
                visualState,
                isStatic,
                forwardMotionProps
              }, {}, {
                default: ({ motion, props: renderProps }) => `${slots.default ? slots.default({ motion, props: renderProps }) : ``}`
              })}`
            })}

                    ${``}`
          })}`
        })}`
      })}`
    })}`
  })}`;
});
function pixelsToPercent(pixels, axis) {
  return pixels / (axis.max - axis.min) * 100;
}
function correctBorderRadius(latest, _layoutState, _a) {
  var target = _a.target;
  if (typeof latest === "string") {
    if (px.test(latest)) {
      latest = parseFloat(latest);
    } else {
      return latest;
    }
  }
  var x = pixelsToPercent(latest, target.x);
  var y = pixelsToPercent(latest, target.y);
  return x + "% " + y + "%";
}
var varToken = "_$css";
function correctBoxShadow(latest, _a) {
  var delta2 = _a.delta, treeScale = _a.treeScale;
  var original = latest;
  var containsCSSVariables = latest.includes("var(");
  var cssVariables = [];
  if (containsCSSVariables) {
    latest = latest.replace(cssVariableRegex, function(match) {
      cssVariables.push(match);
      return varToken;
    });
  }
  var shadow = complex.parse(latest);
  if (shadow.length > 5)
    return original;
  var template2 = complex.createTransformer(latest);
  var offset = typeof shadow[0] !== "number" ? 1 : 0;
  var xScale = delta2.x.scale * treeScale.x;
  var yScale = delta2.y.scale * treeScale.y;
  shadow[0 + offset] /= xScale;
  shadow[1 + offset] /= yScale;
  var averageScale = mix(xScale, yScale, 0.5);
  if (typeof shadow[2 + offset] === "number")
    shadow[2 + offset] /= averageScale;
  if (typeof shadow[3 + offset] === "number")
    shadow[3 + offset] /= averageScale;
  var output = template2(shadow);
  if (containsCSSVariables) {
    var i_1 = 0;
    output = output.replace(varToken, function() {
      var cssVariable = cssVariables[i_1];
      i_1++;
      return cssVariable;
    });
  }
  return output;
}
var borderCorrectionDefinition = {
  process: correctBorderRadius
};
({
  borderRadius: __assign(__assign({}, borderCorrectionDefinition), { applyTo: [
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomLeftRadius",
    "borderBottomRightRadius"
  ] }),
  borderTopLeftRadius: borderCorrectionDefinition,
  borderTopRightRadius: borderCorrectionDefinition,
  borderBottomLeftRadius: borderCorrectionDefinition,
  borderBottomRightRadius: borderCorrectionDefinition,
  boxShadow: {
    process: correctBoxShadow
  }
});
var lowercaseSVGElements = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "svg",
  "switch",
  "symbol",
  "text",
  "tspan",
  "use",
  "view"
];
function isSVGComponent(Component) {
  if (typeof Component !== "string" || Component.includes("-")) {
    return false;
  } else if (lowercaseSVGElements.indexOf(Component) > -1 || /[A-Z]/.test(Component)) {
    return true;
  }
  return false;
}
const Transformer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["___tag", "motion"]);
  let { ___tag = "div" } = $$props;
  let { motion } = $$props;
  let container;
  if ($$props.___tag === void 0 && $$bindings.___tag && ___tag !== void 0)
    $$bindings.___tag(___tag);
  if ($$props.motion === void 0 && $$bindings.motion && motion !== void 0)
    $$bindings.motion(motion);
  return `<div${spread([escape_object($$restProps)])}${add_attribute("this", container, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
const M = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["___tag"]);
  let { ___tag } = $$props;
  if ($$props.___tag === void 0 && $$bindings.___tag && ___tag !== void 0)
    $$bindings.___tag(___tag);
  return `${validate_component(Motion, "Motion").$$render($$result, Object.assign($$restProps), {}, {
    default: ({ props, motion }) => `${validate_component(Transformer, "T").$$render($$result, Object.assign({ motion }, { ___tag }, props), {}, {
      default: () => `${slots.default ? slots.default({}) : ``}`
    })}`
  })}`;
});
function createMotionProxy(defaultFeatures) {
  return new Proxy({}, {
    get: function(_target, key) {
      let type = key;
      if (key.slice(0, 1) === key.slice(0, 1).toLowerCase()) {
        type = isSVGComponent(key) ? "SVG" : "DOM";
      }
      const ret = new Proxy(M, {
        construct(target, args) {
          if (!args || !args[0]) {
            args.push({});
          }
          if (!args[0].props) {
            args[0].props = { ___tag: key, isSVG: type === "SVG" };
          } else {
            args[0].props.___tag = key;
            args[0].props.isSVG = type === "SVG";
          }
          return new target(...args);
        }
      });
      return ret;
    }
  });
}
createMotionProxy();
var main1 = "/_app/assets/1-52e24dec.png";
var main2 = "/_app/assets/2-779b6b5c.png";
var main3 = "/_app/assets/3-79f96e4f.jpg";
var main4 = "/_app/assets/4-c6c03fae.png";
const largeBarsArr = [
  {
    delay: 0.1,
    defaultPos: {
      left: "0px"
    },
    imagePos: {
      0: "0%",
      1: "0%"
    },
    index: 3,
    img: main1,
    position: {
      left: "10.9%",
      top: "0%",
      width: "2.7%"
    }
  },
  {
    index: 17,
    delay: 0.2,
    img: main2,
    imagePos: {
      0: "44%",
      1: "20%"
    },
    defaultPos: { left: "20vw" },
    position: {
      left: "34.6%",
      top: "0%",
      width: "2.5%"
    }
  },
  {
    index: 23,
    delay: 0.3,
    img: main3,
    imagePos: {
      0: "44%",
      1: "20%"
    },
    defaultPos: {
      left: "67.5%",
      right: "20vw"
    },
    position: {
      left: "75.1%",
      top: "0%",
      width: "2.7%"
    }
  },
  {
    index: 28,
    delay: 0.4,
    img: main4,
    imagePos: {
      0: "44%",
      1: "20%"
    },
    defaultPos: {
      left: "90%",
      right: "0"
    },
    position: {
      left: "94.4%",
      top: "0%",
      width: "2.9%"
    }
  }
];
var PageContent_svelte_svelte_type_style_lang = ".categories-container.svelte-17bk6he.svelte-17bk6he{position:fixed;right:0;top:30vh;right:20vw;z-index:3;color:#68208e}.categories-container.svelte-17bk6he .categories-label.svelte-17bk6he{font-size:2em;display:flex;align-items:center;gap:10px;cursor:pointer;text-transform:uppercase}.categories-container.svelte-17bk6he .categories-label .triangle-container.svelte-17bk6he{display:flex;flex-direction:column;gap:5px}.categories-container.svelte-17bk6he .t1.svelte-17bk6he{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:5px solid #68208e}.categories-container.svelte-17bk6he .t2.svelte-17bk6he{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #68208e}.main-page-container.svelte-17bk6he.svelte-17bk6he{padding:20px;display:flex;padding-top:5rem;overflow-y:auto;overflow-x:hidden;height:100%;gap:25px;z-index:4;width:100vw;height:100vh;position:absolute;flex-direction:column;align-items:center;justify-content:center}";
var Bar_svelte_svelte_type_style_lang = ".bar-container.svelte-f7n4zg{z-index:1;opacity:0;pointer-events:none;overflow:hidden;height:100%;position:absolute;background-color:white}.bar-container.svelte-f7n4zg:nth-child(1){left:2%;top:0%;width:1%}.bar-container.svelte-f7n4zg:nth-child(2){left:3.6%;top:0%;width:0.9%}.bar-container.svelte-f7n4zg:nth-child(3){left:6.9%;top:0%;width:2%}.bar-container.svelte-f7n4zg:nth-child(4){left:0;top:0%}.bar-container.svelte-f7n4zg:nth-child(5){left:14.3%;top:0%}.bar-container.svelte-f7n4zg:nth-child(6){left:17.8%;top:0%;width:1.5%}.bar-container.svelte-f7n4zg:nth-child(7){left:20%;top:0%;width:1.1%}.bar-container.svelte-f7n4zg:nth-child(8){left:23.1%;top:0%;width:1.9%}.bar-container.svelte-f7n4zg:nth-child(9){left:25.7%;top:0%;width:1%}.bar-container.svelte-f7n4zg:nth-child(10){left:28.8%;top:0%;width:1%}.bar-container.svelte-f7n4zg:nth-child(11){left:32%;top:0%;width:1.9%}.bar-container.svelte-f7n4zg:nth-child(13){left:46.6%;top:0%;width:1%}.bar-container.svelte-f7n4zg:nth-child(14){left:49.8%;top:0%;width:1.9%}.bar-container.svelte-f7n4zg:nth-child(15){left:54%;top:0%;width:0.9%}.bar-container.svelte-f7n4zg:nth-child(16){left:55.6%;top:0%;width:1.8%}.bar-container.svelte-f7n4zg:nth-child(17){left:59.5%;top:0%;width:1.1%}.bar-container.svelte-f7n4zg:nth-child(19){left:91.3%;top:0%;width:1.1%}.bar-container.svelte-f7n4zg:nth-child(20){left:64.5%;top:0%;width:1%}.bar-container.svelte-f7n4zg:nth-child(21){left:66.4%;top:0%;width:0.9%}.bar-container.svelte-f7n4zg:nth-child(22){left:69.4%;top:0%;width:1.9%}.bar-container.svelte-f7n4zg:nth-child(23){left:73.5%;top:0%;width:0.9%}.bar-container.svelte-f7n4zg:nth-child(24){left:79.9%;top:0%;width:1.7%}.bar-container.svelte-f7n4zg:nth-child(25){left:82.5%;top:0%;width:0.8%}.bar-container.svelte-f7n4zg:nth-child(26){left:85.5%;top:0%;width:1.2%}.bar-container.svelte-f7n4zg:nth-child(27){left:88.9%;top:0%;width:1.7%}.bar-container.svelte-f7n4zg:nth-child(28){right:0;top:0%}.bar-container.svelte-f7n4zg:nth-child(29){left:97.9%;top:0%;width:1.7%}";
const css$3 = {
  code: ".bar-container.svelte-f7n4zg{z-index:1;opacity:0;pointer-events:none;overflow:hidden;height:100%;position:absolute;background-color:white}.bar-container.svelte-f7n4zg:nth-child(1){left:2%;top:0%;width:1%}.bar-container.svelte-f7n4zg:nth-child(2){left:3.6%;top:0%;width:0.9%}.bar-container.svelte-f7n4zg:nth-child(3){left:6.9%;top:0%;width:2%}.bar-container.svelte-f7n4zg:nth-child(4){left:0;top:0%}.bar-container.svelte-f7n4zg:nth-child(5){left:14.3%;top:0%}.bar-container.svelte-f7n4zg:nth-child(6){left:17.8%;top:0%;width:1.5%}.bar-container.svelte-f7n4zg:nth-child(7){left:20%;top:0%;width:1.1%}.bar-container.svelte-f7n4zg:nth-child(8){left:23.1%;top:0%;width:1.9%}.bar-container.svelte-f7n4zg:nth-child(9){left:25.7%;top:0%;width:1%}.bar-container.svelte-f7n4zg:nth-child(10){left:28.8%;top:0%;width:1%}.bar-container.svelte-f7n4zg:nth-child(11){left:32%;top:0%;width:1.9%}.bar-container.svelte-f7n4zg:nth-child(13){left:46.6%;top:0%;width:1%}.bar-container.svelte-f7n4zg:nth-child(14){left:49.8%;top:0%;width:1.9%}.bar-container.svelte-f7n4zg:nth-child(15){left:54%;top:0%;width:0.9%}.bar-container.svelte-f7n4zg:nth-child(16){left:55.6%;top:0%;width:1.8%}.bar-container.svelte-f7n4zg:nth-child(17){left:59.5%;top:0%;width:1.1%}.bar-container.svelte-f7n4zg:nth-child(19){left:91.3%;top:0%;width:1.1%}.bar-container.svelte-f7n4zg:nth-child(20){left:64.5%;top:0%;width:1%}.bar-container.svelte-f7n4zg:nth-child(21){left:66.4%;top:0%;width:0.9%}.bar-container.svelte-f7n4zg:nth-child(22){left:69.4%;top:0%;width:1.9%}.bar-container.svelte-f7n4zg:nth-child(23){left:73.5%;top:0%;width:0.9%}.bar-container.svelte-f7n4zg:nth-child(24){left:79.9%;top:0%;width:1.7%}.bar-container.svelte-f7n4zg:nth-child(25){left:82.5%;top:0%;width:0.8%}.bar-container.svelte-f7n4zg:nth-child(26){left:85.5%;top:0%;width:1.2%}.bar-container.svelte-f7n4zg:nth-child(27){left:88.9%;top:0%;width:1.7%}.bar-container.svelte-f7n4zg:nth-child(28){right:0;top:0%}.bar-container.svelte-f7n4zg:nth-child(29){left:97.9%;top:0%;width:1.7%}",
  map: '{"version":3,"file":"Bar.svelte","sources":["Bar.svelte"],"sourcesContent":["<script>\\r\\n  import { afterUpdate, onMount } from \\"svelte\\";\\r\\n\\r\\n  import { Motion, useAnimation } from \\"svelte-motion\\";\\r\\n  import gsap from \\"gsap\\";\\r\\n  import PageContent from \\"./PageContent.svelte\\";\\r\\n  import { largeBarObj } from \\"../animationObj\\";\\r\\n  export let index;\\r\\n  export let animations;\\r\\n  export let shouldPulse;\\r\\n  let bar;\\r\\n\\r\\n  onMount(() => {\\r\\n    gsap.to(bar, {\\r\\n      opacity: 1,\\r\\n      delay: 4.5,\\r\\n      duration: 5,\\r\\n    });\\r\\n  });\\r\\n<\/script>\\r\\n\\r\\n<div bind:this={bar} class=\\"bar-container\\" />\\r\\n\\r\\n<style lang=\\"scss\\">.cover-image {\\n  height: 100%;\\n  object-position: center center;\\n  width: 100%;\\n  object-fit: cover;\\n}\\n\\n.bar-container {\\n  z-index: 1;\\n  opacity: 0;\\n  pointer-events: none;\\n  overflow: hidden;\\n  height: 100%;\\n  position: absolute;\\n  background-color: white;\\n}\\n.bar-container:nth-child(1) {\\n  left: 2%;\\n  top: 0%;\\n  width: 1%;\\n}\\n.bar-container:nth-child(2) {\\n  left: 3.6%;\\n  top: 0%;\\n  width: 0.9%;\\n}\\n.bar-container:nth-child(3) {\\n  left: 6.9%;\\n  top: 0%;\\n  width: 2%;\\n}\\n.bar-container:nth-child(4) {\\n  left: 0;\\n  top: 0%;\\n}\\n.bar-container:nth-child(5) {\\n  left: 14.3%;\\n  top: 0%;\\n}\\n.bar-container:nth-child(6) {\\n  left: 17.8%;\\n  top: 0%;\\n  width: 1.5%;\\n}\\n.bar-container:nth-child(7) {\\n  left: 20%;\\n  top: 0%;\\n  width: 1.1%;\\n}\\n.bar-container:nth-child(8) {\\n  left: 23.1%;\\n  top: 0%;\\n  width: 1.9%;\\n}\\n.bar-container:nth-child(9) {\\n  left: 25.7%;\\n  top: 0%;\\n  width: 1%;\\n}\\n.bar-container:nth-child(10) {\\n  left: 28.8%;\\n  top: 0%;\\n  width: 1%;\\n}\\n.bar-container:nth-child(11) {\\n  left: 32%;\\n  top: 0%;\\n  width: 1.9%;\\n}\\n.bar-container:nth-child(13) {\\n  left: 46.6%;\\n  top: 0%;\\n  width: 1%;\\n}\\n.bar-container:nth-child(14) {\\n  left: 49.8%;\\n  top: 0%;\\n  width: 1.9%;\\n}\\n.bar-container:nth-child(15) {\\n  left: 54%;\\n  top: 0%;\\n  width: 0.9%;\\n}\\n.bar-container:nth-child(16) {\\n  left: 55.6%;\\n  top: 0%;\\n  width: 1.8%;\\n}\\n.bar-container:nth-child(17) {\\n  left: 59.5%;\\n  top: 0%;\\n  width: 1.1%;\\n}\\n.bar-container:nth-child(19) {\\n  left: 91.3%;\\n  top: 0%;\\n  width: 1.1%;\\n}\\n.bar-container:nth-child(20) {\\n  left: 64.5%;\\n  top: 0%;\\n  width: 1%;\\n}\\n.bar-container:nth-child(21) {\\n  left: 66.4%;\\n  top: 0%;\\n  width: 0.9%;\\n}\\n.bar-container:nth-child(22) {\\n  left: 69.4%;\\n  top: 0%;\\n  width: 1.9%;\\n}\\n.bar-container:nth-child(23) {\\n  left: 73.5%;\\n  top: 0%;\\n  width: 0.9%;\\n}\\n.bar-container:nth-child(24) {\\n  left: 79.9%;\\n  top: 0%;\\n  width: 1.7%;\\n}\\n.bar-container:nth-child(25) {\\n  left: 82.5%;\\n  top: 0%;\\n  width: 0.8%;\\n}\\n.bar-container:nth-child(26) {\\n  left: 85.5%;\\n  top: 0%;\\n  width: 1.2%;\\n}\\n.bar-container:nth-child(27) {\\n  left: 88.9%;\\n  top: 0%;\\n  width: 1.7%;\\n}\\n.bar-container:nth-child(28) {\\n  right: 0;\\n  top: 0%;\\n}\\n.bar-container:nth-child(29) {\\n  left: 97.9%;\\n  top: 0%;\\n  width: 1.7%;\\n}</style>\\r\\n"],"names":[],"mappings":"AA8BA,cAAc,cAAC,CAAC,AACd,OAAO,CAAE,CAAC,CACV,OAAO,CAAE,CAAC,CACV,cAAc,CAAE,IAAI,CACpB,QAAQ,CAAE,MAAM,CAChB,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,QAAQ,CAClB,gBAAgB,CAAE,KAAK,AACzB,CAAC,AACD,4BAAc,WAAW,CAAC,CAAC,AAAC,CAAC,AAC3B,IAAI,CAAE,EAAE,CACR,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,EAAE,AACX,CAAC,AACD,4BAAc,WAAW,CAAC,CAAC,AAAC,CAAC,AAC3B,IAAI,CAAE,IAAI,CACV,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,CAAC,CAAC,AAAC,CAAC,AAC3B,IAAI,CAAE,IAAI,CACV,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,EAAE,AACX,CAAC,AACD,4BAAc,WAAW,CAAC,CAAC,AAAC,CAAC,AAC3B,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,EAAE,AACT,CAAC,AACD,4BAAc,WAAW,CAAC,CAAC,AAAC,CAAC,AAC3B,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,EAAE,AACT,CAAC,AACD,4BAAc,WAAW,CAAC,CAAC,AAAC,CAAC,AAC3B,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,CAAC,CAAC,AAAC,CAAC,AAC3B,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,CAAC,CAAC,AAAC,CAAC,AAC3B,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,GAAG,QAAQ,CAAC,CAAC,AAAC,CAAC,AAC3B,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,EAAE,AACX,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,EAAE,AACX,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,YAAY,gBAAE,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,EAAE,AACX,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,KAAK,CACX,EAAE,CAAC,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,KAAK,CACX,CAAC,EAAE,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,EAAE,AACX,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,IAAI,CAAC,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,IAAI,CAAC,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,EAAE,GAAG,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,EAAE,GAAG,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,EAAE,GAAG,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,EAAE,GAAG,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,KAAK,CAAE,CAAC,CACR,GAAG,CAAE,EAAE,AACT,CAAC,AACD,4BAAc,WAAW,EAAE,CAAC,AAAC,CAAC,AAC5B,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,EAAE,CACP,KAAK,CAAE,IAAI,AACb,CAAC"}'
};
const Bar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { index: index2 } = $$props;
  let { animations } = $$props;
  let { shouldPulse } = $$props;
  let bar;
  if ($$props.index === void 0 && $$bindings.index && index2 !== void 0)
    $$bindings.index(index2);
  if ($$props.animations === void 0 && $$bindings.animations && animations !== void 0)
    $$bindings.animations(animations);
  if ($$props.shouldPulse === void 0 && $$bindings.shouldPulse && shouldPulse !== void 0)
    $$bindings.shouldPulse(shouldPulse);
  $$result.css.add(css$3);
  return `<div class="${"bar-container svelte-f7n4zg"}"${add_attribute("this", bar, 0)}></div>`;
});
var BgLogo_svelte_svelte_type_style_lang = ".logo-caption.svelte-uhw1ju.svelte-uhw1ju{display:block;height:fit-content;white-space:nowrap;color:#a5a5a5;font-weight:900;transform:rotate(-180deg);font-size:5em;writing-mode:vertical-lr;text-transform:uppercase}.logo-container.svelte-uhw1ju.svelte-uhw1ju{max-width:200px;display:flex;position:absolute;left:0;top:0;transform:translateY(20%);justify-content:center;width:100%;z-index:2}.logo-container.svelte-uhw1ju img.svelte-uhw1ju{object-fit:cover;height:auto;width:100%}";
var MenuItem_svelte_svelte_type_style_lang = "@keyframes svelte-uwkdd3-marquee{100%{transform:translate3d(-50%, 0, 0)}}.marquee__inner.svelte-uwkdd3.svelte-uwkdd3{animation:svelte-uwkdd3-marquee 15s linear infinite}.marquee__img.svelte-uwkdd3.svelte-uwkdd3{width:15vw;height:70%;margin:0 2vw;border-radius:5vw;background-size:cover;background-position:50% 50%}.menu__item.svelte-uwkdd3.svelte-uwkdd3{cursor:default;position:relative;overflow:hidden;z-index:4;text-align:center;box-shadow:0 -1px black}.menu__item.svelte-uwkdd3.svelte-uwkdd3:last-child{box-shadow:0 1px black, 0 -1px black}.menu__item-link.svelte-uwkdd3.svelte-uwkdd3{display:block;position:relative;cursor:pointer;color:black;text-decoration:none}a.svelte-uwkdd3.svelte-uwkdd3:active{color:black}.marquee.svelte-uwkdd3.svelte-uwkdd3{position:absolute;top:0;left:0;overflow:hidden;width:100%;height:100%;pointer-events:none;background:#68208e;transform:translate3d(0, 101%, 0)}.marquee__inner-wrap.svelte-uwkdd3.svelte-uwkdd3{height:100%;width:100%;transform:translate3d(0, -101%, 0)}.marquee__inner.svelte-uwkdd3.svelte-uwkdd3{height:100%;width:fit-content;align-items:center;display:flex;position:relative;animation:svelte-uwkdd3-marquee 15s linear infinite;will-change:transform}@keyframes svelte-uwkdd3-marquee{100%{transform:translate3d(-50%, 0, 0)}}.menu__item-link.svelte-uwkdd3.svelte-uwkdd3,.marquee.svelte-uwkdd3 span.svelte-uwkdd3{white-space:nowrap;font-size:6vw;line-height:1.2;font-weight:600;padding:1vh 1vw 0;text-transform:uppercase}.marquee.svelte-uwkdd3 span.svelte-uwkdd3{text-align:center;color:var(--marquee-text);font-weight:400}";
var About_svelte_svelte_type_style_lang = ".main-text-content.svelte-1ssh2u5.svelte-1ssh2u5{max-width:600px;color:black;text-align:center}.main-text-header.svelte-1ssh2u5.svelte-1ssh2u5{font-size:6em;font-weight:900;letter-spacing:3px;text-align:center;color:#68208e;text-transform:uppercase}.content-image-container.svelte-1ssh2u5.svelte-1ssh2u5{max-width:600px;width:100%}.content-image-container.svelte-1ssh2u5 img.svelte-1ssh2u5{width:100%}.container.svelte-1ssh2u5.svelte-1ssh2u5{display:flex;flex-direction:column;gap:25px;align-items:center}";
var MalibuRebuild_svelte_svelte_type_style_lang = ".container.svelte-1ui1e1i{display:flex}.text-container.svelte-1ui1e1i{text-align:center;font-size:2em;max-width:700px;color:black}";
var Card_svelte_svelte_type_style_lang = '.card-container.svelte-1654zsx.svelte-1654zsx{transform:rotateX(0deg);transform-style:preserve-3d;display:flex;justify-content:center;align-items:center;position:absolute;width:300px;height:500px;will-change:transform;touch-action:none;box-shadow:0 12.5px 100px -10px rgba(50, 50, 73, 0.4), 0 10px 10px -10px rgba(50, 50, 73, 0.3)}.image-container.svelte-1654zsx.svelte-1654zsx{overflow:hidden;transform:rotateY(-180deg)}.image-container.svelte-1654zsx img.svelte-1654zsx{height:100%;width:100%;touch-action:none;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.back-container.svelte-1654zsx.svelte-1654zsx{content:"";top:0;z-index:-1;position:absolute;transform:rotateX(0deg) translate3d(0px, 0px, 1px);height:100%;display:block;width:100%;border-radius:10px}';
var MeetTheTeam_svelte_svelte_type_style_lang = ".card-container.svelte-178zda3{display:flex;justify-content:center;position:relative;align-items:center}";
readable({
  x: 0,
  y: 0
}, (set) => {
  function mouseCoords(e) {
    set({
      x: e.clientX,
      y: e.clientY
    });
  }
  window.addEventListener("mousemove", mouseCoords);
  return () => {
    window.removeEventListener("mousemove", mouseCoords);
  };
});
var PressCard_svelte_svelte_type_style_lang = ".image.svelte-1b1h626{width:100%;object-position:center center;height:100%;object-fit:cover}";
var Press_svelte_svelte_type_style_lang = ".text-container.svelte-11jg594.svelte-11jg594{z-index:2;width:80vw;opacity:70%}.text-container.svelte-11jg594 img.svelte-11jg594{width:100%}.container.svelte-11jg594.svelte-11jg594{position:relative;width:100%;height:100%;display:flex;justify-content:center;align-items:center}.image-container.svelte-11jg594.svelte-11jg594{position:absolute}.image-container.svelte-11jg594.svelte-11jg594:nth-child(2){width:15vw}.image-container.svelte-11jg594.svelte-11jg594:nth-child(3){bottom:-12vw;left:48vw;width:15vw}.image-container.svelte-11jg594.svelte-11jg594:nth-child(4){left:8vw;top:5vh;width:15vw}.image-container.svelte-11jg594.svelte-11jg594:nth-child(5){right:8vw;bottom:-0.2vw;width:12vw}.image-container.svelte-11jg594.svelte-11jg594:nth-child(6){right:4vw;top:9vh;width:15vw;z-index:1}.image-container.svelte-11jg594.svelte-11jg594:nth-child(7){bottom:-20vh;left:9vw;width:15vw}.image-container.svelte-11jg594.svelte-11jg594:nth-child(8){top:0;right:12vw;width:11vw}";
var Marque_svelte_svelte_type_style_lang = '.logo-container.svelte-ccahbc.svelte-ccahbc{max-width:200px}.logo-container.svelte-ccahbc .logo.svelte-ccahbc{width:100%}.frame.svelte-ccahbc.svelte-ccahbc{position:fixed;text-align:left;z-index:3;top:0;left:0;display:flex;justify-content:center;width:100%;max-width:none;height:100vh;padding:1.5rem 2rem 1rem;pointer-events:none}.container.svelte-ccahbc.svelte-ccahbc{margin:0;--color-text:#111;--color-bg:white;--color-link:#000;--color-link-hover:#000;--color-border:#a7927b;--marquee-bg:#000;--marquee-text:#fff;--menu-focus:#775e41;z-index:3;position:relative;background-color:transparent;font-family:reason-new, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.menu-wrap.svelte-ccahbc.svelte-ccahbc{display:flex;background-size:cover;background-image:url("__VITE_ASSET__112e1098__");flex-direction:column;width:100vw;height:100vh;position:relative;justify-content:center}';
var LargeBar_svelte_svelte_type_style_lang = ".cover-image.svelte-rjl1is{height:100%;object-position:center center;width:100%;object-fit:cover}.bar-container.svelte-rjl1is{opacity:0;width:20%;top:0;z-index:1;pointer-events:none;overflow:hidden;height:100%;position:absolute;background-color:white}.opened.svelte-rjl1is{z-index:3}.bar-3.svelte-rjl1is{left:0}.bar-17.svelte-rjl1is{left:20vw}.bar-23.svelte-rjl1is{right:20vw}.bar-28.svelte-rjl1is{right:0}";
const css$2 = {
  code: ".cover-image.svelte-rjl1is{height:100%;object-position:center center;width:100%;object-fit:cover}.bar-container.svelte-rjl1is{opacity:0;width:20%;top:0;z-index:1;pointer-events:none;overflow:hidden;height:100%;position:absolute;background-color:white}.opened.svelte-rjl1is{z-index:3}.bar-3.svelte-rjl1is{left:0}.bar-17.svelte-rjl1is{left:20vw}.bar-23.svelte-rjl1is{right:20vw}.bar-28.svelte-rjl1is{right:0}",
  map: `{"version":3,"file":"LargeBar.svelte","sources":["LargeBar.svelte"],"sourcesContent":["<script>\\r\\n  import { afterUpdate, createEventDispatcher, onMount } from \\"svelte\\";\\r\\n\\r\\n  import { Motion, useAnimation } from \\"svelte-motion\\";\\r\\n\\r\\n  import PageContent from \\"./PageContent.svelte\\";\\r\\n  import { largeBarObj } from \\"../animationObj\\";\\r\\n  import gsap from \\"gsap\\";\\r\\n  import { amp, browser, dev, mode, prerendering } from \\"$app/env\\";\\r\\n  import Marque from \\"./Marquee/Marque.svelte\\";\\r\\n\\r\\n  export let index;\\r\\n  export let animations;\\r\\n  export let shouldPulse;\\r\\n  export let barObj;\\r\\n  export let completed;\\r\\n  let pageOpened = false;\\r\\n  let bar;\\r\\n  let img;\\r\\n  const dispatch = createEventDispatcher();\\r\\n  let tl;\\r\\n  let maintl;\\r\\n  onMount(async () => {\\r\\n    console.log(barObj.delay);\\r\\n    maintl = gsap.timeline({ delay: barObj.delay });\\r\\n\\r\\n    maintl\\r\\n      .to(bar, {\\r\\n        scale: 1,\\r\\n        duration: 5,\\r\\n        opacity: 1,\\r\\n        ...barObj.position,\\r\\n        ease: \\"power1.in\\",\\r\\n      })\\r\\n\\r\\n      .to(\\r\\n        img,\\r\\n        {\\r\\n          opacity: 0,\\r\\n        },\\r\\n        \\">-0.5\\"\\r\\n      )\\r\\n\\r\\n      .then(() => {\\r\\n        dispatch(\\"complete\\");\\r\\n      });\\r\\n\\r\\n    tl = gsap.timeline({\\r\\n      repeat: -1,\\r\\n      paused: true,\\r\\n    });\\r\\n  });\\r\\n\\r\\n  $: {\\r\\n    if (tl && completed) {\\r\\n      if (shouldPulse && browser) {\\r\\n        tl.to(bar, {\\r\\n          opacity: 0,\\r\\n          duration: 1,\\r\\n        }).to(bar, {\\r\\n          opacity: 1,\\r\\n          duration: 1,\\r\\n        });\\r\\n        tl.play();\\r\\n      } else {\\r\\n        tl.pause();\\r\\n        gsap.to(bar, {\\r\\n          opacity: 1,\\r\\n        });\\r\\n      }\\r\\n    }\\r\\n  }\\r\\n  $: {\\r\\n    if (shouldPulse) {\\r\\n      bar.style.pointerEvents = \\"auto\\";\\r\\n    }\\r\\n  }\\r\\n<\/script>\\r\\n\\r\\n<div\\r\\n  on:mouseenter={(e) => {\\r\\n    if (!pageOpened) {\\r\\n      gsap.to(bar, {\\r\\n        scale: 1.2,\\r\\n      });\\r\\n    }\\r\\n  }}\\r\\n  on:mouseleave={() => {\\r\\n    if (!pageOpened) {\\r\\n      gsap.to(bar, {\\r\\n        scale: 1,\\r\\n      });\\r\\n    }\\r\\n  }}\\r\\n  on:click={() => {\\r\\n    pageOpened = true;\\r\\n    dispatch(\\"stopPulse\\");\\r\\n    gsap.to(bar, {\\r\\n      left: -bar.offsetParent.offsetLeft,\\r\\n      width: \\"100vw\\",\\r\\n      height: \\"100vh\\",\\r\\n      duration: 0.5,\\r\\n      scale: 1,\\r\\n      top: -bar.offsetParent.offsetTop,\\r\\n    });\\r\\n  }}\\r\\n  style=\\"transform:scale(0.8)\\"\\r\\n  bind:this={bar}\\r\\n  class=\\"{pageOpened ? 'opened' : ''} bar-container bar-{barObj.index}\\"\\r\\n>\\r\\n  {#if pageOpened}\\r\\n    <Marque />\\r\\n    <div\\r\\n      class=\\"close-main\\"\\r\\n      on:click={(e) => {\\r\\n        e.stopPropagation();\\r\\n        dispatch(\\"startPulse\\");\\r\\n        pageOpened = false;\\r\\n        gsap.to(bar, {\\r\\n          height: \\"40vh\\",\\r\\n\\r\\n          left: barObj.position.left,\\r\\n          top: 0,\\r\\n\\r\\n          width: barObj.position.width,\\r\\n        });\\r\\n      }}\\r\\n    />\\r\\n  {/if}\\r\\n  <img bind:this={img} src={barObj.img} class=\\"cover-image\\" alt=\\"\\" />\\r\\n</div>\\r\\n\\r\\n<style lang=\\"scss\\">.cover-image {\\n  height: 100%;\\n  object-position: center center;\\n  width: 100%;\\n  object-fit: cover;\\n}\\n\\n.bar-container {\\n  opacity: 0;\\n  width: 20%;\\n  top: 0;\\n  z-index: 1;\\n  pointer-events: none;\\n  overflow: hidden;\\n  height: 100%;\\n  position: absolute;\\n  background-color: white;\\n}\\n\\n.opened {\\n  z-index: 3;\\n}\\n\\n.bar-3 {\\n  left: 0;\\n}\\n\\n.bar-17 {\\n  left: 20vw;\\n}\\n\\n.bar-23 {\\n  right: 20vw;\\n}\\n\\n.bar-28 {\\n  right: 0;\\n}</style>\\r\\n"],"names":[],"mappings":"AAoImB,YAAY,cAAC,CAAC,AAC/B,MAAM,CAAE,IAAI,CACZ,eAAe,CAAE,MAAM,CAAC,MAAM,CAC9B,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,KAAK,AACnB,CAAC,AAED,cAAc,cAAC,CAAC,AACd,OAAO,CAAE,CAAC,CACV,KAAK,CAAE,GAAG,CACV,GAAG,CAAE,CAAC,CACN,OAAO,CAAE,CAAC,CACV,cAAc,CAAE,IAAI,CACpB,QAAQ,CAAE,MAAM,CAChB,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,QAAQ,CAClB,gBAAgB,CAAE,KAAK,AACzB,CAAC,AAED,OAAO,cAAC,CAAC,AACP,OAAO,CAAE,CAAC,AACZ,CAAC,AAED,MAAM,cAAC,CAAC,AACN,IAAI,CAAE,CAAC,AACT,CAAC,AAED,OAAO,cAAC,CAAC,AACP,IAAI,CAAE,IAAI,AACZ,CAAC,AAED,OAAO,cAAC,CAAC,AACP,KAAK,CAAE,IAAI,AACb,CAAC,AAED,OAAO,cAAC,CAAC,AACP,KAAK,CAAE,CAAC,AACV,CAAC"}`
};
const LargeBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { index: index2 } = $$props;
  let { animations } = $$props;
  let { shouldPulse } = $$props;
  let { barObj } = $$props;
  let { completed } = $$props;
  let bar;
  let img;
  createEventDispatcher();
  if ($$props.index === void 0 && $$bindings.index && index2 !== void 0)
    $$bindings.index(index2);
  if ($$props.animations === void 0 && $$bindings.animations && animations !== void 0)
    $$bindings.animations(animations);
  if ($$props.shouldPulse === void 0 && $$bindings.shouldPulse && shouldPulse !== void 0)
    $$bindings.shouldPulse(shouldPulse);
  if ($$props.barObj === void 0 && $$bindings.barObj && barObj !== void 0)
    $$bindings.barObj(barObj);
  if ($$props.completed === void 0 && $$bindings.completed && completed !== void 0)
    $$bindings.completed(completed);
  $$result.css.add(css$2);
  {
    {
      if (shouldPulse) {
        bar.style.pointerEvents = "auto";
      }
    }
  }
  return `<div style="${"transform:scale(0.8)"}" class="${escape("") + " bar-container bar-" + escape(barObj.index) + " svelte-rjl1is"}"${add_attribute("this", bar, 0)}>${``}
  <img${add_attribute("src", barObj.img, 0)} class="${"cover-image svelte-rjl1is"}" alt="${""}"${add_attribute("this", img, 0)}>
</div>`;
});
var global = '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n@font-face {\n  font-family: "Orator";\n  src: url("__VITE_ASSET__b76fd88c__") format("truetype");\n}\nhtml {\n  overflow-x: hidden;\n}\n\n.close-main {\n  height: 32px;\n  max-height: 32px;\n  max-width: 32px;\n  min-height: 32px;\n  min-width: 32px;\n  position: absolute;\n  right: 0;\n  top: 0;\n  cursor: pointer;\n  width: 32px;\n  z-index: 3;\n}\n.close-main:after {\n  background-color: black;\n  content: "";\n  display: block;\n  right: 0;\n  position: absolute;\n  top: 50%;\n  height: 2px;\n  width: 50%;\n  transform: translate(-50%) translateY(-50%) rotate(45deg);\n  transform-origin: center center;\n}\n.close-main::before {\n  background-color: black;\n  content: "";\n  height: 50%;\n  width: 2px;\n  display: block;\n  left: 50%;\n  position: absolute;\n  top: 50%;\n  transform: translate(-50%) translateY(-50%) rotate(45deg);\n  transform-origin: center center;\n}';
var Logo_svelte_svelte_type_style_lang = ".bar-container.svelte-mts0d2{height:70vh;z-index:3;display:flex;gap:20px;width:100%;align-items:center;justify-content:center;position:relative}";
const css$1 = {
  code: ".bar-container.svelte-mts0d2{height:70vh;z-index:3;display:flex;gap:20px;width:100%;align-items:center;justify-content:center;position:relative}",
  map: '{"version":3,"file":"Logo.svelte","sources":["Logo.svelte"],"sourcesContent":["<script>\\r\\n  import { onDestroy, onMount } from \\"svelte\\";\\r\\n  import { Motion, useAnimation } from \\"svelte-motion\\";\\r\\n  import { largeBarObj, largeBarsArr } from \\"../animationObj\\";\\r\\n  import Bar from \\"../components/Bar.svelte\\";\\r\\n  import LargeBar from \\"../components/LargeBar.svelte\\";\\r\\n  import \\"../global.scss\\";\\r\\n  import gsap from \\"gsap\\";\\r\\n\\r\\n  onDestroy(() => {});\\r\\n\\r\\n  const bars = Array.from(\\" \\".repeat(27));\\r\\n  const animations = [];\\r\\n  let container;\\r\\n  let shouldPulse = false;\\r\\n  let completed = false;\\r\\n  onMount(() => {\\r\\n    gsap.to(container, {\\r\\n      height: \\"40vh\\",\\r\\n      duration: 5,\\r\\n    });\\r\\n  });\\r\\n<\/script>\\r\\n\\r\\n<div bind:this={container} class=\\"bar-container\\">\\r\\n  {#each bars as bar, i}\\r\\n    <Bar index={i} />\\r\\n  {/each}\\r\\n\\r\\n  {#each largeBarsArr as bar, i}\\r\\n    <LargeBar\\r\\n      on:stopPulse={() => {\\r\\n        console.log(\\"stopppped\\");\\r\\n        shouldPulse = false;\\r\\n      }}\\r\\n      on:startPulse={() => {\\r\\n        console.log(\\"stopppped\\");\\r\\n        shouldPulse = true;\\r\\n      }}\\r\\n      on:complete={() => {\\r\\n        animations.push(i);\\r\\n        if (animations.length === 4) {\\r\\n          completed = true;\\r\\n          shouldPulse = true;\\r\\n        }\\r\\n      }}\\r\\n      {shouldPulse}\\r\\n      {completed}\\r\\n      custom={bar.index}\\r\\n      barObj={bar}\\r\\n    />\\r\\n  {/each}\\r\\n</div>\\r\\n\\r\\n<style lang=\\"scss\\">.bar-container {\\n  height: 70vh;\\n  z-index: 3;\\n  display: flex;\\n  gap: 20px;\\n  width: 100%;\\n  align-items: center;\\n  justify-content: center;\\n  position: relative;\\n}</style>\\r\\n"],"names":[],"mappings":"AAsDmB,cAAc,cAAC,CAAC,AACjC,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,CAAC,CACV,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,IAAI,CACT,KAAK,CAAE,IAAI,CACX,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,QAAQ,CAAE,QAAQ,AACpB,CAAC"}'
};
const Logo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  onDestroy(() => {
  });
  const bars = Array.from(" ".repeat(27));
  let container;
  let shouldPulse = false;
  let completed = false;
  $$result.css.add(css$1);
  return `<div class="${"bar-container svelte-mts0d2"}"${add_attribute("this", container, 0)}>${each(bars, (bar, i) => `${validate_component(Bar, "Bar").$$render($$result, { index: i }, {}, {})}`)}

  ${each(largeBarsArr, (bar, i) => `${validate_component(LargeBar, "LargeBar").$$render($$result, {
    shouldPulse,
    completed,
    custom: bar.index,
    barObj: bar
  }, {}, {})}`)}
</div>`;
});
var logoText = "/_app/assets/logo Text-6620b85f.png";
var Home_svelte_svelte_type_style_lang = '.logo-text-container.svelte-1u0iqmy.svelte-1u0iqmy{max-width:500px;width:100%;z-index:2;opacity:0;padding-top:20px}.logo-text-container.svelte-1u0iqmy .logo-text.svelte-1u0iqmy{height:auto;object-fit:cover;width:100%}.container.svelte-1u0iqmy.svelte-1u0iqmy{background-repeat:no-repeat;font-family:Orator;color:white;background-size:cover;background-image:url("__VITE_ASSET__112e1098__");display:flex;flex-direction:column;padding:80px;gap:25px;justify-content:center;align-items:center;height:100vh;background-color:black;overflow:hidden}.container.svelte-1u0iqmy.svelte-1u0iqmy::after{position:absolute;top:0;bottom:0;left:0;right:0;width:100%;height:100%;content:"";background-color:rgba(0, 0, 0, 0.9)}h5.svelte-1u0iqmy.svelte-1u0iqmy{z-index:2;opacity:0;letter-spacing:5px;font-weight:100;font-size:4em;position:relative;text-transform:uppercase}';
const css = {
  code: '.logo-text-container.svelte-1u0iqmy.svelte-1u0iqmy{max-width:500px;width:100%;z-index:2;opacity:0;padding-top:20px}.logo-text-container.svelte-1u0iqmy .logo-text.svelte-1u0iqmy{height:auto;object-fit:cover;width:100%}.container.svelte-1u0iqmy.svelte-1u0iqmy{background-repeat:no-repeat;font-family:Orator;color:white;background-size:cover;background-image:url("../images/home/Background Photo.jpg");display:flex;flex-direction:column;padding:80px;gap:25px;justify-content:center;align-items:center;height:100vh;background-color:black;overflow:hidden}.container.svelte-1u0iqmy.svelte-1u0iqmy::after{position:absolute;top:0;bottom:0;left:0;right:0;width:100%;height:100%;content:"";background-color:rgba(0, 0, 0, 0.9)}h5.svelte-1u0iqmy.svelte-1u0iqmy{z-index:2;opacity:0;letter-spacing:5px;font-weight:100;font-size:4em;position:relative;text-transform:uppercase}',
  map: '{"version":3,"file":"Home.svelte","sources":["Home.svelte"],"sourcesContent":["<script>\\r\\n  import { Motion } from \\"svelte-motion\\";\\r\\n\\r\\n  import Logo from \\"../images/Logo.svelte\\";\\r\\n  import logoText from \\"../images/home/logo Text.png\\";\\r\\n  import { createEventDispatcher, onMount } from \\"svelte\\";\\r\\n  import gsap from \\"gsap\\";\\r\\n\\r\\n  let fadeIn;\\r\\n\\r\\n  const textVariant = {\\r\\n    visible: {\\r\\n      opacity: 1,\\r\\n      transition: {\\r\\n        delay: 5,\\r\\n        duration: 0.5,\\r\\n      },\\r\\n    },\\r\\n  };\\r\\n  onMount(() => {\\r\\n    const elesToFade = document.querySelectorAll(\\".fade\\");\\r\\n    console.log(elesToFade);\\r\\n    gsap.to(\\".fade\\", {\\r\\n      opacity: 1,\\r\\n      delay: 5,\\r\\n    });\\r\\n  });\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"container\\">\\r\\n  <h5 class=\\"fade\\">connecting people</h5>\\r\\n\\r\\n  <Logo />\\r\\n\\r\\n  <div class=\\"logo-text-container fade\\">\\r\\n    <img class=\\"logo-text\\" src={logoText} alt=\\"\\" />\\r\\n  </div>\\r\\n\\r\\n  <h5 class=\\"fade\\">to the art of living</h5>\\r\\n</div>\\r\\n\\r\\n<style lang=\\"scss\\">.logo-text-container {\\n  max-width: 500px;\\n  width: 100%;\\n  z-index: 2;\\n  opacity: 0;\\n  padding-top: 20px;\\n}\\n.logo-text-container .logo-text {\\n  height: auto;\\n  object-fit: cover;\\n  width: 100%;\\n}\\n\\n.container {\\n  background-repeat: no-repeat;\\n  font-family: Orator;\\n  color: white;\\n  background-size: cover;\\n  background-image: url(\\"../images/home/Background Photo.jpg\\");\\n  display: flex;\\n  flex-direction: column;\\n  padding: 80px;\\n  gap: 25px;\\n  justify-content: center;\\n  align-items: center;\\n  height: 100vh;\\n  background-color: black;\\n  overflow: hidden;\\n}\\n.container::after {\\n  position: absolute;\\n  top: 0;\\n  bottom: 0;\\n  left: 0;\\n  right: 0;\\n  width: 100%;\\n  height: 100%;\\n  content: \\"\\";\\n  background-color: rgba(0, 0, 0, 0.9);\\n}\\n\\nh5 {\\n  z-index: 2;\\n  opacity: 0;\\n  letter-spacing: 5px;\\n  font-weight: 100;\\n  font-size: 4em;\\n  position: relative;\\n  text-transform: uppercase;\\n}</style>\\r\\n"],"names":[],"mappings":"AAyCmB,oBAAoB,8BAAC,CAAC,AACvC,SAAS,CAAE,KAAK,CAChB,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,CAAC,CACV,OAAO,CAAE,CAAC,CACV,WAAW,CAAE,IAAI,AACnB,CAAC,AACD,mCAAoB,CAAC,UAAU,eAAC,CAAC,AAC/B,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,KAAK,CACjB,KAAK,CAAE,IAAI,AACb,CAAC,AAED,UAAU,8BAAC,CAAC,AACV,iBAAiB,CAAE,SAAS,CAC5B,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,KAAK,CACZ,eAAe,CAAE,KAAK,CACtB,gBAAgB,CAAE,IAAI,qCAAqC,CAAC,CAC5D,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,IAAI,CACT,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,MAAM,CAAE,KAAK,CACb,gBAAgB,CAAE,KAAK,CACvB,QAAQ,CAAE,MAAM,AAClB,CAAC,AACD,wCAAU,OAAO,AAAC,CAAC,AACjB,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,EAAE,CACX,gBAAgB,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,AACtC,CAAC,AAED,EAAE,8BAAC,CAAC,AACF,OAAO,CAAE,CAAC,CACV,OAAO,CAAE,CAAC,CACV,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,GAAG,CACd,QAAQ,CAAE,QAAQ,CAClB,cAAc,CAAE,SAAS,AAC3B,CAAC"}'
};
const Home = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="${"container svelte-1u0iqmy"}"><h5 class="${"fade svelte-1u0iqmy"}">connecting people</h5>

  ${validate_component(Logo, "Logo").$$render($$result, {}, {}, {})}

  <div class="${"logo-text-container fade svelte-1u0iqmy"}"><img class="${"logo-text svelte-1u0iqmy"}"${add_attribute("src", logoText, 0)} alt="${""}"></div>

  <h5 class="${"fade svelte-1u0iqmy"}">to the art of living</h5>
</div>`;
});
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  onDestroy(() => {
  });
  return `<div class="${"container"}">${validate_component(Home, "Home").$$render($$result, {}, {}, {})}
</div>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
export { init, render };
