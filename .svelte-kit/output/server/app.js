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
function noop$1() {
}
function safe_not_equal$1(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
const subscriber_queue$1 = [];
function writable$1(value, start = noop$1) {
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
function noop() {
}
const identity = (x) => x;
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return tar;
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
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
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
const css$3 = {
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
  $$result.css.add(css$3);
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
      file: assets + "/_app/start-53507122.js",
      css: [assets + "/_app/assets/start-61d1577b.css"],
      js: [assets + "/_app/start-53507122.js", assets + "/_app/chunks/vendor-12a695dd.js"]
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
const metadata_lookup = { ".svelte-kit/build/components/layout.svelte": { "entry": "layout.svelte-e959ee51.js", "css": [], "js": ["layout.svelte-e959ee51.js", "chunks/vendor-12a695dd.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-ac87dcb2.js", "css": [], "js": ["error.svelte-ac87dcb2.js", "chunks/vendor-12a695dd.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-75ead13a.js", "css": ["assets/pages/index.svelte-935516c5.css"], "js": ["pages/index.svelte-75ead13a.js", "chunks/vendor-12a695dd.js"], "styles": [] } };
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
  function subscribe2(run2, invalidate = noop) {
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
  return { set, update, subscribe: subscribe2 };
}
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a, b) {
  if (a === b || a !== a)
    return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
var Bar_svelte_svelte_type_style_lang = "@keyframes svelte-55qzhv-openingSm{}.sm.svelte-55qzhv{animation:svelte-55qzhv-openingSm 8s;animation-timing-function:cubic-bezier(0.5, 0.5, 1, 1)}.hovered.svelte-55qzhv{transform:translateY(-20px) scale(1.3)}.bar.svelte-55qzhv{z-index:5;background-color:white;position:absolute;transition:cubic-bezier(0.075, 0.82, 0.165, 1) 1s}.bar.svelte-55qzhv:nth-child(1){left:2%;top:13.8%;height:62%;width:1%}.bar.svelte-55qzhv:nth-child(2){left:3.6%;top:13.8%;height:62%;width:0.9%}.bar.svelte-55qzhv:nth-child(3){left:6.9%;top:13.9%;height:62%;width:2%}.bar.svelte-55qzhv:nth-child(4){left:10.9%;top:13.8%;height:62%;width:2.7%;animation:svelte-55qzhv-opening-4 8s cubic-bezier(0.4, 0, 1, 1)}@keyframes svelte-55qzhv-opening-4{}.bar.svelte-55qzhv:nth-child(5){left:14.3%;top:13.8%;height:62%;width:2.7%;animation:svelte-55qzhv-opening-5 8s cubic-bezier(0.4, 0, 1, 1)}@keyframes svelte-55qzhv-opening-5{}.bar.svelte-55qzhv:nth-child(6){left:17.8%;top:13.8%;height:62%;width:1.5%}.bar.svelte-55qzhv:nth-child(7){left:20%;top:13.8%;height:62%;width:1.1%}.bar.svelte-55qzhv:nth-child(8){left:23.1%;top:13.8%;height:62%;width:1.9%}.bar.svelte-55qzhv:nth-child(9){left:25.7%;top:13.8%;height:62%;width:1%}.bar.svelte-55qzhv:nth-child(10){left:28.8%;top:13.8%;height:62%;width:1%}.bar.svelte-55qzhv:nth-child(11){left:32%;top:13.8%;height:62%;width:1.9%}.bar.svelte-55qzhv:nth-child(12){left:34.6%;top:13.8%;height:62%;width:2.5%}.bar.svelte-55qzhv:nth-child(13){left:46.6%;top:13.8%;height:62%;width:1%}.bar.svelte-55qzhv:nth-child(14){left:49.8%;top:13.8%;height:62%;width:1.9%}.bar.svelte-55qzhv:nth-child(15){left:54%;top:13.8%;height:62%;width:0.9%}.bar.svelte-55qzhv:nth-child(16){left:55.6%;top:13.8%;height:62%;width:1.8%}.bar.svelte-55qzhv:nth-child(17){left:59.5%;top:13.8%;height:62%;width:1.1%}.bar.svelte-55qzhv:nth-child(18){left:61.3%;top:13.8%;height:62%;width:2.5%;animation:svelte-55qzhv-opening-18 8s cubic-bezier(0.4, 0, 1, 1)}@keyframes svelte-55qzhv-opening-18{}.bar.svelte-55qzhv:nth-child(19){left:91.3%;top:13.8%;height:62%;width:1.1%}.bar.svelte-55qzhv:nth-child(20){left:64.5%;top:13.8%;height:62%;width:1%}.bar.svelte-55qzhv:nth-child(21){left:66.4%;top:13.8%;height:62%;width:0.9%}.bar.svelte-55qzhv:nth-child(22){left:69.4%;top:13.8%;height:62%;width:1.9%}.bar.svelte-55qzhv:nth-child(23){left:73.5%;top:13.8%;height:62%;width:0.9%}.bar.svelte-55qzhv:nth-child(24){left:75.1%;top:13.8%;height:62%;width:2.7%}.bar.svelte-55qzhv:nth-child(25){left:79.9%;top:13.8%;height:62%;width:1.7%}.bar.svelte-55qzhv:nth-child(26){left:82.5%;top:13.8%;height:62%;width:0.8%}.bar.svelte-55qzhv:nth-child(27){left:85.5%;top:13.8%;height:62%;width:1.2%}.bar.svelte-55qzhv:nth-child(28){left:88.9%;top:13.8%;height:62%;width:1.7%}.bar.svelte-55qzhv:nth-child(29){left:94.4%;top:13.8%;height:62%;width:2.9%}.bar.svelte-55qzhv:nth-child(30){left:97.9%;top:13.8%;height:62%;width:1.7%;animation:svelte-55qzhv-opening-30 8s cubic-bezier(0.4, 0, 1, 1)}@keyframes svelte-55qzhv-opening-30{}.full-screen.svelte-55qzhv{position:fixed !important;left:0 !important;width:100vw !important}.full-screen.svelte-55qzhv:hover{content:none !important}";
const css$2 = {
  code: "@keyframes svelte-55qzhv-openingSm{}.sm.svelte-55qzhv{animation:svelte-55qzhv-openingSm 8s;animation-timing-function:cubic-bezier(0.5, 0.5, 1, 1)}.hovered.svelte-55qzhv{transform:translateY(-20px) scale(1.3)}.bar.svelte-55qzhv{z-index:5;background-color:white;position:absolute;transition:cubic-bezier(0.075, 0.82, 0.165, 1) 1s}.bar.svelte-55qzhv:nth-child(1){left:2%;top:13.8%;height:62%;width:1%}.bar.svelte-55qzhv:nth-child(2){left:3.6%;top:13.8%;height:62%;width:0.9%}.bar.svelte-55qzhv:nth-child(3){left:6.9%;top:13.9%;height:62%;width:2%}.bar.svelte-55qzhv:nth-child(4){left:10.9%;top:13.8%;height:62%;width:2.7%;animation:svelte-55qzhv-opening-4 8s cubic-bezier(0.4, 0, 1, 1)}@keyframes svelte-55qzhv-opening-4{}.bar.svelte-55qzhv:nth-child(5){left:14.3%;top:13.8%;height:62%;width:2.7%;animation:svelte-55qzhv-opening-5 8s cubic-bezier(0.4, 0, 1, 1)}@keyframes svelte-55qzhv-opening-5{}.bar.svelte-55qzhv:nth-child(6){left:17.8%;top:13.8%;height:62%;width:1.5%}.bar.svelte-55qzhv:nth-child(7){left:20%;top:13.8%;height:62%;width:1.1%}.bar.svelte-55qzhv:nth-child(8){left:23.1%;top:13.8%;height:62%;width:1.9%}.bar.svelte-55qzhv:nth-child(9){left:25.7%;top:13.8%;height:62%;width:1%}.bar.svelte-55qzhv:nth-child(10){left:28.8%;top:13.8%;height:62%;width:1%}.bar.svelte-55qzhv:nth-child(11){left:32%;top:13.8%;height:62%;width:1.9%}.bar.svelte-55qzhv:nth-child(12){left:34.6%;top:13.8%;height:62%;width:2.5%}.bar.svelte-55qzhv:nth-child(13){left:46.6%;top:13.8%;height:62%;width:1%}.bar.svelte-55qzhv:nth-child(14){left:49.8%;top:13.8%;height:62%;width:1.9%}.bar.svelte-55qzhv:nth-child(15){left:54%;top:13.8%;height:62%;width:0.9%}.bar.svelte-55qzhv:nth-child(16){left:55.6%;top:13.8%;height:62%;width:1.8%}.bar.svelte-55qzhv:nth-child(17){left:59.5%;top:13.8%;height:62%;width:1.1%}.bar.svelte-55qzhv:nth-child(18){left:61.3%;top:13.8%;height:62%;width:2.5%;animation:svelte-55qzhv-opening-18 8s cubic-bezier(0.4, 0, 1, 1)}@keyframes svelte-55qzhv-opening-18{}.bar.svelte-55qzhv:nth-child(19){left:91.3%;top:13.8%;height:62%;width:1.1%}.bar.svelte-55qzhv:nth-child(20){left:64.5%;top:13.8%;height:62%;width:1%}.bar.svelte-55qzhv:nth-child(21){left:66.4%;top:13.8%;height:62%;width:0.9%}.bar.svelte-55qzhv:nth-child(22){left:69.4%;top:13.8%;height:62%;width:1.9%}.bar.svelte-55qzhv:nth-child(23){left:73.5%;top:13.8%;height:62%;width:0.9%}.bar.svelte-55qzhv:nth-child(24){left:75.1%;top:13.8%;height:62%;width:2.7%}.bar.svelte-55qzhv:nth-child(25){left:79.9%;top:13.8%;height:62%;width:1.7%}.bar.svelte-55qzhv:nth-child(26){left:82.5%;top:13.8%;height:62%;width:0.8%}.bar.svelte-55qzhv:nth-child(27){left:85.5%;top:13.8%;height:62%;width:1.2%}.bar.svelte-55qzhv:nth-child(28){left:88.9%;top:13.8%;height:62%;width:1.7%}.bar.svelte-55qzhv:nth-child(29){left:94.4%;top:13.8%;height:62%;width:2.9%}.bar.svelte-55qzhv:nth-child(30){left:97.9%;top:13.8%;height:62%;width:1.7%;animation:svelte-55qzhv-opening-30 8s cubic-bezier(0.4, 0, 1, 1)}@keyframes svelte-55qzhv-opening-30{}.full-screen.svelte-55qzhv{position:fixed !important;left:0 !important;width:100vw !important}.full-screen.svelte-55qzhv:hover{content:none !important}",
  map: '{"version":3,"file":"Bar.svelte","sources":["Bar.svelte"],"sourcesContent":["<script>\\r\\n  import { onMount } from \\"svelte\\";\\r\\n\\r\\n  import { spring, tweened } from \\"svelte/motion\\";\\r\\n  import { cubicOut } from \\"svelte/easing\\";\\r\\n\\r\\n  let bar;\\r\\n  let shouldExpand = false;\\r\\n  const delay = [];\\r\\n\\r\\n  const initialLarge = [3, 28];\\r\\n  export let index;\\r\\n  export let offset;\\r\\n  let hovered = false;\\r\\n\\r\\n  const expand = (e) => {\\r\\n    shouldExpand = !shouldExpand;\\r\\n    hovered = false;\\r\\n  };\\r\\n\\r\\n  const progress = tweened(\\r\\n    { width: 100, left: 0, scale: 10 },\\r\\n\\r\\n    {\\r\\n      duration: 4000,\\r\\n      easing: cubicOut,\\r\\n    }\\r\\n  );\\r\\n  let alpha = tweened(0, {\\r\\n    duration: 4000,\\r\\n    easing: cubicOut,\\r\\n  });\\r\\n  onMount(() => {});\\r\\n  setTimeout(() => {\\r\\n    progress.set({\\r\\n      width: 2,\\r\\n      left: 6.9,\\r\\n      scale: 1,\\r\\n    });\\r\\n    offset.set({\\r\\n      rotate: 0,\\r\\n    });\\r\\n    alpha.set(1);\\r\\n  }, 1000);\\r\\n<\/script>\\r\\n\\r\\n<div\\r\\n  bind:this={bar}\\r\\n  class:sm={index !== 3 && index !== 4 && index !== 17 && index !== 30}\\r\\n  class:lg={index === 3 || index === 4 || index === 17 || index === 30}\\r\\n  style=\\"\\r\\n  {initialLarge.includes(index)\\r\\n    ? `transform:scale(${$progress.scale});`\\r\\n    : `transform:rotateX(${$offset.rotate}deg)`};\\r\\n  opacity:{!initialLarge.includes(index) ? $alpha : 1}; \\r\\n\\"\\r\\n  class:hovered\\r\\n  class:full-screen={shouldExpand}\\r\\n  class=\\"bar\\"\\r\\n  on:mouseenter={(e) => {\\r\\n    if (!shouldExpand) {\\r\\n      hovered = true;\\r\\n    }\\r\\n  }}\\r\\n  on:mouseleave={(e) => {\\r\\n    hovered = false;\\r\\n  }}\\r\\n  on:click={expand}\\r\\n/>\\r\\n\\r\\n<style lang=\\"scss\\">@keyframes openingSm {}\\n.sm {\\n  animation: openingSm 8s;\\n  animation-timing-function: cubic-bezier(0.5, 0.5, 1, 1);\\n}\\n\\n.hovered {\\n  transform: translateY(-20px) scale(1.3);\\n}\\n\\n.bar {\\n  z-index: 5;\\n  background-color: white;\\n  position: absolute;\\n  transition: cubic-bezier(0.075, 0.82, 0.165, 1) 1s;\\n}\\n.bar:nth-child(1) {\\n  left: 2%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1%;\\n}\\n.bar:nth-child(2) {\\n  left: 3.6%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 0.9%;\\n}\\n.bar:nth-child(3) {\\n  left: 6.9%;\\n  top: 13.9%;\\n  height: 62%;\\n  width: 2%;\\n}\\n.bar:nth-child(4) {\\n  left: 10.9%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 2.7%;\\n  animation: opening-4 8s cubic-bezier(0.4, 0, 1, 1);\\n}\\n@keyframes opening-4 {}\\n.bar:nth-child(5) {\\n  left: 14.3%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 2.7%;\\n  animation: opening-5 8s cubic-bezier(0.4, 0, 1, 1);\\n}\\n@keyframes opening-5 {}\\n.bar:nth-child(6) {\\n  left: 17.8%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.5%;\\n}\\n.bar:nth-child(7) {\\n  left: 20%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.1%;\\n}\\n.bar:nth-child(8) {\\n  left: 23.1%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.9%;\\n}\\n.bar:nth-child(9) {\\n  left: 25.7%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1%;\\n}\\n.bar:nth-child(10) {\\n  left: 28.8%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1%;\\n}\\n.bar:nth-child(11) {\\n  left: 32%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.9%;\\n}\\n.bar:nth-child(12) {\\n  left: 34.6%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 2.5%;\\n}\\n.bar:nth-child(13) {\\n  left: 46.6%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1%;\\n}\\n.bar:nth-child(14) {\\n  left: 49.8%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.9%;\\n}\\n.bar:nth-child(15) {\\n  left: 54%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 0.9%;\\n}\\n.bar:nth-child(16) {\\n  left: 55.6%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.8%;\\n}\\n.bar:nth-child(17) {\\n  left: 59.5%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.1%;\\n}\\n.bar:nth-child(18) {\\n  left: 61.3%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 2.5%;\\n  animation: opening-18 8s cubic-bezier(0.4, 0, 1, 1);\\n}\\n@keyframes opening-18 {}\\n.bar:nth-child(19) {\\n  left: 91.3%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.1%;\\n}\\n.bar:nth-child(20) {\\n  left: 64.5%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1%;\\n}\\n.bar:nth-child(21) {\\n  left: 66.4%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 0.9%;\\n}\\n.bar:nth-child(22) {\\n  left: 69.4%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.9%;\\n}\\n.bar:nth-child(23) {\\n  left: 73.5%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 0.9%;\\n}\\n.bar:nth-child(24) {\\n  left: 75.1%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 2.7%;\\n}\\n.bar:nth-child(25) {\\n  left: 79.9%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.7%;\\n}\\n.bar:nth-child(26) {\\n  left: 82.5%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 0.8%;\\n}\\n.bar:nth-child(27) {\\n  left: 85.5%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.2%;\\n}\\n.bar:nth-child(28) {\\n  left: 88.9%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.7%;\\n}\\n.bar:nth-child(29) {\\n  left: 94.4%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 2.9%;\\n}\\n.bar:nth-child(30) {\\n  left: 97.9%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.7%;\\n  animation: opening-30 8s cubic-bezier(0.4, 0, 1, 1);\\n}\\n@keyframes opening-30 {}\\n\\n.full-screen {\\n  position: fixed !important;\\n  left: 0 !important;\\n  width: 100vw !important;\\n}\\n.full-screen:hover {\\n  content: none !important;\\n}</style>\\r\\n"],"names":[],"mappings":"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"}'
};
const Bar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $progress, $$unsubscribe_progress;
  let $offset, $$unsubscribe_offset;
  let $alpha, $$unsubscribe_alpha;
  let bar;
  const initialLarge = [3, 28];
  let { index: index2 } = $$props;
  let { offset } = $$props;
  $$unsubscribe_offset = subscribe(offset, (value) => $offset = value);
  const progress = tweened({ width: 100, left: 0, scale: 10 }, { duration: 4e3, easing: cubicOut });
  $$unsubscribe_progress = subscribe(progress, (value) => $progress = value);
  let alpha = tweened(0, { duration: 4e3, easing: cubicOut });
  $$unsubscribe_alpha = subscribe(alpha, (value) => $alpha = value);
  setTimeout(() => {
    progress.set({ width: 2, left: 6.9, scale: 1 });
    offset.set({ rotate: 0 });
    alpha.set(1);
  }, 1e3);
  if ($$props.index === void 0 && $$bindings.index && index2 !== void 0)
    $$bindings.index(index2);
  if ($$props.offset === void 0 && $$bindings.offset && offset !== void 0)
    $$bindings.offset(offset);
  $$result.css.add(css$2);
  $$unsubscribe_progress();
  $$unsubscribe_offset();
  $$unsubscribe_alpha();
  return `<div style="${"" + escape(initialLarge.includes(index2) ? `transform:scale(${$progress.scale});` : `transform:rotateX(${$offset.rotate}deg)`) + "; opacity:" + escape(!initialLarge.includes(index2) ? $alpha : 1) + ";"}" class="${[
    "bar svelte-55qzhv",
    (index2 !== 3 && index2 !== 4 && index2 !== 17 && index2 !== 30 ? "sm" : "") + " " + (index2 === 3 || index2 === 4 || index2 === 17 || index2 === 30 ? "lg" : "") + "  "
  ].join(" ").trim()}"${add_attribute("this", bar, 0)}></div>`;
});
var global = "* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}";
var Logo_svelte_svelte_type_style_lang = ".bar-container.svelte-1f90e8a{top:0;z-index:1;position:relative;width:90%;height:400px}";
const css$1 = {
  code: ".bar-container.svelte-1f90e8a{top:0;z-index:1;position:relative;width:90%;height:400px}",
  map: '{"version":3,"file":"Logo.svelte","sources":["Logo.svelte"],"sourcesContent":["<script>\\r\\n  import { onDestroy, onMount } from \\"svelte\\";\\r\\n  import Bar from \\"../components/Bar.svelte\\";\\r\\n  import { spring, tweened } from \\"svelte/motion\\";\\r\\n  import { cubicOut } from \\"svelte/easing\\";\\r\\n  import \\"../global.scss\\";\\r\\n  import Logo from \\"../images/Logo.svelte\\";\\r\\n\\r\\n  let windowThreshHold = false;\\r\\n\\r\\n  onMount(() => {});\\r\\n  onDestroy(() => {});\\r\\n  const bars = Array.from(\\" \\".repeat(30));\\r\\n\\r\\n  const offset = [];\\r\\n  for (let i = 0; i < 30; i++) {\\r\\n    offset.push(\\r\\n      tweened(\\r\\n        { rotate: 80 },\\r\\n\\r\\n        {\\r\\n          delay: i * 100,\\r\\n          duration: 4000,\\r\\n          easing: cubicOut,\\r\\n        }\\r\\n      )\\r\\n    );\\r\\n  }\\r\\n  console.log(offset[0]);\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"bar-container\\">\\r\\n  {#each bars as bar, i}\\r\\n    <Bar index={i} offset={offset[i]} />\\r\\n  {/each}\\r\\n</div>\\r\\n\\r\\n<style lang=\\"scss\\">.bar-container {\\n  top: 0;\\n  z-index: 1;\\n  position: relative;\\n  width: 90%;\\n  height: 400px;\\n}</style>\\r\\n"],"names":[],"mappings":"AAqCmB,cAAc,eAAC,CAAC,AACjC,GAAG,CAAE,CAAC,CACN,OAAO,CAAE,CAAC,CACV,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,KAAK,AACf,CAAC"}'
};
const Logo_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  onDestroy(() => {
  });
  const bars = Array.from(" ".repeat(30));
  const offset = [];
  for (let i = 0; i < 30; i++) {
    offset.push(tweened({ rotate: 80 }, {
      delay: i * 100,
      duration: 4e3,
      easing: cubicOut
    }));
  }
  console.log(offset[0]);
  $$result.css.add(css$1);
  return `<div class="${"bar-container svelte-1f90e8a"}">${each(bars, (bar, i) => `${validate_component(Bar, "Bar").$$render($$result, { index: i, offset: offset[i] }, {}, {})}`)}
</div>`;
});
var Home_svelte_svelte_type_style_lang = ".container.svelte-1yziy4g{display:flex;justify-content:center;align-items:center;height:100vh;background-color:black;overflow:hidden}";
const css = {
  code: ".container.svelte-1yziy4g{display:flex;justify-content:center;align-items:center;height:100vh;background-color:black;overflow:hidden}",
  map: '{"version":3,"file":"Home.svelte","sources":["Home.svelte"],"sourcesContent":["<script>\\r\\n  import Logo from \\"../images/Logo.svelte\\";\\r\\n\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"container\\">\\r\\n  <Logo />\\r\\n</div>\\r\\n\\r\\n<style lang=\\"scss\\">.container {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  height: 100vh;\\n  background-color: black;\\n  overflow: hidden;\\n}</style>\\r\\n"],"names":[],"mappings":"AASmB,UAAU,eAAC,CAAC,AAC7B,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,MAAM,CAAE,KAAK,CACb,gBAAgB,CAAE,KAAK,CACvB,QAAQ,CAAE,MAAM,AAClB,CAAC"}'
};
const Home = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="${"container svelte-1yziy4g"}">${validate_component(Logo_1, "Logo").$$render($$result, {}, {}, {})}
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
