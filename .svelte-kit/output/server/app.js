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
  var names2 = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a2, b2) {
    return b2[1] - a2[1];
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
function escapeUnsafeChar(c2) {
  return escaped$1[c2] || c2;
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
function safe_not_equal$1(a2, b2) {
  return a2 != a2 ? b2 == b2 : a2 !== b2 || (a2 && typeof a2 === "object" || typeof a2 === "function");
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
  function update2(fn) {
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
  return { set, update: update2, subscribe: subscribe2 };
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
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a2, b2) {
  return a2 != a2 ? b2 == b2 : a2 !== b2 || (a2 && typeof a2 === "object" || typeof a2 === "function");
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
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb2) => requestAnimationFrame(cb2) : noop$1;
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
function tick() {
  schedule_update();
  return resolved_promise;
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
    for (let i = 0; i < dirty_components.length; i += 1) {
      const component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
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
      file: assets + "/_app/start-7c4f6e73.js",
      css: [assets + "/_app/assets/start-61d1577b.css"],
      js: [assets + "/_app/start-7c4f6e73.js", assets + "/_app/chunks/vendor-e483c085.js"]
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
const metadata_lookup = { ".svelte-kit/build/components/layout.svelte": { "entry": "layout.svelte-31ad3e30.js", "css": [], "js": ["layout.svelte-31ad3e30.js", "chunks/vendor-e483c085.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-b767072a.js", "css": [], "js": ["error.svelte-b767072a.js", "chunks/vendor-e483c085.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-65774d4b.js", "css": ["assets/pages/index.svelte-db301980.css"], "js": ["pages/index.svelte-65774d4b.js", "chunks/vendor-e483c085.js"], "styles": [] } };
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
var flushSync = /* @__PURE__ */ stepsOrder.reduce(function(acc, key) {
  acc[key] = function() {
    return steps[key].process(frame);
  };
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
var invariant = function() {
};
var clamp$1 = function(min, max, v) {
  return Math.min(Math.max(v, min), max);
};
var safeMin = 1e-3;
var minDuration = 0.01;
var maxDuration = 10;
var minDamping = 0.05;
var maxDamping = 1;
function findSpring(_a) {
  var _b = _a.duration, duration = _b === void 0 ? 800 : _b, _c = _a.bounce, bounce = _c === void 0 ? 0.25 : _c, _d = _a.velocity, velocity = _d === void 0 ? 0 : _d, _e = _a.mass, mass = _e === void 0 ? 1 : _e;
  var envelope;
  var derivative;
  var dampingRatio = 1 - bounce;
  dampingRatio = clamp$1(minDamping, maxDamping, dampingRatio);
  duration = clamp$1(minDuration, maxDuration, duration / 1e3);
  if (dampingRatio < 1) {
    envelope = function(undampedFreq2) {
      var exponentialDecay = undampedFreq2 * dampingRatio;
      var delta2 = exponentialDecay * duration;
      var a2 = exponentialDecay - velocity;
      var b2 = calcAngularFreq(undampedFreq2, dampingRatio);
      var c2 = Math.exp(-delta2);
      return safeMin - a2 / b2 * c2;
    };
    derivative = function(undampedFreq2) {
      var exponentialDecay = undampedFreq2 * dampingRatio;
      var delta2 = exponentialDecay * duration;
      var d = delta2 * velocity + velocity;
      var e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration;
      var f = Math.exp(-delta2);
      var g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
      var factor = -envelope(undampedFreq2) + safeMin > 0 ? -1 : 1;
      return factor * ((d - e) * f) / g;
    };
  } else {
    envelope = function(undampedFreq2) {
      var a2 = Math.exp(-undampedFreq2 * duration);
      var b2 = (undampedFreq2 - velocity) * duration + 1;
      return -safeMin + a2 * b2;
    };
    derivative = function(undampedFreq2) {
      var a2 = Math.exp(-undampedFreq2 * duration);
      var b2 = (velocity - undampedFreq2) * (duration * duration);
      return a2 * b2;
    };
  }
  var initialGuess = 5 / duration;
  var undampedFreq = approximateRoot(envelope, derivative, initialGuess);
  if (isNaN(undampedFreq)) {
    return {
      stiffness: 100,
      damping: 10
    };
  } else {
    var stiffness = Math.pow(undampedFreq, 2) * mass;
    return {
      stiffness,
      damping: dampingRatio * 2 * Math.sqrt(mass * stiffness)
    };
  }
}
var rootIterations = 12;
function approximateRoot(envelope, derivative, initialGuess) {
  var result = initialGuess;
  for (var i = 1; i < rootIterations; i++) {
    result = result - envelope(result) / derivative(result);
  }
  return result;
}
function calcAngularFreq(undampedFreq, dampingRatio) {
  return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}
var durationKeys = ["duration", "bounce"];
var physicsKeys = ["stiffness", "damping", "mass"];
function isSpringType(options2, keys) {
  return keys.some(function(key) {
    return options2[key] !== void 0;
  });
}
function getSpringOptions(options2) {
  var springOptions = __assign({ velocity: 0, stiffness: 100, damping: 10, mass: 1, isResolvedFromDuration: false }, options2);
  if (!isSpringType(options2, physicsKeys) && isSpringType(options2, durationKeys)) {
    var derived2 = findSpring(options2);
    springOptions = __assign(__assign(__assign({}, springOptions), derived2), { velocity: 0, mass: 1 });
    springOptions.isResolvedFromDuration = true;
  }
  return springOptions;
}
function spring(_a) {
  var _b = _a.from, from = _b === void 0 ? 0 : _b, _c = _a.to, to = _c === void 0 ? 1 : _c, _d = _a.restSpeed, restSpeed = _d === void 0 ? 2 : _d, restDelta = _a.restDelta, options2 = __rest(_a, ["from", "to", "restSpeed", "restDelta"]);
  var state = { done: false, value: from };
  var _e = getSpringOptions(options2), stiffness = _e.stiffness, damping = _e.damping, mass = _e.mass, velocity = _e.velocity, isResolvedFromDuration = _e.isResolvedFromDuration;
  var resolveSpring = zero;
  var resolveVelocity = zero;
  function createSpring() {
    var initialVelocity = velocity ? -(velocity / 1e3) : 0;
    var initialDelta = to - from;
    var dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
    var undampedAngularFreq = Math.sqrt(stiffness / mass) / 1e3;
    restDelta !== null && restDelta !== void 0 ? restDelta : restDelta = Math.abs(to - from) <= 1 ? 0.01 : 0.4;
    if (dampingRatio < 1) {
      var angularFreq_1 = calcAngularFreq(undampedAngularFreq, dampingRatio);
      resolveSpring = function(t) {
        var envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        return to - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq_1 * Math.sin(angularFreq_1 * t) + initialDelta * Math.cos(angularFreq_1 * t));
      };
      resolveVelocity = function(t) {
        var envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        return dampingRatio * undampedAngularFreq * envelope * (Math.sin(angularFreq_1 * t) * (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq_1 + initialDelta * Math.cos(angularFreq_1 * t)) - envelope * (Math.cos(angularFreq_1 * t) * (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) - angularFreq_1 * initialDelta * Math.sin(angularFreq_1 * t));
      };
    } else if (dampingRatio === 1) {
      resolveSpring = function(t) {
        return to - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
      };
    } else {
      var dampedAngularFreq_1 = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
      resolveSpring = function(t) {
        var envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        var freqForT = Math.min(dampedAngularFreq_1 * t, 300);
        return to - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq_1 * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq_1;
      };
    }
  }
  createSpring();
  return {
    next: function(t) {
      var current = resolveSpring(t);
      if (!isResolvedFromDuration) {
        var currentVelocity = resolveVelocity(t) * 1e3;
        var isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed;
        var isBelowDisplacementThreshold = Math.abs(to - current) <= restDelta;
        state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold;
      } else {
        state.done = t >= options2.duration;
      }
      state.value = state.done ? to : current;
      return state;
    },
    flipTarget: function() {
      var _a2;
      velocity = -velocity;
      _a2 = [to, from], from = _a2[0], to = _a2[1];
      createSpring();
    }
  };
}
spring.needsInterpolation = function(a2, b2) {
  return typeof a2 === "string" || typeof b2 === "string";
};
var zero = function(_t) {
  return 0;
};
var progress = function(from, to, value) {
  var toFromDifference = to - from;
  return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
};
var mix = function(from, to, progress2) {
  return -progress2 * from + progress2 * to + from;
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
    var _b = v.match(floatRegex), a2 = _b[0], b2 = _b[1], c2 = _b[2], alpha2 = _b[3];
    return _a = {}, _a[aName] = parseFloat(a2), _a[bName] = parseFloat(b2), _a[cName] = parseFloat(c2), _a.alpha = alpha2 !== void 0 ? parseFloat(alpha2) : 1, _a;
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
  var b2 = "";
  var a2 = "";
  if (v.length > 5) {
    r = v.substr(1, 2);
    g = v.substr(3, 2);
    b2 = v.substr(5, 2);
    a2 = v.substr(7, 2);
  } else {
    r = v.substr(1, 1);
    g = v.substr(2, 1);
    b2 = v.substr(3, 1);
    a2 = v.substr(4, 1);
    r += r;
    g += g;
    b2 += b2;
    a2 += a2;
  }
  return {
    red: parseInt(r, 16),
    green: parseInt(g, 16),
    blue: parseInt(b2, 16),
    alpha: a2 ? parseInt(a2, 16) / 255 : 1
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
function analyse$1(v) {
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
  return analyse$1(v).values;
}
function createTransformer(v) {
  var _a = analyse$1(v), values = _a.values, numColors = _a.numColors, tokenised = _a.tokenised;
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
var mixLinearColor = function(from, to, v) {
  var fromExpo = from * from;
  var toExpo = to * to;
  return Math.sqrt(Math.max(0, v * (toExpo - fromExpo) + fromExpo));
};
var colorTypes = [hex, rgba, hsla];
var getColorType = function(v) {
  return colorTypes.find(function(type) {
    return type.test(v);
  });
};
var mixColor = function(from, to) {
  var fromColorType = getColorType(from);
  var toColorType = getColorType(to);
  invariant(fromColorType.transform === toColorType.transform);
  var fromColor = fromColorType.parse(from);
  var toColor = toColorType.parse(to);
  var blended = __assign({}, fromColor);
  var mixFunc = fromColorType === hsla ? mix : mixLinearColor;
  return function(v) {
    for (var key in blended) {
      if (key !== "alpha") {
        blended[key] = mixFunc(fromColor[key], toColor[key], v);
      }
    }
    blended.alpha = mix(fromColor.alpha, toColor.alpha, v);
    return fromColorType.transform(blended);
  };
};
var isNum = function(v) {
  return typeof v === "number";
};
var combineFunctions = function(a2, b2) {
  return function(v) {
    return b2(a2(v));
  };
};
var pipe = function() {
  var transformers = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    transformers[_i] = arguments[_i];
  }
  return transformers.reduce(combineFunctions);
};
function getMixer(origin, target) {
  if (isNum(origin)) {
    return function(v) {
      return mix(origin, target, v);
    };
  } else if (color.test(origin)) {
    return mixColor(origin, target);
  } else {
    return mixComplex(origin, target);
  }
}
var mixArray = function(from, to) {
  var output = __spreadArray([], from);
  var numValues = output.length;
  var blendValue = from.map(function(fromThis, i) {
    return getMixer(fromThis, to[i]);
  });
  return function(v) {
    for (var i = 0; i < numValues; i++) {
      output[i] = blendValue[i](v);
    }
    return output;
  };
};
var mixObject = function(origin, target) {
  var output = __assign(__assign({}, origin), target);
  var blendValue = {};
  for (var key in output) {
    if (origin[key] !== void 0 && target[key] !== void 0) {
      blendValue[key] = getMixer(origin[key], target[key]);
    }
  }
  return function(v) {
    for (var key2 in blendValue) {
      output[key2] = blendValue[key2](v);
    }
    return output;
  };
};
function analyse(value) {
  var parsed = complex.parse(value);
  var numValues = parsed.length;
  var numNumbers = 0;
  var numRGB = 0;
  var numHSL = 0;
  for (var i = 0; i < numValues; i++) {
    if (numNumbers || typeof parsed[i] === "number") {
      numNumbers++;
    } else {
      if (parsed[i].hue !== void 0) {
        numHSL++;
      } else {
        numRGB++;
      }
    }
  }
  return { parsed, numNumbers, numRGB, numHSL };
}
var mixComplex = function(origin, target) {
  var template2 = complex.createTransformer(target);
  var originStats = analyse(origin);
  var targetStats = analyse(target);
  return pipe(mixArray(originStats.parsed, targetStats.parsed), template2);
};
var mixNumber = function(from, to) {
  return function(p) {
    return mix(from, to, p);
  };
};
function detectMixerFactory(v) {
  if (typeof v === "number") {
    return mixNumber;
  } else if (typeof v === "string") {
    if (color.test(v)) {
      return mixColor;
    } else {
      return mixComplex;
    }
  } else if (Array.isArray(v)) {
    return mixArray;
  } else if (typeof v === "object") {
    return mixObject;
  }
}
function createMixers(output, ease, customMixer) {
  var mixers = [];
  var mixerFactory = customMixer || detectMixerFactory(output[0]);
  var numMixers = output.length - 1;
  for (var i = 0; i < numMixers; i++) {
    var mixer = mixerFactory(output[i], output[i + 1]);
    if (ease) {
      var easingFunction = Array.isArray(ease) ? ease[i] : ease;
      mixer = pipe(easingFunction, mixer);
    }
    mixers.push(mixer);
  }
  return mixers;
}
function fastInterpolate(_a, _b) {
  var from = _a[0], to = _a[1];
  var mixer = _b[0];
  return function(v) {
    return mixer(progress(from, to, v));
  };
}
function slowInterpolate(input, mixers) {
  var inputLength = input.length;
  var lastInputIndex = inputLength - 1;
  return function(v) {
    var mixerIndex = 0;
    var foundMixerIndex = false;
    if (v <= input[0]) {
      foundMixerIndex = true;
    } else if (v >= input[lastInputIndex]) {
      mixerIndex = lastInputIndex - 1;
      foundMixerIndex = true;
    }
    if (!foundMixerIndex) {
      var i = 1;
      for (; i < inputLength; i++) {
        if (input[i] > v || i === lastInputIndex) {
          break;
        }
      }
      mixerIndex = i - 1;
    }
    var progressInRange = progress(input[mixerIndex], input[mixerIndex + 1], v);
    return mixers[mixerIndex](progressInRange);
  };
}
function interpolate(input, output, _a) {
  var _b = _a === void 0 ? {} : _a, _c = _b.clamp, isClamp = _c === void 0 ? true : _c, ease = _b.ease, mixer = _b.mixer;
  var inputLength = input.length;
  invariant(inputLength === output.length);
  invariant(!ease || !Array.isArray(ease) || ease.length === inputLength - 1);
  if (input[0] > input[inputLength - 1]) {
    input = [].concat(input);
    output = [].concat(output);
    input.reverse();
    output.reverse();
  }
  var mixers = createMixers(output, ease, mixer);
  var interpolator = inputLength === 2 ? fastInterpolate(input, mixers) : slowInterpolate(input, mixers);
  return isClamp ? function(v) {
    return interpolator(clamp$1(input[0], input[inputLength - 1], v));
  } : interpolator;
}
var reverseEasing = function(easing) {
  return function(p) {
    return 1 - easing(1 - p);
  };
};
var mirrorEasing = function(easing) {
  return function(p) {
    return p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
  };
};
var createExpoIn = function(power) {
  return function(p) {
    return Math.pow(p, power);
  };
};
var createBackIn = function(power) {
  return function(p) {
    return p * p * ((power + 1) * p - power);
  };
};
var createAnticipate = function(power) {
  var backEasing = createBackIn(power);
  return function(p) {
    return (p *= 2) < 1 ? 0.5 * backEasing(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
  };
};
var DEFAULT_OVERSHOOT_STRENGTH = 1.525;
var BOUNCE_FIRST_THRESHOLD = 4 / 11;
var BOUNCE_SECOND_THRESHOLD = 8 / 11;
var BOUNCE_THIRD_THRESHOLD = 9 / 10;
var linear = function(p) {
  return p;
};
var easeIn = createExpoIn(2);
var easeOut = reverseEasing(easeIn);
var easeInOut = mirrorEasing(easeIn);
var circIn = function(p) {
  return 1 - Math.sin(Math.acos(p));
};
var circOut = reverseEasing(circIn);
var circInOut = mirrorEasing(circOut);
var backIn = createBackIn(DEFAULT_OVERSHOOT_STRENGTH);
var backOut = reverseEasing(backIn);
var backInOut = mirrorEasing(backIn);
var anticipate = createAnticipate(DEFAULT_OVERSHOOT_STRENGTH);
var ca = 4356 / 361;
var cb = 35442 / 1805;
var cc = 16061 / 1805;
var bounceOut = function(p) {
  if (p === 1 || p === 0)
    return p;
  var p2 = p * p;
  return p < BOUNCE_FIRST_THRESHOLD ? 7.5625 * p2 : p < BOUNCE_SECOND_THRESHOLD ? 9.075 * p2 - 9.9 * p + 3.4 : p < BOUNCE_THIRD_THRESHOLD ? ca * p2 - cb * p + cc : 10.8 * p * p - 20.52 * p + 10.72;
};
var bounceIn = reverseEasing(bounceOut);
var bounceInOut = function(p) {
  return p < 0.5 ? 0.5 * (1 - bounceOut(1 - p * 2)) : 0.5 * bounceOut(p * 2 - 1) + 0.5;
};
function defaultEasing(values, easing) {
  return values.map(function() {
    return easing || easeInOut;
  }).splice(0, values.length - 1);
}
function defaultOffset(values) {
  var numValues = values.length;
  return values.map(function(_value, i) {
    return i !== 0 ? i / (numValues - 1) : 0;
  });
}
function convertOffsetToTimes(offset, duration) {
  return offset.map(function(o) {
    return o * duration;
  });
}
function keyframes$1(_a) {
  var _b = _a.from, from = _b === void 0 ? 0 : _b, _c = _a.to, to = _c === void 0 ? 1 : _c, ease = _a.ease, offset = _a.offset, _d = _a.duration, duration = _d === void 0 ? 300 : _d;
  var state = { done: false, value: from };
  var values = Array.isArray(to) ? to : [from, to];
  var times = convertOffsetToTimes(offset && offset.length === values.length ? offset : defaultOffset(values), duration);
  function createInterpolator() {
    return interpolate(times, values, {
      ease: Array.isArray(ease) ? ease : defaultEasing(values, ease)
    });
  }
  var interpolator = createInterpolator();
  return {
    next: function(t) {
      state.value = interpolator(t);
      state.done = t >= duration;
      return state;
    },
    flipTarget: function() {
      values.reverse();
      interpolator = createInterpolator();
    }
  };
}
function decay(_a) {
  var _b = _a.velocity, velocity = _b === void 0 ? 0 : _b, _c = _a.from, from = _c === void 0 ? 0 : _c, _d = _a.power, power = _d === void 0 ? 0.8 : _d, _e = _a.timeConstant, timeConstant = _e === void 0 ? 350 : _e, _f = _a.restDelta, restDelta = _f === void 0 ? 0.5 : _f, modifyTarget = _a.modifyTarget;
  var state = { done: false, value: from };
  var amplitude = power * velocity;
  var ideal = from + amplitude;
  var target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
  if (target !== ideal)
    amplitude = target - from;
  return {
    next: function(t) {
      var delta2 = -amplitude * Math.exp(-t / timeConstant);
      state.done = !(delta2 > restDelta || delta2 < -restDelta);
      state.value = state.done ? target : target + delta2;
      return state;
    },
    flipTarget: function() {
    }
  };
}
var types = { keyframes: keyframes$1, spring, decay };
function detectAnimationFromOptions(config) {
  if (Array.isArray(config.to)) {
    return keyframes$1;
  } else if (types[config.type]) {
    return types[config.type];
  }
  var keys = new Set(Object.keys(config));
  if (keys.has("ease") || keys.has("duration") && !keys.has("dampingRatio")) {
    return keyframes$1;
  } else if (keys.has("dampingRatio") || keys.has("stiffness") || keys.has("mass") || keys.has("damping") || keys.has("restSpeed") || keys.has("restDelta")) {
    return spring;
  }
  return keyframes$1;
}
function loopElapsed(elapsed, duration, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  return elapsed - duration - delay;
}
function reverseElapsed(elapsed, duration, delay, isForwardPlayback) {
  if (delay === void 0) {
    delay = 0;
  }
  if (isForwardPlayback === void 0) {
    isForwardPlayback = true;
  }
  return isForwardPlayback ? loopElapsed(duration + -elapsed, duration, delay) : duration - (elapsed - duration) + delay;
}
function hasRepeatDelayElapsed(elapsed, duration, delay, isForwardPlayback) {
  return isForwardPlayback ? elapsed >= duration + delay : elapsed <= -delay;
}
var framesync = function(update2) {
  var passTimestamp = function(_a) {
    var delta2 = _a.delta;
    return update2(delta2);
  };
  return {
    start: function() {
      return sync.update(passTimestamp, true);
    },
    stop: function() {
      return cancelSync.update(passTimestamp);
    }
  };
};
function animate(_a) {
  var _b, _c;
  var from = _a.from, _d = _a.autoplay, autoplay = _d === void 0 ? true : _d, _e = _a.driver, driver = _e === void 0 ? framesync : _e, _f = _a.elapsed, elapsed = _f === void 0 ? 0 : _f, _g = _a.repeat, repeatMax = _g === void 0 ? 0 : _g, _h = _a.repeatType, repeatType = _h === void 0 ? "loop" : _h, _j = _a.repeatDelay, repeatDelay = _j === void 0 ? 0 : _j, onPlay = _a.onPlay, onStop = _a.onStop, onComplete = _a.onComplete, onRepeat = _a.onRepeat, onUpdate = _a.onUpdate, options2 = __rest(_a, ["from", "autoplay", "driver", "elapsed", "repeat", "repeatType", "repeatDelay", "onPlay", "onStop", "onComplete", "onRepeat", "onUpdate"]);
  var to = options2.to;
  var driverControls;
  var repeatCount = 0;
  var computedDuration = options2.duration;
  var latest;
  var isComplete = false;
  var isForwardPlayback = true;
  var interpolateFromNumber;
  var animator = detectAnimationFromOptions(options2);
  if ((_c = (_b = animator).needsInterpolation) === null || _c === void 0 ? void 0 : _c.call(_b, from, to)) {
    interpolateFromNumber = interpolate([0, 100], [from, to], {
      clamp: false
    });
    from = 0;
    to = 100;
  }
  var animation = animator(__assign(__assign({}, options2), { from, to }));
  function repeat() {
    repeatCount++;
    if (repeatType === "reverse") {
      isForwardPlayback = repeatCount % 2 === 0;
      elapsed = reverseElapsed(elapsed, computedDuration, repeatDelay, isForwardPlayback);
    } else {
      elapsed = loopElapsed(elapsed, computedDuration, repeatDelay);
      if (repeatType === "mirror")
        animation.flipTarget();
    }
    isComplete = false;
    onRepeat && onRepeat();
  }
  function complete() {
    driverControls.stop();
    onComplete && onComplete();
  }
  function update2(delta2) {
    if (!isForwardPlayback)
      delta2 = -delta2;
    elapsed += delta2;
    if (!isComplete) {
      var state = animation.next(Math.max(0, elapsed));
      latest = state.value;
      if (interpolateFromNumber)
        latest = interpolateFromNumber(latest);
      isComplete = isForwardPlayback ? state.done : elapsed <= 0;
    }
    onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(latest);
    if (isComplete) {
      if (repeatCount === 0)
        computedDuration !== null && computedDuration !== void 0 ? computedDuration : computedDuration = elapsed;
      if (repeatCount < repeatMax) {
        hasRepeatDelayElapsed(elapsed, computedDuration, repeatDelay, isForwardPlayback) && repeat();
      } else {
        complete();
      }
    }
  }
  function play() {
    onPlay === null || onPlay === void 0 ? void 0 : onPlay();
    driverControls = driver(update2);
    driverControls.start();
  }
  autoplay && play();
  return {
    stop: function() {
      onStop === null || onStop === void 0 ? void 0 : onStop();
      driverControls.stop();
    }
  };
}
function velocityPerSecond(velocity, frameDuration) {
  return frameDuration ? velocity * (1e3 / frameDuration) : 0;
}
function inertia(_a) {
  var _b = _a.from, from = _b === void 0 ? 0 : _b, _c = _a.velocity, velocity = _c === void 0 ? 0 : _c, min = _a.min, max = _a.max, _d = _a.power, power = _d === void 0 ? 0.8 : _d, _e = _a.timeConstant, timeConstant = _e === void 0 ? 750 : _e, _f = _a.bounceStiffness, bounceStiffness = _f === void 0 ? 500 : _f, _g = _a.bounceDamping, bounceDamping = _g === void 0 ? 10 : _g, _h = _a.restDelta, restDelta = _h === void 0 ? 1 : _h, modifyTarget = _a.modifyTarget, driver = _a.driver, onUpdate = _a.onUpdate, onComplete = _a.onComplete;
  var currentAnimation;
  function isOutOfBounds(v) {
    return min !== void 0 && v < min || max !== void 0 && v > max;
  }
  function boundaryNearest(v) {
    if (min === void 0)
      return max;
    if (max === void 0)
      return min;
    return Math.abs(min - v) < Math.abs(max - v) ? min : max;
  }
  function startAnimation2(options2) {
    currentAnimation === null || currentAnimation === void 0 ? void 0 : currentAnimation.stop();
    currentAnimation = animate(__assign(__assign({}, options2), { driver, onUpdate: function(v) {
      var _a2;
      onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(v);
      (_a2 = options2.onUpdate) === null || _a2 === void 0 ? void 0 : _a2.call(options2, v);
    }, onComplete }));
  }
  function startSpring(options2) {
    startAnimation2(__assign({ type: "spring", stiffness: bounceStiffness, damping: bounceDamping, restDelta }, options2));
  }
  if (isOutOfBounds(from)) {
    startSpring({ from, velocity, to: boundaryNearest(from) });
  } else {
    var target = power * velocity + from;
    if (typeof modifyTarget !== "undefined")
      target = modifyTarget(target);
    var boundary_1 = boundaryNearest(target);
    var heading_1 = boundary_1 === min ? -1 : 1;
    var prev_1;
    var current_1;
    var checkBoundary = function(v) {
      prev_1 = current_1;
      current_1 = v;
      velocity = velocityPerSecond(v - prev_1, getFrameData().delta);
      if (heading_1 === 1 && v > boundary_1 || heading_1 === -1 && v < boundary_1) {
        startSpring({ from: v, to: boundary_1, velocity });
      }
    };
    startAnimation2({
      type: "decay",
      from,
      velocity,
      timeConstant,
      power,
      restDelta,
      modifyTarget,
      onUpdate: isOutOfBounds(target) ? checkBoundary : void 0
    });
  }
  return {
    stop: function() {
      return currentAnimation === null || currentAnimation === void 0 ? void 0 : currentAnimation.stop();
    }
  };
}
var isPoint = function(point) {
  return point.hasOwnProperty("x") && point.hasOwnProperty("y");
};
var isPoint3D = function(point) {
  return isPoint(point) && point.hasOwnProperty("z");
};
var distance1D = function(a2, b2) {
  return Math.abs(a2 - b2);
};
function distance(a2, b2) {
  if (isNum(a2) && isNum(b2)) {
    return distance1D(a2, b2);
  } else if (isPoint(a2) && isPoint(b2)) {
    var xDelta = distance1D(a2.x, b2.x);
    var yDelta = distance1D(a2.y, b2.y);
    var zDelta = isPoint3D(a2) && isPoint3D(b2) ? distance1D(a2.z, b2.z) : 0;
    return Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2) + Math.pow(zDelta, 2));
  }
}
var a = function(a1, a2) {
  return 1 - 3 * a2 + 3 * a1;
};
var b = function(a1, a2) {
  return 3 * a2 - 6 * a1;
};
var c = function(a1) {
  return 3 * a1;
};
var calcBezier = function(t, a1, a2) {
  return ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;
};
var getSlope = function(t, a1, a2) {
  return 3 * a(a1, a2) * t * t + 2 * b(a1, a2) * t + c(a1);
};
var subdivisionPrecision = 1e-7;
var subdivisionMaxIterations = 10;
function binarySubdivide(aX, aA, aB, mX1, mX2) {
  var currentX;
  var currentT;
  var i = 0;
  do {
    currentT = aA + (aB - aA) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
  return currentT;
}
var newtonIterations = 8;
var newtonMinSlope = 1e-3;
function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
  for (var i = 0; i < newtonIterations; ++i) {
    var currentSlope = getSlope(aGuessT, mX1, mX2);
    if (currentSlope === 0) {
      return aGuessT;
    }
    var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }
  return aGuessT;
}
var kSplineTableSize = 11;
var kSampleStepSize = 1 / (kSplineTableSize - 1);
function cubicBezier(mX1, mY1, mX2, mY2) {
  if (mX1 === mY1 && mX2 === mY2)
    return linear;
  var sampleValues = new Float32Array(kSplineTableSize);
  for (var i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }
  function getTForX(aX) {
    var intervalStart = 0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;
    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;
    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;
    var initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= newtonMinSlope) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }
  return function(t) {
    return t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
  };
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
  SubscriptionManager2.prototype.notify = function(a2, b2, c2) {
    var numSubscriptions = this.subscriptions.length;
    if (!numSubscriptions)
      return;
    if (numSubscriptions === 1) {
      this.subscriptions[0](a2, b2, c2);
    } else {
      for (var i = 0; i < numSubscriptions; i++) {
        var handler = this.subscriptions[i];
        handler && handler(a2, b2, c2);
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
  function update2(fn) {
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
  return { set, update: update2, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  const auto2 = fn.length < 2;
  return readable(initial_value, (set) => {
    let inited = false;
    const values = [];
    let pending = 0;
    let cleanup = noop$1;
    const sync2 = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set);
      if (auto2) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop$1;
      }
    };
    const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
      values[i] = value;
      pending &= ~(1 << i);
      if (inited) {
        sync2();
      }
    }, () => {
      pending |= 1 << i;
    }));
    inited = true;
    sync2();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
    };
  });
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
var MotionConfigContext = (c2) => getDomContext("MotionConfig", c2) || writable({
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
var secondsToMilliseconds = function(seconds) {
  return seconds * 1e3;
};
var easingLookup = {
  linear,
  easeIn,
  easeInOut,
  easeOut,
  circIn,
  circInOut,
  circOut,
  backIn,
  backInOut,
  backOut,
  anticipate,
  bounceIn,
  bounceInOut,
  bounceOut
};
var easingDefinitionToFunction = function(definition) {
  if (Array.isArray(definition)) {
    var _a = __read(definition, 4), x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
    return cubicBezier(x1, y1, x2, y2);
  } else if (typeof definition === "string") {
    return easingLookup[definition];
  }
  return definition;
};
var isEasingArray = function(ease) {
  return Array.isArray(ease) && typeof ease[0] !== "number";
};
var isAnimatable = function(key, value) {
  if (key === "zIndex")
    return false;
  if (typeof value === "number" || Array.isArray(value))
    return true;
  if (typeof value === "string" && complex.test(value) && !value.startsWith("url(")) {
    return true;
  }
  return false;
};
var isKeyframesTarget = function(v) {
  return Array.isArray(v);
};
var underDampedSpring = function() {
  return {
    type: "spring",
    stiffness: 500,
    damping: 25,
    restDelta: 0.5,
    restSpeed: 10
  };
};
var criticallyDampedSpring = function(to) {
  return {
    type: "spring",
    stiffness: 550,
    damping: to === 0 ? 2 * Math.sqrt(550) : 30,
    restDelta: 0.01,
    restSpeed: 10
  };
};
var linearTween = function() {
  return {
    type: "keyframes",
    ease: "linear",
    duration: 0.3
  };
};
var keyframes = function(values) {
  return {
    type: "keyframes",
    duration: 0.8,
    values
  };
};
var defaultTransitions = {
  x: underDampedSpring,
  y: underDampedSpring,
  z: underDampedSpring,
  rotate: underDampedSpring,
  rotateX: underDampedSpring,
  rotateY: underDampedSpring,
  rotateZ: underDampedSpring,
  scaleX: criticallyDampedSpring,
  scaleY: criticallyDampedSpring,
  scale: criticallyDampedSpring,
  opacity: linearTween,
  backgroundColor: linearTween,
  color: linearTween,
  default: criticallyDampedSpring
};
var getDefaultTransition = function(valueKey, to) {
  var transitionFactory;
  if (isKeyframesTarget(to)) {
    transitionFactory = keyframes;
  } else {
    transitionFactory = defaultTransitions[valueKey] || defaultTransitions.default;
  }
  return __assign({ to }, transitionFactory(to));
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
function isTransitionDefined(_a) {
  _a.when;
  _a.delay;
  _a.delayChildren;
  _a.staggerChildren;
  _a.staggerDirection;
  _a.repeat;
  _a.repeatType;
  _a.repeatDelay;
  _a.from;
  var transition = __rest(_a, ["when", "delay", "delayChildren", "staggerChildren", "staggerDirection", "repeat", "repeatType", "repeatDelay", "from"]);
  return !!Object.keys(transition).length;
}
function convertTransitionToAnimationOptions(_a) {
  var ease = _a.ease, times = _a.times, yoyo = _a.yoyo, flip = _a.flip, loop2 = _a.loop, transition = __rest(_a, ["ease", "times", "yoyo", "flip", "loop"]);
  var options2 = __assign({}, transition);
  if (times)
    options2["offset"] = times;
  if (transition.duration)
    options2["duration"] = secondsToMilliseconds(transition.duration);
  if (transition.repeatDelay)
    options2.repeatDelay = secondsToMilliseconds(transition.repeatDelay);
  if (ease) {
    options2["ease"] = isEasingArray(ease) ? ease.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease);
  }
  if (transition.type === "tween")
    options2.type = "keyframes";
  if (yoyo || loop2 || flip) {
    if (yoyo) {
      options2.repeatType = "reverse";
    } else if (loop2) {
      options2.repeatType = "loop";
    } else if (flip) {
      options2.repeatType = "mirror";
    }
    options2.repeat = loop2 || yoyo || flip || transition.repeat;
  }
  if (transition.type !== "spring")
    options2.type = "keyframes";
  return options2;
}
function getDelayFromTransition(transition, key) {
  var _a;
  var valueTransition = getValueTransition(transition, key) || {};
  return (_a = valueTransition.delay) !== null && _a !== void 0 ? _a : 0;
}
function hydrateKeyframes(options2) {
  if (Array.isArray(options2.to) && options2.to[0] === null) {
    options2.to = __spreadArray([], __read(options2.to));
    options2.to[0] = options2.from;
  }
  return options2;
}
function getPopmotionAnimationOptions(transition, options2, key) {
  var _a;
  if (Array.isArray(options2.to)) {
    (_a = transition.duration) !== null && _a !== void 0 ? _a : transition.duration = 0.8;
  }
  hydrateKeyframes(options2);
  if (!isTransitionDefined(transition)) {
    transition = __assign(__assign({}, transition), getDefaultTransition(key, options2.to));
  }
  return __assign(__assign({}, options2), convertTransitionToAnimationOptions(transition));
}
function getAnimation(key, value, target, transition, onComplete) {
  var _a;
  var valueTransition = getValueTransition(transition, key);
  var origin = (_a = valueTransition.from) !== null && _a !== void 0 ? _a : value.get();
  var isTargetAnimatable = isAnimatable(key, target);
  if (origin === "none" && isTargetAnimatable && typeof target === "string") {
    origin = getAnimatableNone(key, target);
  } else if (isZero(origin) && typeof target === "string") {
    origin = getZeroUnit(target);
  } else if (!Array.isArray(target) && isZero(target) && typeof origin === "string") {
    target = getZeroUnit(origin);
  }
  var isOriginAnimatable = isAnimatable(key, origin);
  function start() {
    var options2 = {
      from: origin,
      to: target,
      velocity: value.getVelocity(),
      onComplete,
      onUpdate: function(v) {
        return value.set(v);
      }
    };
    return valueTransition.type === "inertia" || valueTransition.type === "decay" ? inertia(__assign(__assign({}, options2), valueTransition)) : animate(__assign(__assign({}, getPopmotionAnimationOptions(valueTransition, options2, key)), { onUpdate: function(v) {
      var _a2;
      options2.onUpdate(v);
      (_a2 = valueTransition.onUpdate) === null || _a2 === void 0 ? void 0 : _a2.call(valueTransition, v);
    }, onComplete: function() {
      var _a2;
      options2.onComplete();
      (_a2 = valueTransition.onComplete) === null || _a2 === void 0 ? void 0 : _a2.call(valueTransition);
    } }));
  }
  function set() {
    var _a2;
    value.set(target);
    onComplete();
    (_a2 = valueTransition === null || valueTransition === void 0 ? void 0 : valueTransition.onComplete) === null || _a2 === void 0 ? void 0 : _a2.call(valueTransition);
    return { stop: function() {
    } };
  }
  return !isOriginAnimatable || !isTargetAnimatable || valueTransition.type === false ? set : start;
}
function isZero(value) {
  return value === 0 || typeof value === "string" && parseFloat(value) === 0 && value.indexOf(" ") === -1;
}
function getZeroUnit(potentialUnitType) {
  return typeof potentialUnitType === "number" ? 0 : getAnimatableNone("", potentialUnitType);
}
function getValueTransition(transition, key) {
  return transition[key] || transition["default"] || transition;
}
function startAnimation(key, value, target, transition) {
  if (transition === void 0) {
    transition = {};
  }
  return value.start(function(onComplete) {
    var delayTimer;
    var controls;
    var animation = getAnimation(key, value, target, transition, onComplete);
    var delay = getDelayFromTransition(transition, key);
    var start = function() {
      return controls = animation();
    };
    if (delay) {
      delayTimer = setTimeout(start, secondsToMilliseconds(delay));
    } else {
      start();
    }
    return function() {
      clearTimeout(delayTimer);
      controls === null || controls === void 0 ? void 0 : controls.stop();
    };
  });
}
var isNumericalString = function(v) {
  return /^\-?\d*\.?\d+$/.test(v);
};
var isCustomValue = function(v) {
  return Boolean(v && typeof v === "object" && v.mix && v.toValue);
};
var resolveFinalValueInKeyframes = function(v) {
  return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
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
function getCurrent(visualElement2) {
  var current = {};
  visualElement2.forEachValue(function(value, key) {
    return current[key] = value.get();
  });
  return current;
}
function getVelocity$1(visualElement2) {
  var velocity = {};
  visualElement2.forEachValue(function(value, key) {
    return velocity[key] = value.getVelocity();
  });
  return velocity;
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
function resolveVariant(visualElement2, definition, custom) {
  var props = visualElement2.getProps();
  return resolveVariantFromProps(props, definition, custom !== null && custom !== void 0 ? custom : props.custom, getCurrent(visualElement2), getVelocity$1(visualElement2));
}
function checkIfControllingVariants(props) {
  var _a;
  return typeof ((_a = props.animate) === null || _a === void 0 ? void 0 : _a.start) === "function" || isVariantLabel(props.initial) || isVariantLabel(props.animate) || isVariantLabel(props.whileHover) || isVariantLabel(props.whileDrag) || isVariantLabel(props.whileTap) || isVariantLabel(props.whileFocus) || isVariantLabel(props.exit);
}
function checkIfVariantNode(props) {
  return Boolean(checkIfControllingVariants(props) || props.variants);
}
function setMotionValue(visualElement2, key, value) {
  if (visualElement2.hasValue(key)) {
    visualElement2.getValue(key).set(value);
  } else {
    visualElement2.addValue(key, motionValue(value));
  }
}
function setTarget(visualElement2, definition) {
  var resolved = resolveVariant(visualElement2, definition);
  var _a = resolved ? visualElement2.makeTargetAnimatable(resolved, false) : {}, _b = _a.transitionEnd, transitionEnd = _b === void 0 ? {} : _b;
  _a.transition;
  var target = __rest(_a, ["transitionEnd", "transition"]);
  target = __assign(__assign({}, target), transitionEnd);
  for (var key in target) {
    var value = resolveFinalValueInKeyframes(target[key]);
    setMotionValue(visualElement2, key, value);
  }
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
function animateVisualElement(visualElement2, definition, options2) {
  if (options2 === void 0) {
    options2 = {};
  }
  visualElement2.notifyAnimationStart();
  var animation;
  if (Array.isArray(definition)) {
    var animations2 = definition.map(function(variant) {
      return animateVariant(visualElement2, variant, options2);
    });
    animation = Promise.all(animations2);
  } else if (typeof definition === "string") {
    animation = animateVariant(visualElement2, definition, options2);
  } else {
    var resolvedDefinition = typeof definition === "function" ? resolveVariant(visualElement2, definition, options2.custom) : definition;
    animation = animateTarget(visualElement2, resolvedDefinition, options2);
  }
  return animation.then(function() {
    return visualElement2.notifyAnimationComplete(definition);
  });
}
function animateVariant(visualElement2, variant, options2) {
  var _a;
  if (options2 === void 0) {
    options2 = {};
  }
  var resolved = resolveVariant(visualElement2, variant, options2.custom);
  var _b = (resolved || {}).transition, transition = _b === void 0 ? visualElement2.getDefaultTransition() || {} : _b;
  if (options2.transitionOverride) {
    transition = options2.transitionOverride;
  }
  var getAnimation2 = resolved ? function() {
    return animateTarget(visualElement2, resolved, options2);
  } : function() {
    return Promise.resolve();
  };
  var getChildAnimations = ((_a = visualElement2.variantChildren) === null || _a === void 0 ? void 0 : _a.size) ? function(forwardDelay) {
    if (forwardDelay === void 0) {
      forwardDelay = 0;
    }
    var _a2 = transition.delayChildren, delayChildren = _a2 === void 0 ? 0 : _a2, staggerChildren = transition.staggerChildren, staggerDirection = transition.staggerDirection;
    return animateChildren(visualElement2, variant, delayChildren + forwardDelay, staggerChildren, staggerDirection, options2);
  } : function() {
    return Promise.resolve();
  };
  var when = transition.when;
  if (when) {
    var _c = __read(when === "beforeChildren" ? [getAnimation2, getChildAnimations] : [getChildAnimations, getAnimation2], 2), first = _c[0], last = _c[1];
    return first().then(last);
  } else {
    return Promise.all([getAnimation2(), getChildAnimations(options2.delay)]);
  }
}
function animateTarget(visualElement2, definition, _a) {
  var _b;
  var _c = _a === void 0 ? {} : _a, _d = _c.delay, delay = _d === void 0 ? 0 : _d, transitionOverride = _c.transitionOverride, type = _c.type;
  var _e = visualElement2.makeTargetAnimatable(definition), _f = _e.transition, transition = _f === void 0 ? visualElement2.getDefaultTransition() : _f, transitionEnd = _e.transitionEnd, target = __rest(_e, ["transition", "transitionEnd"]);
  if (transitionOverride)
    transition = transitionOverride;
  var animations2 = [];
  var animationTypeState = type && ((_b = visualElement2.animationState) === null || _b === void 0 ? void 0 : _b.getState()[type]);
  for (var key in target) {
    var value = visualElement2.getValue(key);
    var valueTarget = target[key];
    if (!value || valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key)) {
      continue;
    }
    var animation = startAnimation(key, value, valueTarget, __assign({ delay }, transition));
    animations2.push(animation);
  }
  return Promise.all(animations2).then(function() {
    transitionEnd && setTarget(visualElement2, transitionEnd);
  });
}
function animateChildren(visualElement2, variant, delayChildren, staggerChildren, staggerDirection, options2) {
  if (delayChildren === void 0) {
    delayChildren = 0;
  }
  if (staggerChildren === void 0) {
    staggerChildren = 0;
  }
  if (staggerDirection === void 0) {
    staggerDirection = 1;
  }
  var animations2 = [];
  var maxStaggerDuration = (visualElement2.variantChildren.size - 1) * staggerChildren;
  var generateStaggerDuration = staggerDirection === 1 ? function(i) {
    if (i === void 0) {
      i = 0;
    }
    return i * staggerChildren;
  } : function(i) {
    if (i === void 0) {
      i = 0;
    }
    return maxStaggerDuration - i * staggerChildren;
  };
  Array.from(visualElement2.variantChildren).sort(sortByTreeOrder).forEach(function(child, i) {
    animations2.push(animateVariant(child, variant, __assign(__assign({}, options2), { delay: delayChildren + generateStaggerDuration(i) })).then(function() {
      return child.notifyAnimationComplete(variant);
    }));
  });
  return Promise.all(animations2);
}
function sortByTreeOrder(a2, b2) {
  return a2.sortNodePosition(b2);
}
function shouldBlockAnimation(_a, key) {
  var protectedKeys = _a.protectedKeys, needsAnimating = _a.needsAnimating;
  var shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
  needsAnimating[key] = false;
  return shouldBlock;
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
function convertAxisBoxToBoundingBox(_a) {
  var x = _a.x, y = _a.y;
  return {
    top: y.min,
    bottom: y.max,
    left: x.min,
    right: x.max
  };
}
function transformBoundingBox(_a, transformPoint2) {
  var top = _a.top, left = _a.left, bottom = _a.bottom, right = _a.right;
  if (transformPoint2 === void 0) {
    transformPoint2 = noop;
  }
  var topLeft = transformPoint2({ x: left, y: top });
  var bottomRight = transformPoint2({ x: right, y: bottom });
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
function copyAxisBox(box) {
  return {
    x: __assign({}, box.x),
    y: __assign({}, box.y)
  };
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
  var _a = visualElement2.getProps(), drag2 = _a.drag, _dragX = _a._dragX;
  return drag2 && !_dragX;
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
var clampProgress = function(v) {
  return clamp$1(0, 1, v);
};
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
function calcOrigin$1(source, target) {
  var origin = 0.5;
  var sourceLength = calcLength(source);
  var targetLength = calcLength(target);
  if (targetLength > sourceLength) {
    origin = progress(target.min, target.max - sourceLength, source.min);
  } else if (sourceLength > targetLength) {
    origin = progress(source.min, source.max - targetLength, target.min);
  }
  return clampProgress(origin);
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
function shallowCompare(next, prev) {
  if (!Array.isArray(prev))
    return false;
  var prevLength = prev.length;
  if (prevLength !== next.length)
    return false;
  for (var i = 0; i < prevLength; i++) {
    if (prev[i] !== next[i])
      return false;
  }
  return true;
}
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
var reversePriorityOrder = __spreadArray([], __read(variantPriorityOrder)).reverse();
var numAnimationTypes = variantPriorityOrder.length;
function animateList(visualElement2) {
  return function(animations2) {
    return Promise.all(animations2.map(function(_a) {
      var animation = _a.animation, options2 = _a.options;
      return animateVisualElement(visualElement2, animation, options2);
    }));
  };
}
function createAnimationState(visualElement2) {
  var animate2 = animateList(visualElement2);
  var state = createState();
  var allAnimatedKeys = {};
  var isInitialRender = true;
  var buildResolvedTypeValues = function(acc, definition) {
    var resolved = resolveVariant(visualElement2, definition);
    if (resolved) {
      resolved.transition;
      var transitionEnd = resolved.transitionEnd, target = __rest(resolved, ["transition", "transitionEnd"]);
      acc = __assign(__assign(__assign({}, acc), target), transitionEnd);
    }
    return acc;
  };
  function isAnimated(key) {
    return allAnimatedKeys[key] !== void 0;
  }
  function setAnimateFunction(makeAnimator) {
    animate2 = makeAnimator(visualElement2);
  }
  function animateChanges(options2, changedActiveType) {
    var _a;
    var props = visualElement2.getProps();
    var context = visualElement2.getVariantContext(true) || {};
    var animations2 = [];
    var removedKeys = new Set();
    var encounteredKeys = {};
    var removedVariantIndex = Infinity;
    var _loop_1 = function(i2) {
      var type = reversePriorityOrder[i2];
      var typeState = state[type];
      var prop = (_a = props[type]) !== null && _a !== void 0 ? _a : context[type];
      var propIsVariant = isVariantLabel(prop);
      var activeDelta = type === changedActiveType ? typeState.isActive : null;
      if (activeDelta === false)
        removedVariantIndex = i2;
      var isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
      if (isInherited && isInitialRender && visualElement2.manuallyAnimateOnMount) {
        isInherited = false;
      }
      typeState.protectedKeys = __assign({}, encounteredKeys);
      if (!typeState.isActive && activeDelta === null || !prop && !typeState.prevProp || isAnimationControls(prop) || typeof prop === "boolean") {
        return "continue";
      }
      var shouldAnimateType = variantsHaveChanged(typeState.prevProp, prop) || type === changedActiveType && typeState.isActive && !isInherited && propIsVariant || i2 > removedVariantIndex && propIsVariant;
      var definitionList = Array.isArray(prop) ? prop : [prop];
      var resolvedValues = definitionList.reduce(buildResolvedTypeValues, {});
      if (activeDelta === false)
        resolvedValues = {};
      var _b = typeState.prevResolvedValues, prevResolvedValues = _b === void 0 ? {} : _b;
      var allKeys = __assign(__assign({}, prevResolvedValues), resolvedValues);
      var markToAnimate = function(key2) {
        shouldAnimateType = true;
        removedKeys.delete(key2);
        typeState.needsAnimating[key2] = true;
      };
      for (var key in allKeys) {
        var next = resolvedValues[key];
        var prev = prevResolvedValues[key];
        if (encounteredKeys.hasOwnProperty(key))
          continue;
        if (next !== prev) {
          if (isKeyframesTarget(next) && isKeyframesTarget(prev)) {
            if (!shallowCompare(next, prev)) {
              markToAnimate(key);
            } else {
              typeState.protectedKeys[key] = true;
            }
          } else if (next !== void 0) {
            markToAnimate(key);
          } else {
            removedKeys.add(key);
          }
        } else if (next !== void 0 && removedKeys.has(key)) {
          markToAnimate(key);
        } else {
          typeState.protectedKeys[key] = true;
        }
      }
      typeState.prevProp = prop;
      typeState.prevResolvedValues = resolvedValues;
      if (typeState.isActive) {
        encounteredKeys = __assign(__assign({}, encounteredKeys), resolvedValues);
      }
      if (isInitialRender && visualElement2.blockInitialAnimation) {
        shouldAnimateType = false;
      }
      if (shouldAnimateType && !isInherited) {
        animations2.push.apply(animations2, __spreadArray([], __read(definitionList.map(function(animation) {
          return {
            animation,
            options: __assign({ type }, options2)
          };
        }))));
      }
    };
    for (var i = 0; i < numAnimationTypes; i++) {
      _loop_1(i);
    }
    allAnimatedKeys = __assign({}, encounteredKeys);
    if (removedKeys.size) {
      var fallbackAnimation_1 = {};
      removedKeys.forEach(function(key) {
        var fallbackTarget = visualElement2.getBaseTarget(key);
        if (fallbackTarget !== void 0) {
          fallbackAnimation_1[key] = fallbackTarget;
        }
      });
      animations2.push({ animation: fallbackAnimation_1 });
    }
    var shouldAnimate = Boolean(animations2.length);
    if (isInitialRender && props.initial === false && !visualElement2.manuallyAnimateOnMount) {
      shouldAnimate = false;
    }
    isInitialRender = false;
    return shouldAnimate ? animate2(animations2) : Promise.resolve();
  }
  function setActive(type, isActive, options2) {
    var _a;
    if (state[type].isActive === isActive)
      return Promise.resolve();
    (_a = visualElement2.variantChildren) === null || _a === void 0 ? void 0 : _a.forEach(function(child) {
      var _a2;
      return (_a2 = child.animationState) === null || _a2 === void 0 ? void 0 : _a2.setActive(type, isActive);
    });
    state[type].isActive = isActive;
    return animateChanges(options2, type);
  }
  return {
    isAnimated,
    animateChanges,
    setActive,
    setAnimateFunction,
    getState: function() {
      return state;
    }
  };
}
function variantsHaveChanged(prev, next) {
  if (typeof next === "string") {
    return next !== prev;
  } else if (isVariantLabels(next)) {
    return !shallowCompare(next, prev);
  }
  return false;
}
function createTypeState(isActive) {
  if (isActive === void 0) {
    isActive = false;
  }
  return {
    isActive,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function createState() {
  var _a;
  return _a = {}, _a[AnimationType.Animate] = createTypeState(true), _a[AnimationType.Hover] = createTypeState(), _a[AnimationType.Tap] = createTypeState(), _a[AnimationType.Drag] = createTypeState(), _a[AnimationType.Focus] = createTypeState(), _a[AnimationType.Exit] = createTypeState(), _a;
}
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
var compareByDepth = function(a2, b2) {
  return a2.depth - b2.depth;
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
    function update2() {
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
        props.onUpdate && sync.update(update2, false, true);
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
        cancelSync.update(update2);
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
        var progress2 = element.getProjectionAnimationProgress()[axis];
        var _a3 = isRelative ? projection.relativeTarget[axis] : projection.target[axis], min = _a3.min, max = _a3.max;
        var length = max - min;
        progress2.clearListeners();
        progress2.set(min);
        progress2.set(min);
        progress2.onChange(function(v) {
          element.setProjectionTargetAxis(axis, v, v + length, isRelative);
        });
        return element.animateMotionValue(axis, progress2, 0, transition);
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
const PresenceContext = (c2) => getDomContext("Presence", c2) || writable(null);
let counter = 0;
const incrementId = () => counter++;
function isPresent(context) {
  return context === null ? true : context.isPresent;
}
const usePresence = (isCustom = false) => {
  const context = getContext(PresenceContext) || PresenceContext(isCustom);
  const id = get_store_value(context) === null ? void 0 : incrementId();
  if (get_store_value(context) === null) {
    return readable([true, null]);
  }
  return derived(context, ($v) => !$v.isPresent && $v.onExitComplete ? [false, () => {
    var _a;
    return (_a = $v.onExitComplete) == null ? void 0 : _a.call($v, id);
  }] : [true]);
};
const LayoutGroupContext = (c2) => getDomContext("LayoutGroup", c2) || writable(null);
function isProjecting(visualElement2) {
  var isEnabled = visualElement2.projection.isEnabled;
  return isEnabled || visualElement2.shouldResetTransform();
}
function collectProjectingAncestors(visualElement2, ancestors) {
  if (ancestors === void 0) {
    ancestors = [];
  }
  var parent = visualElement2.parent;
  if (parent)
    collectProjectingAncestors(parent, ancestors);
  if (isProjecting(visualElement2))
    ancestors.push(visualElement2);
  return ancestors;
}
function collectProjectingChildren(visualElement2) {
  var children = [];
  var addChild = function(child) {
    if (isProjecting(child))
      children.push(child);
    child.children.forEach(addChild);
  };
  visualElement2.children.forEach(addChild);
  return children.sort(compareByDepth);
}
function updateLayoutMeasurement(visualElement2) {
  if (visualElement2.shouldResetTransform())
    return;
  var layoutState = visualElement2.getLayoutState();
  visualElement2.notifyBeforeLayoutMeasure(layoutState.layout);
  layoutState.isHydrated = true;
  layoutState.layout = visualElement2.measureViewportBox();
  layoutState.layoutCorrected = copyAxisBox(layoutState.layout);
  visualElement2.notifyLayoutMeasure(layoutState.layout, visualElement2.prevViewportBox || layoutState.layout);
  sync.update(function() {
    return visualElement2.rebaseProjectionTarget();
  });
}
function snapshotViewportBox(visualElement2, nc) {
  if (visualElement2.shouldResetTransform())
    return;
  if (!nc)
    visualElement2.prevViewportBox = visualElement2.measureViewportBox(false);
  visualElement2.rebaseProjectionTarget(false, visualElement2.prevViewportBox);
}
var unresolvedJobs = new Set();
function pushJob(stack, job, pointer) {
  if (!stack[pointer])
    stack[pointer] = [];
  stack[pointer].push(job);
}
function batchLayout(callback) {
  unresolvedJobs.add(callback);
  return function() {
    return unresolvedJobs.delete(callback);
  };
}
function flushLayout() {
  if (!unresolvedJobs.size)
    return;
  var pointer = 0;
  var reads = [[]];
  var writes = [];
  var setRead = function(job) {
    return pushJob(reads, job, pointer);
  };
  var setWrite = function(job) {
    pushJob(writes, job, pointer);
    pointer++;
  };
  unresolvedJobs.forEach(function(callback) {
    callback(setRead, setWrite);
    pointer = 0;
  });
  unresolvedJobs.clear();
  sync.postRender(function() {
    setTimeout(function() {
      return false;
    }, 10);
  });
  var numStacks = writes.length;
  for (var i = 0; i <= numStacks; i++) {
    reads[i] && reads[i].forEach(executeJob);
    writes[i] && writes[i].forEach(executeJob);
  }
}
var executeJob = function(job) {
  return job();
};
var defaultHandler = {
  layoutReady: function(child) {
    return child.notifyLayoutReady();
  }
};
function createBatcher() {
  var queue = new Set();
  return {
    add: function(child) {
      return queue.add(child);
    },
    flush: function(_a) {
      var _b = _a === void 0 ? defaultHandler : _a, layoutReady = _b.layoutReady, parent = _b.parent;
      batchLayout(function(read, write) {
        var order2 = Array.from(queue).sort(compareByDepth);
        var ancestors = parent ? collectProjectingAncestors(parent) : [];
        write(function() {
          var allElements = __spreadArray(__spreadArray([], __read(ancestors)), __read(order2));
          allElements.forEach(function(element) {
            return element.resetTransform();
          });
        });
        read(function() {
          order2.forEach(updateLayoutMeasurement);
        });
        write(function() {
          ancestors.forEach(function(element) {
            return element.restoreTransform();
          });
          order2.forEach(layoutReady);
        });
        read(function() {
          order2.forEach(function(child) {
            if (child.isPresent)
              child.presence = Presence.Present;
          });
        });
        write(function() {
          flushSync.preRender();
          flushSync.render();
        });
        read(function() {
          sync.postRender(function() {
            return order2.forEach(assignProjectionToSnapshot);
          });
          queue.clear();
        });
      });
      flushLayout();
    }
  };
}
function assignProjectionToSnapshot(child) {
  child.prevViewportBox = child.projection.target;
}
var SharedLayoutContext = (custom) => getDomContext("SharedLayout", custom) || writable(createBatcher());
var FramerTreeLayoutContext = () => writable(createBatcher());
function isSharedLayout(context) {
  return !!context.forceUpdate;
}
const LazyContext = (c2) => getDomContext("Lazy", c2) || writable({ strict: false });
const MotionContext = (c2) => getDomContext("Motion", c2) || writable({});
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
function loadFeatures(features) {
  for (var key in features) {
    var Component = features[key];
    if (Component !== null) {
      featureDefinitions[key].Component = Component;
    }
  }
}
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
function sortTransformProps(a2, b2) {
  return transformProps.indexOf(a2) - transformProps.indexOf(b2);
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
var progressToPixels = function(progress2, length) {
  return px.transform(progress2 * length);
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
  const motion2 = (node) => {
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
      motion2(targetEl);
    }
  }
  return `${validate_component((Component === "SVG" ? UseSVGProps : UseHTMLProps) || missing_component, "svelte:component").$$render($$result, { visualState, isStatic, props }, {}, {
    default: ({ visualProps }) => `${slots.default ? slots.default({
      motion: motion2,
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
  sortNodePosition: function(a2, b2) {
    return a2.compareDocumentPosition(b2) & 2 ? 1 : -1;
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
    var initial = props.initial, animate2 = props.animate;
    return {
      initial: initial === false || isVariantLabel(initial) ? initial : void 0,
      animate: isVariantLabel(animate2) ? animate2 : void 0
    };
  }
  return props.inherit !== false ? context || {} : {};
}
const UseCreateMotionContext = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $mc, $$unsubscribe_mc;
  let { props, isStatic, isCustom } = $$props;
  let mc = getContext(MotionContext) || MotionContext(isCustom);
  $$unsubscribe_mc = subscribe(mc, (value2) => $mc = value2);
  let { initial, animate: animate2 } = getCurrentTreeVariants(props, get_store_value(mc));
  const variantLabelsAsDependency = (prop) => {
    return Array.isArray(prop) ? prop.join(" ") : prop;
  };
  const memo = () => {
    return { initial, animate: animate2 };
  };
  let value = memo();
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.isStatic === void 0 && $$bindings.isStatic && isStatic !== void 0)
    $$bindings.isStatic(isStatic);
  if ($$props.isCustom === void 0 && $$bindings.isCustom && isCustom !== void 0)
    $$bindings.isCustom(isCustom);
  ({ initial, animate: animate2 } = getCurrentTreeVariants(props, $mc));
  {
    if (isStatic) {
      value = memo(variantLabelsAsDependency(initial), variantLabelsAsDependency(animate2));
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
  let { initial, animate: animate2 } = props;
  const isControllingVariants = checkIfControllingVariants(props);
  const isVariantNode = checkIfVariantNode(props);
  if (context && isVariantNode && !isControllingVariants && props.inherit !== false) {
    initial !== null && initial !== void 0 ? initial : initial = context.initial;
    animate2 !== null && animate2 !== void 0 ? animate2 : animate2 = context.animate;
  }
  const variantToSet = blockInitialAnimation || initial === false ? animate2 : initial;
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
  const a2 = getContext(MotionConfigContext) || MotionConfigContext(isCustom);
  $$unsubscribe_a = subscribe(a2, (value) => $a = value);
  const setContext2 = (c2, v) => {
    c2.visualElement = v;
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
                default: ({ motion: motion2, props: renderProps }) => `${slots.default ? slots.default({ motion: motion2, props: renderProps }) : ``}`
              })}`
            })}

                    ${``}`
          })}`
        })}`
      })}`
    })}`
  })}`;
});
function addDomEvent(target, eventName, handler, options2) {
  target.addEventListener(eventName, handler, options2);
  return function() {
    return target.removeEventListener(eventName, handler, options2);
  };
}
const UseDomEvent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { ref, eventName, handler = void 0, options: options2 = void 0 } = $$props;
  let cleanup = () => {
  };
  const effect = () => {
    cleanup();
    if (!ref) {
      return () => {
      };
    }
    const element = ref.current;
    if (handler && element) {
      return addDomEvent(element, eventName, handler, options2);
    }
    return () => {
    };
  };
  onDestroy(cleanup);
  if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0)
    $$bindings.ref(ref);
  if ($$props.eventName === void 0 && $$bindings.eventName && eventName !== void 0)
    $$bindings.eventName(eventName);
  if ($$props.handler === void 0 && $$bindings.handler && handler !== void 0)
    $$bindings.handler(handler);
  if ($$props.options === void 0 && $$bindings.options && options2 !== void 0)
    $$bindings.options(options2);
  cleanup = effect();
  return `${slots.default ? slots.default({}) : ``}`;
});
function isMouseEvent(event) {
  if (typeof PointerEvent !== "undefined" && event instanceof PointerEvent) {
    return !!(event.pointerType === "mouse");
  }
  return event instanceof MouseEvent;
}
function isTouchEvent(event) {
  var hasTouches = !!event.touches;
  return hasTouches;
}
function filterPrimaryPointer(eventHandler) {
  return function(event) {
    var isMouseEvent2 = event instanceof MouseEvent;
    var isPrimaryPointer = !isMouseEvent2 || isMouseEvent2 && event.button === 0;
    if (isPrimaryPointer) {
      eventHandler(event);
    }
  };
}
var defaultPagePoint = { pageX: 0, pageY: 0 };
function pointFromTouch(e, pointType) {
  if (pointType === void 0) {
    pointType = "page";
  }
  var primaryTouch = e.touches[0] || e.changedTouches[0];
  var point = primaryTouch || defaultPagePoint;
  return {
    x: point[pointType + "X"],
    y: point[pointType + "Y"]
  };
}
function pointFromMouse(point, pointType) {
  if (pointType === void 0) {
    pointType = "page";
  }
  return {
    x: point[pointType + "X"],
    y: point[pointType + "Y"]
  };
}
function extractEventInfo(event, pointType) {
  if (pointType === void 0) {
    pointType = "page";
  }
  return {
    point: isTouchEvent(event) ? pointFromTouch(event, pointType) : pointFromMouse(event, pointType)
  };
}
function getViewportPointFromEvent(event) {
  return extractEventInfo(event, "client");
}
var wrapHandler = function(handler, shouldFilterPrimaryPointer) {
  if (shouldFilterPrimaryPointer === void 0) {
    shouldFilterPrimaryPointer = false;
  }
  var listener = function(event) {
    return handler(event, extractEventInfo(event));
  };
  return shouldFilterPrimaryPointer ? filterPrimaryPointer(listener) : listener;
};
var isBrowser = typeof window !== "undefined";
var supportsPointerEvents = function() {
  return isBrowser && window.onpointerdown === null;
};
var supportsTouchEvents = function() {
  return isBrowser && window.ontouchstart === null;
};
var supportsMouseEvents = function() {
  return isBrowser && window.onmousedown === null;
};
const mouseEventNames = {
  pointerdown: "mousedown",
  pointermove: "mousemove",
  pointerup: "mouseup",
  pointercancel: "mousecancel",
  pointerover: "mouseover",
  pointerout: "mouseout",
  pointerenter: "mouseenter",
  pointerleave: "mouseleave"
};
const touchEventNames = {
  pointerdown: "touchstart",
  pointermove: "touchmove",
  pointerup: "touchend",
  pointercancel: "touchcancel"
};
function getPointerEventName(name) {
  if (supportsPointerEvents()) {
    return name;
  } else if (supportsTouchEvents()) {
    return touchEventNames[name];
  } else if (supportsMouseEvents()) {
    return mouseEventNames[name];
  }
  return name;
}
function addPointerEvent(target, eventName, handler, options2) {
  return addDomEvent(target, getPointerEventName(eventName), wrapHandler(handler, eventName === "pointerdown"), options2);
}
const UsePointerEvent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { ref, eventName, handler = void 0, options: options2 = void 0 } = $$props;
  if ($$props.ref === void 0 && $$bindings.ref && ref !== void 0)
    $$bindings.ref(ref);
  if ($$props.eventName === void 0 && $$bindings.eventName && eventName !== void 0)
    $$bindings.eventName(eventName);
  if ($$props.handler === void 0 && $$bindings.handler && handler !== void 0)
    $$bindings.handler(handler);
  if ($$props.options === void 0 && $$bindings.options && options2 !== void 0)
    $$bindings.options(options2);
  return `${validate_component(UseDomEvent, "UseDomEvent").$$render($$result, {
    ref,
    eventName: getPointerEventName(eventName),
    handler: handler && wrapHandler(handler, eventName === "pointerdown"),
    options: options2
  }, {}, {
    default: () => `${slots.default ? slots.default({}) : ``}`
  })}`;
});
var PanSession = function() {
  function PanSession2(event, handlers, _a) {
    var _this = this;
    var _b = _a === void 0 ? {} : _a, transformPagePoint = _b.transformPagePoint;
    this.startEvent = null;
    this.lastMoveEvent = null;
    this.lastMoveEventInfo = null;
    this.handlers = {};
    this.updatePoint = function() {
      if (!(_this.lastMoveEvent && _this.lastMoveEventInfo))
        return;
      var info2 = getPanInfo(_this.lastMoveEventInfo, _this.history);
      var isPanStarted = _this.startEvent !== null;
      var isDistancePastThreshold = distance(info2.offset, { x: 0, y: 0 }) >= 3;
      if (!isPanStarted && !isDistancePastThreshold)
        return;
      var point2 = info2.point;
      var timestamp2 = getFrameData().timestamp;
      _this.history.push(__assign(__assign({}, point2), { timestamp: timestamp2 }));
      var _a2 = _this.handlers, onStart = _a2.onStart, onMove = _a2.onMove;
      if (!isPanStarted) {
        onStart && onStart(_this.lastMoveEvent, info2);
        _this.startEvent = _this.lastMoveEvent;
      }
      onMove && onMove(_this.lastMoveEvent, info2);
    };
    this.handlePointerMove = function(event2, info2) {
      _this.lastMoveEvent = event2;
      _this.lastMoveEventInfo = transformPoint(info2, _this.transformPagePoint);
      if (isMouseEvent(event2) && event2.buttons === 0) {
        _this.handlePointerUp(event2, info2);
        return;
      }
      sync.update(_this.updatePoint, true);
    };
    this.handlePointerUp = function(event2, info2) {
      _this.end();
      var _a2 = _this.handlers, onEnd = _a2.onEnd, onSessionEnd = _a2.onSessionEnd;
      var panInfo = getPanInfo(transformPoint(info2, _this.transformPagePoint), _this.history);
      if (_this.startEvent && onEnd) {
        onEnd(event2, panInfo);
      }
      onSessionEnd && onSessionEnd(event2, panInfo);
    };
    if (isTouchEvent(event) && event.touches.length > 1)
      return;
    this.handlers = handlers;
    this.transformPagePoint = transformPagePoint;
    var info = extractEventInfo(event);
    var initialInfo = transformPoint(info, this.transformPagePoint);
    var point = initialInfo.point;
    var timestamp = getFrameData().timestamp;
    this.history = [__assign(__assign({}, point), { timestamp })];
    var onSessionStart = handlers.onSessionStart;
    onSessionStart && onSessionStart(event, getPanInfo(initialInfo, this.history));
    this.removeListeners = pipe(addPointerEvent(window, "pointermove", this.handlePointerMove), addPointerEvent(window, "pointerup", this.handlePointerUp), addPointerEvent(window, "pointercancel", this.handlePointerUp));
  }
  PanSession2.prototype.updateHandlers = function(handlers) {
    this.handlers = handlers;
  };
  PanSession2.prototype.end = function() {
    this.removeListeners && this.removeListeners();
    cancelSync.update(this.updatePoint);
  };
  return PanSession2;
}();
function transformPoint(info, transformPagePoint) {
  return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
}
function subtractPoint(a2, b2) {
  return { x: a2.x - b2.x, y: a2.y - b2.y };
}
function getPanInfo(_a, history) {
  var point = _a.point;
  return {
    point,
    delta: subtractPoint(point, lastDevicePoint(history)),
    offset: subtractPoint(point, startDevicePoint(history)),
    velocity: getVelocity(history, 0.1)
  };
}
function startDevicePoint(history) {
  return history[0];
}
function lastDevicePoint(history) {
  return history[history.length - 1];
}
function getVelocity(history, timeDelta) {
  if (history.length < 2) {
    return { x: 0, y: 0 };
  }
  var i = history.length - 1;
  var timestampedPoint = null;
  var lastPoint = lastDevicePoint(history);
  while (i >= 0) {
    timestampedPoint = history[i];
    if (lastPoint.timestamp - timestampedPoint.timestamp > secondsToMilliseconds(timeDelta)) {
      break;
    }
    i--;
  }
  if (!timestampedPoint) {
    return { x: 0, y: 0 };
  }
  var time = (lastPoint.timestamp - timestampedPoint.timestamp) / 1e3;
  if (time === 0) {
    return { x: 0, y: 0 };
  }
  var currentVelocity = {
    x: (lastPoint.x - timestampedPoint.x) / time,
    y: (lastPoint.y - timestampedPoint.y) / time
  };
  if (currentVelocity.x === Infinity) {
    currentVelocity.x = 0;
  }
  if (currentVelocity.y === Infinity) {
    currentVelocity.y = 0;
  }
  return currentVelocity;
}
const UsePanGesture = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let hasPanEvents;
  let $mcc, $$unsubscribe_mcc;
  let { props, visualElement: visualElement2, isCustom } = $$props;
  let { onPan, onPanStart, onPanEnd, onPanSessionStart } = props;
  let panSession = null;
  const mcc = getContext(MotionConfigContext) || MotionConfigContext(isCustom);
  $$unsubscribe_mcc = subscribe(mcc, (value) => $mcc = value);
  let { transformPagePoint } = get_store_value(mcc);
  let handlers = {
    onSessionStart: onPanSessionStart,
    onStart: onPanStart,
    onMove: onPan,
    onEnd: (event, info) => {
      panSession = null;
      onPanEnd && onPanEnd(event, info);
    }
  };
  function onPointerDown(event) {
    panSession = new PanSession(event, handlers, { transformPagePoint });
  }
  onDestroy(() => panSession && panSession.end());
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.visualElement === void 0 && $$bindings.visualElement && visualElement2 !== void 0)
    $$bindings.visualElement(visualElement2);
  if ($$props.isCustom === void 0 && $$bindings.isCustom && isCustom !== void 0)
    $$bindings.isCustom(isCustom);
  ({ onPan, onPanStart, onPanEnd, onPanSessionStart } = props);
  hasPanEvents = onPan || onPanStart || onPanEnd || onPanSessionStart;
  ({ transformPagePoint } = $mcc);
  handlers = {
    onSessionStart: onPanSessionStart,
    onStart: onPanStart,
    onMove: onPan,
    onEnd: (event, info) => {
      panSession = null;
      onPanEnd && onPanEnd(event, info);
    }
  };
  $$unsubscribe_mcc();
  return `${validate_component(UsePointerEvent, "UsePointerEvent").$$render($$result, {
    ref: visualElement2,
    eventName: "pointerdown",
    handler: hasPanEvents && onPointerDown
  }, {}, {
    default: () => `${slots.default ? slots.default({}) : ``}`
  })}`;
});
var isNodeOrChild = function(parent, child) {
  if (!child) {
    return false;
  } else if (parent === child) {
    return true;
  } else {
    return isNodeOrChild(parent, child.parentElement);
  }
};
function createLock(name) {
  var lock = null;
  return function() {
    var openLock = function() {
      lock = null;
    };
    if (lock === null) {
      lock = name;
      return openLock;
    }
    return false;
  };
}
var globalHorizontalLock = createLock("dragHorizontal");
var globalVerticalLock = createLock("dragVertical");
function getGlobalLock(drag2) {
  var lock = false;
  if (drag2 === "y") {
    lock = globalVerticalLock();
  } else if (drag2 === "x") {
    lock = globalHorizontalLock();
  } else {
    var openHorizontal_1 = globalHorizontalLock();
    var openVertical_1 = globalVerticalLock();
    if (openHorizontal_1 && openVertical_1) {
      lock = function() {
        openHorizontal_1();
        openVertical_1();
      };
    } else {
      if (openHorizontal_1)
        openHorizontal_1();
      if (openVertical_1)
        openVertical_1();
    }
  }
  return lock;
}
function isDragActive() {
  var openGestureLock = getGlobalLock(true);
  if (!openGestureLock)
    return true;
  openGestureLock();
  return false;
}
const UseTapGesture = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let onTap;
  let onTapStart;
  let onTapCancel;
  let whileTap;
  let hasPressListeners;
  let { props, visualElement: visualElement2 } = $$props;
  let isPressing = false;
  let cancelPointerEndListeners = null;
  function removePointerEndListener() {
    cancelPointerEndListeners == null ? void 0 : cancelPointerEndListeners();
    cancelPointerEndListeners = null;
  }
  function checkPointerEnd() {
    var _a;
    removePointerEndListener();
    isPressing = false;
    (_a = visualElement2.animationState) == null ? void 0 : _a.setActive(AnimationType.Tap, false);
    return !isDragActive();
  }
  function onPointerUp(event, info) {
    if (!checkPointerEnd())
      return;
    !isNodeOrChild(visualElement2.getInstance(), event.target) ? onTapCancel == null ? void 0 : onTapCancel(event, info) : onTap == null ? void 0 : onTap(event, info);
  }
  function onPointerCancel(event, info) {
    if (!checkPointerEnd())
      return;
    onTapCancel == null ? void 0 : onTapCancel(event, info);
  }
  function onPointerDown(event, info) {
    var _a;
    if (isPressing)
      return;
    removePointerEndListener();
    isPressing = true;
    cancelPointerEndListeners = pipe(addPointerEvent(window, "pointerup", onPointerUp), addPointerEvent(window, "pointercancel", onPointerCancel));
    onTapStart == null ? void 0 : onTapStart(event, info);
    (_a = visualElement2.animationState) == null ? void 0 : _a.setActive(AnimationType.Tap, true);
  }
  onDestroy(removePointerEndListener);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.visualElement === void 0 && $$bindings.visualElement && visualElement2 !== void 0)
    $$bindings.visualElement(visualElement2);
  ({ onTap, onTapStart, onTapCancel, whileTap } = props);
  hasPressListeners = onTap || onTapStart || onTapCancel || whileTap;
  return `${validate_component(UsePointerEvent, "UsePointerEvent").$$render($$result, {
    ref: visualElement2,
    eventName: "pointerdown",
    handler: hasPressListeners ? onPointerDown : void 0
  }, {}, {
    default: () => `${slots.default ? slots.default({}) : ``}`
  })}`;
});
function createHoverEvent(visualElement2, isActive, callback) {
  return (event, info) => {
    var _a;
    if (!isMouseEvent(event) || isDragActive())
      return;
    callback == null ? void 0 : callback(event, info);
    (_a = visualElement2.animationState) == null ? void 0 : _a.setActive(AnimationType.Hover, isActive);
  };
}
const UseHoverGesture = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { props, visualElement: visualElement2 } = $$props;
  let { onHoverStart, onHoverEnd, whileHover } = props;
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.visualElement === void 0 && $$bindings.visualElement && visualElement2 !== void 0)
    $$bindings.visualElement(visualElement2);
  ({ onHoverStart, onHoverEnd, whileHover } = props);
  return `${validate_component(UsePointerEvent, "UsePointerEvent").$$render($$result, {
    ref: visualElement2,
    eventName: "pointerenter",
    handler: onHoverStart || whileHover ? createHoverEvent(visualElement2, true, onHoverStart) : void 0
  }, {}, {})}
${validate_component(UsePointerEvent, "UsePointerEvent").$$render($$result, {
    ref: visualElement2,
    eventName: "pointerleave",
    handler: onHoverEnd || whileHover ? createHoverEvent(visualElement2, false, onHoverEnd) : void 0
  }, {}, {})}
${slots.default ? slots.default({}) : ``}`;
});
const UseFocusGesture = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let whileFocus;
  let { props, visualElement: visualElement2 } = $$props;
  const onFocus = () => {
    var _a;
    (_a = visualElement2.animationState) == null ? void 0 : _a.setActive(AnimationType.Focus, true);
  };
  const onBlur = () => {
    var _a;
    (_a = visualElement2.animationState) == null ? void 0 : _a.setActive(AnimationType.Focus, false);
  };
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.visualElement === void 0 && $$bindings.visualElement && visualElement2 !== void 0)
    $$bindings.visualElement(visualElement2);
  ({ whileFocus } = props);
  return `${validate_component(UseDomEvent, "UseDomEvent").$$render($$result, {
    ref: visualElement2,
    eventName: "focus",
    handler: whileFocus ? onFocus : void 0
  }, {}, {
    default: () => `${validate_component(UseDomEvent, "UseDomEvent").$$render($$result, {
      ref: visualElement2,
      eventName: "blur",
      handler: whileFocus ? onBlur : void 0
    }, {}, {
      default: () => `${slots.default ? slots.default({}) : ``}`
    })}`
  })}`;
});
const createMotionClass = (features) => {
  features && loadFeatures(features);
  return Motion;
};
const gestureAnimations = {
  tap: UseTapGesture,
  focus: UseFocusGesture,
  hover: UseHoverGesture
};
function applyConstraints(point, _a, elastic) {
  var min = _a.min, max = _a.max;
  if (min !== void 0 && point < min) {
    point = elastic ? mix(min, point, elastic.min) : Math.max(point, min);
  } else if (max !== void 0 && point > max) {
    point = elastic ? mix(max, point, elastic.max) : Math.min(point, max);
  }
  return point;
}
function calcConstrainedMinPoint(point, length, progress2, constraints, elastic) {
  var min = point - length * progress2;
  return constraints ? applyConstraints(min, constraints, elastic) : min;
}
function calcRelativeAxisConstraints(axis, min, max) {
  return {
    min: min !== void 0 ? axis.min + min : void 0,
    max: max !== void 0 ? axis.max + max - (axis.max - axis.min) : void 0
  };
}
function calcRelativeConstraints(layoutBox, _a) {
  var top = _a.top, left = _a.left, bottom = _a.bottom, right = _a.right;
  return {
    x: calcRelativeAxisConstraints(layoutBox.x, left, right),
    y: calcRelativeAxisConstraints(layoutBox.y, top, bottom)
  };
}
function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
  var _a;
  var min = constraintsAxis.min - layoutAxis.min;
  var max = constraintsAxis.max - layoutAxis.max;
  if (constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min) {
    _a = __read([max, min], 2), min = _a[0], max = _a[1];
  }
  return {
    min: layoutAxis.min + min,
    max: layoutAxis.min + max
  };
}
function calcViewportConstraints(layoutBox, constraintsBox) {
  return {
    x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
    y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y)
  };
}
function calcPositionFromProgress(axis, constraints, progress2) {
  var axisLength = axis.max - axis.min;
  var min = mix(constraints.min, constraints.max - axisLength, progress2);
  return { min, max: min + axisLength };
}
function rebaseAxisConstraints(layout2, constraints) {
  var relativeConstraints = {};
  if (constraints.min !== void 0) {
    relativeConstraints.min = constraints.min - layout2.min;
  }
  if (constraints.max !== void 0) {
    relativeConstraints.max = constraints.max - layout2.min;
  }
  return relativeConstraints;
}
var defaultElastic = 0.35;
function resolveDragElastic(dragElastic) {
  if (dragElastic === false) {
    dragElastic = 0;
  } else if (dragElastic === true) {
    dragElastic = defaultElastic;
  }
  return {
    x: resolveAxisElastic(dragElastic, "left", "right"),
    y: resolveAxisElastic(dragElastic, "top", "bottom")
  };
}
function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
  return {
    min: resolvePointElastic(dragElastic, minLabel),
    max: resolvePointElastic(dragElastic, maxLabel)
  };
}
function resolvePointElastic(dragElastic, label) {
  var _a;
  return typeof dragElastic === "number" ? dragElastic : (_a = dragElastic[label]) !== null && _a !== void 0 ? _a : 0;
}
function convertToRelativeProjection(visualElement2, isLayoutDrag) {
  if (isLayoutDrag === void 0) {
    isLayoutDrag = true;
  }
  var projectionParent = visualElement2.getProjectionParent();
  if (!projectionParent)
    return false;
  var offset;
  if (isLayoutDrag) {
    offset = calcRelativeOffset(projectionParent.projection.target, visualElement2.projection.target);
    removeBoxTransforms(offset, projectionParent.getLatestValues());
  } else {
    offset = calcRelativeOffset(projectionParent.getLayoutState().layout, visualElement2.getLayoutState().layout);
  }
  eachAxis(function(axis) {
    return visualElement2.setProjectionTargetAxis(axis, offset[axis].min, offset[axis].max, true);
  });
  return true;
}
var elementDragControls = new WeakMap();
var lastPointerEvent;
var VisualElementDragControls = function() {
  function VisualElementDragControls2(_a) {
    var visualElement2 = _a.visualElement;
    this.isDragging = false;
    this.currentDirection = null;
    this.constraints = false;
    this.elastic = axisBox();
    this.props = {};
    this.hasMutatedConstraints = false;
    this.cursorProgress = {
      x: 0.5,
      y: 0.5
    };
    this.originPoint = {};
    this.openGlobalLock = null;
    this.panSession = null;
    this.visualElement = visualElement2;
    this.visualElement.enableLayoutProjection();
    elementDragControls.set(visualElement2, this);
  }
  VisualElementDragControls2.prototype.start = function(originEvent, _a) {
    var _this = this;
    var _b = _a === void 0 ? {} : _a, _c = _b.snapToCursor, snapToCursor = _c === void 0 ? false : _c, cursorProgress = _b.cursorProgress;
    var onSessionStart = function(event) {
      var _a2;
      _this.stopMotion();
      var initialPoint = getViewportPointFromEvent(event).point;
      (_a2 = _this.cancelLayout) === null || _a2 === void 0 ? void 0 : _a2.call(_this);
      _this.cancelLayout = batchLayout(function(read, write) {
        var ancestors = collectProjectingAncestors(_this.visualElement);
        var children = collectProjectingChildren(_this.visualElement);
        var tree = __spreadArray(__spreadArray([], __read(ancestors)), __read(children));
        var hasManuallySetCursorOrigin = false;
        _this.isLayoutDrag() && _this.visualElement.lockProjectionTarget();
        write(function() {
          tree.forEach(function(element) {
            return element.resetTransform();
          });
        });
        read(function() {
          updateLayoutMeasurement(_this.visualElement);
          children.forEach(updateLayoutMeasurement);
        });
        write(function() {
          tree.forEach(function(element) {
            return element.restoreTransform();
          });
          if (snapToCursor) {
            hasManuallySetCursorOrigin = _this.snapToCursor(initialPoint);
          }
        });
        read(function() {
          var isRelativeDrag = Boolean(_this.getAxisMotionValue("x") && !_this.isExternalDrag());
          if (!isRelativeDrag) {
            _this.visualElement.rebaseProjectionTarget(true, _this.visualElement.measureViewportBox(false));
          }
          _this.visualElement.scheduleUpdateLayoutProjection();
          var projection = _this.visualElement.projection;
          eachAxis(function(axis) {
            if (!hasManuallySetCursorOrigin) {
              var _a3 = projection.target[axis], min = _a3.min, max = _a3.max;
              _this.cursorProgress[axis] = cursorProgress ? cursorProgress[axis] : progress(min, max, initialPoint[axis]);
            }
            var axisValue = _this.getAxisMotionValue(axis);
            if (axisValue) {
              _this.originPoint[axis] = axisValue.get();
            }
          });
        });
        write(function() {
          flushSync.update();
          flushSync.preRender();
          flushSync.render();
          flushSync.postRender();
        });
        read(function() {
          return _this.resolveDragConstraints();
        });
      });
    };
    var onStart = function(event, info) {
      var _a2, _b2, _c2;
      var _d = _this.props, drag2 = _d.drag, dragPropagation = _d.dragPropagation;
      if (drag2 && !dragPropagation) {
        if (_this.openGlobalLock)
          _this.openGlobalLock();
        _this.openGlobalLock = getGlobalLock(drag2);
        if (!_this.openGlobalLock)
          return;
      }
      flushLayout();
      _this.isDragging = true;
      _this.currentDirection = null;
      (_b2 = (_a2 = _this.props).onDragStart) === null || _b2 === void 0 ? void 0 : _b2.call(_a2, event, info);
      (_c2 = _this.visualElement.animationState) === null || _c2 === void 0 ? void 0 : _c2.setActive(AnimationType.Drag, true);
    };
    var onMove = function(event, info) {
      var _a2, _b2, _c2, _d;
      var _e = _this.props, dragPropagation = _e.dragPropagation, dragDirectionLock = _e.dragDirectionLock;
      if (!dragPropagation && !_this.openGlobalLock)
        return;
      var offset = info.offset;
      if (dragDirectionLock && _this.currentDirection === null) {
        _this.currentDirection = getCurrentDirection(offset);
        if (_this.currentDirection !== null) {
          (_b2 = (_a2 = _this.props).onDirectionLock) === null || _b2 === void 0 ? void 0 : _b2.call(_a2, _this.currentDirection);
        }
        return;
      }
      _this.updateAxis("x", info.point, offset);
      _this.updateAxis("y", info.point, offset);
      (_d = (_c2 = _this.props).onDrag) === null || _d === void 0 ? void 0 : _d.call(_c2, event, info);
      lastPointerEvent = event;
    };
    var onSessionEnd = function(event, info) {
      return _this.stop(event, info);
    };
    var transformPagePoint = this.props.transformPagePoint;
    this.panSession = new PanSession(originEvent, {
      onSessionStart,
      onStart,
      onMove,
      onSessionEnd
    }, { transformPagePoint });
  };
  VisualElementDragControls2.prototype.resolveDragConstraints = function() {
    var _this = this;
    var _a = this.props, dragConstraints = _a.dragConstraints, dragElastic = _a.dragElastic;
    var layout2 = this.visualElement.getLayoutState().layoutCorrected;
    if (dragConstraints) {
      this.constraints = isRefObject(dragConstraints) ? this.resolveRefConstraints(layout2, dragConstraints) : calcRelativeConstraints(layout2, dragConstraints);
    } else {
      this.constraints = false;
    }
    this.elastic = resolveDragElastic(dragElastic);
    if (this.constraints && !this.hasMutatedConstraints) {
      eachAxis(function(axis) {
        if (_this.getAxisMotionValue(axis)) {
          _this.constraints[axis] = rebaseAxisConstraints(layout2[axis], _this.constraints[axis]);
        }
      });
    }
  };
  VisualElementDragControls2.prototype.resolveRefConstraints = function(layoutBox, constraints) {
    var _a = this.props, onMeasureDragConstraints = _a.onMeasureDragConstraints, transformPagePoint = _a.transformPagePoint;
    var constraintsElement = constraints.current;
    this.constraintsBox = getBoundingBox(constraintsElement, transformPagePoint);
    var measuredConstraints = calcViewportConstraints(layoutBox, this.constraintsBox);
    if (onMeasureDragConstraints) {
      var userConstraints = onMeasureDragConstraints(convertAxisBoxToBoundingBox(measuredConstraints));
      this.hasMutatedConstraints = !!userConstraints;
      if (userConstraints) {
        measuredConstraints = convertBoundingBoxToAxisBox(userConstraints);
      }
    }
    return measuredConstraints;
  };
  VisualElementDragControls2.prototype.cancelDrag = function() {
    var _a, _b;
    this.visualElement.unlockProjectionTarget();
    (_a = this.cancelLayout) === null || _a === void 0 ? void 0 : _a.call(this);
    this.isDragging = false;
    this.panSession && this.panSession.end();
    this.panSession = null;
    if (!this.props.dragPropagation && this.openGlobalLock) {
      this.openGlobalLock();
      this.openGlobalLock = null;
    }
    (_b = this.visualElement.animationState) === null || _b === void 0 ? void 0 : _b.setActive(AnimationType.Drag, false);
  };
  VisualElementDragControls2.prototype.stop = function(event, info) {
    var _a, _b, _c;
    (_a = this.panSession) === null || _a === void 0 ? void 0 : _a.end();
    this.panSession = null;
    var isDragging = this.isDragging;
    this.cancelDrag();
    if (!isDragging)
      return;
    var velocity = info.velocity;
    this.animateDragEnd(velocity);
    (_c = (_b = this.props).onDragEnd) === null || _c === void 0 ? void 0 : _c.call(_b, event, info);
  };
  VisualElementDragControls2.prototype.snapToCursor = function(point) {
    var _this = this;
    return eachAxis(function(axis) {
      var drag2 = _this.props.drag;
      if (!shouldDrag(axis, drag2, _this.currentDirection))
        return;
      var axisValue = _this.getAxisMotionValue(axis);
      if (axisValue) {
        var box = _this.visualElement.getLayoutState().layout;
        var length_1 = box[axis].max - box[axis].min;
        var center = box[axis].min + length_1 / 2;
        var offset = point[axis] - center;
        _this.originPoint[axis] = point[axis];
        axisValue.set(offset);
      } else {
        _this.cursorProgress[axis] = 0.5;
        return true;
      }
    }).includes(true);
  };
  VisualElementDragControls2.prototype.updateAxis = function(axis, point, offset) {
    var drag2 = this.props.drag;
    if (!shouldDrag(axis, drag2, this.currentDirection))
      return;
    return this.getAxisMotionValue(axis) ? this.updateAxisMotionValue(axis, offset) : this.updateVisualElementAxis(axis, point);
  };
  VisualElementDragControls2.prototype.updateAxisMotionValue = function(axis, offset) {
    var axisValue = this.getAxisMotionValue(axis);
    if (!offset || !axisValue)
      return;
    var nextValue = this.originPoint[axis] + offset[axis];
    var update2 = this.constraints ? applyConstraints(nextValue, this.constraints[axis], this.elastic[axis]) : nextValue;
    axisValue.set(update2);
  };
  VisualElementDragControls2.prototype.updateVisualElementAxis = function(axis, point) {
    var _a;
    var axisLayout = this.visualElement.getLayoutState().layout[axis];
    var axisLength = axisLayout.max - axisLayout.min;
    var axisProgress = this.cursorProgress[axis];
    var min = calcConstrainedMinPoint(point[axis], axisLength, axisProgress, (_a = this.constraints) === null || _a === void 0 ? void 0 : _a[axis], this.elastic[axis]);
    this.visualElement.setProjectionTargetAxis(axis, min, min + axisLength);
  };
  VisualElementDragControls2.prototype.setProps = function(_a) {
    var _b = _a.drag, drag2 = _b === void 0 ? false : _b, _c = _a.dragDirectionLock, dragDirectionLock = _c === void 0 ? false : _c, _d = _a.dragPropagation, dragPropagation = _d === void 0 ? false : _d, _e = _a.dragConstraints, dragConstraints = _e === void 0 ? false : _e, _f = _a.dragElastic, dragElastic = _f === void 0 ? defaultElastic : _f, _g = _a.dragMomentum, dragMomentum = _g === void 0 ? true : _g, remainingProps = __rest(_a, ["drag", "dragDirectionLock", "dragPropagation", "dragConstraints", "dragElastic", "dragMomentum"]);
    this.props = __assign({
      drag: drag2,
      dragDirectionLock,
      dragPropagation,
      dragConstraints,
      dragElastic,
      dragMomentum
    }, remainingProps);
  };
  VisualElementDragControls2.prototype.getAxisMotionValue = function(axis) {
    var _a = this.props, layout2 = _a.layout, layoutId = _a.layoutId;
    var dragKey = "_drag" + axis.toUpperCase();
    if (this.props[dragKey]) {
      return this.props[dragKey];
    } else if (!layout2 && layoutId === void 0) {
      return this.visualElement.getValue(axis, 0);
    }
  };
  VisualElementDragControls2.prototype.isLayoutDrag = function() {
    return !this.getAxisMotionValue("x");
  };
  VisualElementDragControls2.prototype.isExternalDrag = function() {
    var _a = this.props, _dragX = _a._dragX, _dragY = _a._dragY;
    return _dragX || _dragY;
  };
  VisualElementDragControls2.prototype.animateDragEnd = function(velocity) {
    var _this = this;
    var _a = this.props, drag2 = _a.drag, dragMomentum = _a.dragMomentum, dragElastic = _a.dragElastic, dragTransition = _a.dragTransition;
    var isRelative = convertToRelativeProjection(this.visualElement, this.isLayoutDrag() && !this.isExternalDrag());
    var constraints = this.constraints || {};
    if (isRelative && Object.keys(constraints).length && this.isLayoutDrag()) {
      var projectionParent = this.visualElement.getProjectionParent();
      if (projectionParent) {
        var relativeConstraints_1 = calcRelativeOffset(projectionParent.projection.targetFinal, constraints);
        eachAxis(function(axis) {
          var _a2 = relativeConstraints_1[axis], min = _a2.min, max = _a2.max;
          constraints[axis] = {
            min: isNaN(min) ? void 0 : min,
            max: isNaN(max) ? void 0 : max
          };
        });
      }
    }
    var momentumAnimations = eachAxis(function(axis) {
      var _a2;
      if (!shouldDrag(axis, drag2, _this.currentDirection)) {
        return;
      }
      var transition = (_a2 = constraints === null || constraints === void 0 ? void 0 : constraints[axis]) !== null && _a2 !== void 0 ? _a2 : {};
      var bounceStiffness = dragElastic ? 200 : 1e6;
      var bounceDamping = dragElastic ? 40 : 1e7;
      var inertia2 = __assign(__assign({
        type: "inertia",
        velocity: dragMomentum ? velocity[axis] : 0,
        bounceStiffness,
        bounceDamping,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10
      }, dragTransition), transition);
      return _this.getAxisMotionValue(axis) ? _this.startAxisValueAnimation(axis, inertia2) : _this.visualElement.startLayoutAnimation(axis, inertia2, isRelative);
    });
    return Promise.all(momentumAnimations).then(function() {
      var _a2, _b;
      (_b = (_a2 = _this.props).onDragTransitionEnd) === null || _b === void 0 ? void 0 : _b.call(_a2);
    });
  };
  VisualElementDragControls2.prototype.stopMotion = function() {
    var _this = this;
    eachAxis(function(axis) {
      var axisValue = _this.getAxisMotionValue(axis);
      axisValue ? axisValue.stop() : _this.visualElement.stopLayoutAnimation();
    });
  };
  VisualElementDragControls2.prototype.startAxisValueAnimation = function(axis, transition) {
    var axisValue = this.getAxisMotionValue(axis);
    if (!axisValue)
      return;
    var currentValue = axisValue.get();
    axisValue.set(currentValue);
    axisValue.set(currentValue);
    return startAnimation(axis, axisValue, 0, transition);
  };
  VisualElementDragControls2.prototype.scalePoint = function() {
    var _this = this;
    var _a = this.props, drag2 = _a.drag, dragConstraints = _a.dragConstraints;
    if (!isRefObject(dragConstraints) || !this.constraintsBox)
      return;
    this.stopMotion();
    var boxProgress = { x: 0, y: 0 };
    eachAxis(function(axis) {
      boxProgress[axis] = calcOrigin$1(_this.visualElement.projection.target[axis], _this.constraintsBox[axis]);
    });
    this.updateConstraints(function() {
      eachAxis(function(axis) {
        if (!shouldDrag(axis, drag2, null))
          return;
        var _a2 = calcPositionFromProgress(_this.visualElement.projection.target[axis], _this.constraintsBox[axis], boxProgress[axis]), min = _a2.min, max = _a2.max;
        _this.visualElement.setProjectionTargetAxis(axis, min, max);
      });
    });
    setTimeout(flushLayout, 1);
  };
  VisualElementDragControls2.prototype.updateConstraints = function(onReady) {
    var _this = this;
    this.cancelLayout = batchLayout(function(read, write) {
      var ancestors = collectProjectingAncestors(_this.visualElement);
      write(function() {
        return ancestors.forEach(function(element) {
          return element.resetTransform();
        });
      });
      read(function() {
        return updateLayoutMeasurement(_this.visualElement);
      });
      write(function() {
        return ancestors.forEach(function(element) {
          return element.restoreTransform();
        });
      });
      read(function() {
        _this.resolveDragConstraints();
      });
      if (onReady)
        write(onReady);
    });
  };
  VisualElementDragControls2.prototype.mount = function(visualElement2) {
    var _this = this;
    var element = visualElement2.getInstance();
    var stopPointerListener = addPointerEvent(element, "pointerdown", function(event) {
      var _a = _this.props, drag2 = _a.drag, _b = _a.dragListener, dragListener = _b === void 0 ? true : _b;
      drag2 && dragListener && _this.start(event);
    });
    var stopResizeListener = addDomEvent(window, "resize", function() {
      _this.scalePoint();
    });
    var stopLayoutUpdateListener = visualElement2.onLayoutUpdate(function() {
      if (_this.isDragging) {
        _this.resolveDragConstraints();
      }
    });
    var prevDragCursor = visualElement2.prevDragCursor;
    if (prevDragCursor) {
      this.start(lastPointerEvent, { cursorProgress: prevDragCursor });
    }
    return function() {
      stopPointerListener === null || stopPointerListener === void 0 ? void 0 : stopPointerListener();
      stopResizeListener === null || stopResizeListener === void 0 ? void 0 : stopResizeListener();
      stopLayoutUpdateListener === null || stopLayoutUpdateListener === void 0 ? void 0 : stopLayoutUpdateListener();
      _this.cancelDrag();
    };
  };
  return VisualElementDragControls2;
}();
function shouldDrag(direction, drag2, currentDirection) {
  return (drag2 === true || drag2 === direction) && (currentDirection === null || currentDirection === direction);
}
function getCurrentDirection(offset, lockThreshold) {
  if (lockThreshold === void 0) {
    lockThreshold = 10;
  }
  var direction = null;
  if (Math.abs(offset.y) > lockThreshold) {
    direction = "y";
  } else if (Math.abs(offset.x) > lockThreshold) {
    direction = "x";
  }
  return direction;
}
const UseDrag = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $mcc, $$unsubscribe_mcc;
  let { visualElement: visualElement2, props, isCustom } = $$props;
  const mcc = getContext(MotionConfigContext) || MotionConfigContext(isCustom);
  $$unsubscribe_mcc = subscribe(mcc, (value) => $mcc = value);
  let dragControls = new VisualElementDragControls({ visualElement: visualElement2 });
  let cleanup;
  const dragEffect = () => {
    if (cleanup) {
      cleanup();
    }
    if (groupDragControls) {
      cleanup = groupDragControls.subscribe(dragControls);
    }
  };
  let { dragControls: groupDragControls } = props;
  let { transformPagePoint } = get_store_value(mcc);
  dragControls.setProps({ ...props, transformPagePoint });
  onDestroy(() => {
    if (cleanup) {
      cleanup();
    }
  });
  if ($$props.visualElement === void 0 && $$bindings.visualElement && visualElement2 !== void 0)
    $$bindings.visualElement(visualElement2);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.isCustom === void 0 && $$bindings.isCustom && isCustom !== void 0)
    $$bindings.isCustom(isCustom);
  ({ dragControls: groupDragControls } = props);
  ({ transformPagePoint } = $mcc);
  {
    dragControls.setProps({ ...props, transformPagePoint });
  }
  {
    dragEffect();
  }
  $$unsubscribe_mcc();
  return `${slots.default ? slots.default({}) : ``}`;
});
const drag = {
  pan: UsePanGesture,
  drag: UseDrag
};
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
const Animate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { visualElement: visualElement2, layout: layout2 = void 0, safeToRemove } = $$props;
  let stopAxisAnimation = { x: void 0, y: void 0 };
  let unsubLayoutReady;
  onDestroy(() => {
    unsubLayoutReady();
    eachAxis((axis) => {
      var _a;
      return (_a = stopAxisAnimation[axis]) == null ? void 0 : _a.call(stopAxisAnimation);
    });
  });
  if ($$props.visualElement === void 0 && $$bindings.visualElement && visualElement2 !== void 0)
    $$bindings.visualElement(visualElement2);
  if ($$props.layout === void 0 && $$bindings.layout && layout2 !== void 0)
    $$bindings.layout(layout2);
  if ($$props.safeToRemove === void 0 && $$bindings.safeToRemove && safeToRemove !== void 0)
    $$bindings.safeToRemove(safeToRemove);
  return ``;
});
const AnimateLayoutContextProvider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $presence, $$unsubscribe_presence;
  let { visualElement: visualElement2, props, isCustom } = $$props;
  let { layout: layout2 } = props;
  const presence = usePresence(isCustom);
  $$unsubscribe_presence = subscribe(presence, (value) => $presence = value);
  if ($$props.visualElement === void 0 && $$bindings.visualElement && visualElement2 !== void 0)
    $$bindings.visualElement(visualElement2);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.isCustom === void 0 && $$bindings.isCustom && isCustom !== void 0)
    $$bindings.isCustom(isCustom);
  ({ layout: layout2 } = props);
  $$unsubscribe_presence();
  return `${validate_component(Animate, "Animate").$$render($$result, {
    visualElement: visualElement2,
    layout: layout2,
    safeToRemove: $presence[1]
  }, {}, {})}`;
});
const Measure = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { visualElement: visualElement2, syncLayout, framerSyncLayout, update: update2 } = $$props;
  const scaleCorrectionContext = getContext(ScaleCorrectionContext);
  const scaleCorrectionParentContext = getContext(ScaleCorrectionParentContext);
  let updated = false;
  const updater = (nc = false) => {
    if (updated) {
      return null;
    }
    updated = true;
    get_store_value(scaleCorrectionContext).forEach((v) => {
      var _a;
      (_a = v.updater) == null ? void 0 : _a.call(v, true);
    });
    if (isSharedLayout(syncLayout)) {
      syncLayout.syncUpdate();
    } else {
      snapshotViewportBox(visualElement2, nc);
      syncLayout.add(visualElement2);
    }
    return null;
  };
  const afterU = (nc = false) => {
    updated = false;
    const scc = get_store_value(scaleCorrectionContext);
    scc.forEach((v, i) => {
      var _a;
      (_a = v.afterU) == null ? void 0 : _a.call(v, true);
    });
    if (!isSharedLayout(syncLayout)) {
      syncLayout.flush();
    }
  };
  scaleCorrectionParentContext.update((v) => v.concat([{ updater, afterU }]));
  if ($$props.visualElement === void 0 && $$bindings.visualElement && visualElement2 !== void 0)
    $$bindings.visualElement(visualElement2);
  if ($$props.syncLayout === void 0 && $$bindings.syncLayout && syncLayout !== void 0)
    $$bindings.syncLayout(syncLayout);
  if ($$props.framerSyncLayout === void 0 && $$bindings.framerSyncLayout && framerSyncLayout !== void 0)
    $$bindings.framerSyncLayout(framerSyncLayout);
  if ($$props.update === void 0 && $$bindings.update && update2 !== void 0)
    $$bindings.update(update2);
  update2 !== void 0 && updater(update2);
  return ``;
});
const MeasureContextProvider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let update2;
  let $syncLayout, $$unsubscribe_syncLayout;
  let $framerSyncLayout, $$unsubscribe_framerSyncLayout;
  let { visualElement: visualElement2, props, isCustom } = $$props;
  const syncLayout = getContext(SharedLayoutContext) || SharedLayoutContext(isCustom);
  $$unsubscribe_syncLayout = subscribe(syncLayout, (value) => $syncLayout = value);
  const framerSyncLayout = getContext(FramerTreeLayoutContext) || FramerTreeLayoutContext();
  $$unsubscribe_framerSyncLayout = subscribe(framerSyncLayout, (value) => $framerSyncLayout = value);
  if ($$props.visualElement === void 0 && $$bindings.visualElement && visualElement2 !== void 0)
    $$bindings.visualElement(visualElement2);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.isCustom === void 0 && $$bindings.isCustom && isCustom !== void 0)
    $$bindings.isCustom(isCustom);
  ({ update: update2 } = props);
  $$unsubscribe_syncLayout();
  $$unsubscribe_framerSyncLayout();
  return `${validate_component(Measure, "Measure").$$render($$result, {
    syncLayout: $syncLayout,
    framerSyncLayout: $framerSyncLayout,
    visualElement: visualElement2,
    update: update2
  }, {}, {})}`;
});
var layoutAnimations = {
  measureLayout: MeasureContextProvider,
  layoutAnimation: AnimateLayoutContextProvider
};
const AnimationState = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { visualElement: visualElement2, props } = $$props;
  let { animate: animate2 } = props;
  if ($$props.visualElement === void 0 && $$bindings.visualElement && visualElement2 !== void 0)
    $$bindings.visualElement(visualElement2);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  ({ animate: animate2 } = props);
  {
    {
      visualElement2.animationState = visualElement2.animationState || createAnimationState(visualElement2);
    }
  }
  {
    if (isAnimationControls(animate2)) {
      tick().then(() => animate2.subscribe(visualElement2));
    }
  }
  return ``;
});
const Exit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let custom;
  let $presence, $$unsubscribe_presence;
  let $presenceContext, $$unsubscribe_presenceContext;
  let { props, visualElement: visualElement2, isCustom } = $$props;
  const presenceContext = getContext(PresenceContext) || PresenceContext(isCustom);
  $$unsubscribe_presenceContext = subscribe(presenceContext, (value) => $presenceContext = value);
  const presence = usePresence(isCustom);
  $$unsubscribe_presence = subscribe(presence, (value) => $presence = value);
  const effect = (pres) => {
    var _a, _b;
    const [isPresent2, onExitComplete] = pres;
    const animation = (_b = visualElement2.animationState) == null ? void 0 : _b.setActive(AnimationType.Exit, !isPresent2, {
      custom: (_a = $presenceContext == null ? void 0 : $presenceContext.custom) != null ? _a : custom
    });
    !isPresent2 && (animation == null ? void 0 : animation.then(onExitComplete));
    return "";
  };
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.visualElement === void 0 && $$bindings.visualElement && visualElement2 !== void 0)
    $$bindings.visualElement(visualElement2);
  if ($$props.isCustom === void 0 && $$bindings.isCustom && isCustom !== void 0)
    $$bindings.isCustom(isCustom);
  ({ custom } = props);
  {
    effect($presence);
  }
  $$unsubscribe_presence();
  $$unsubscribe_presenceContext();
  return `${slots.default ? slots.default({}) : ``}`;
});
const animations = {
  animation: AnimationState,
  exit: Exit
};
const featureBundle = {
  ...animations,
  ...gestureAnimations,
  ...drag,
  ...layoutAnimations
};
var motion = /* @__PURE__ */ createMotionClass(featureBundle);
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
  let { motion: motion2 } = $$props;
  let container;
  if ($$props.___tag === void 0 && $$bindings.___tag && ___tag !== void 0)
    $$bindings.___tag(___tag);
  if ($$props.motion === void 0 && $$bindings.motion && motion2 !== void 0)
    $$bindings.motion(motion2);
  return `<div${spread([escape_object($$restProps)])}${add_attribute("this", container, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
const M = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["___tag"]);
  let { ___tag } = $$props;
  if ($$props.___tag === void 0 && $$bindings.___tag && ___tag !== void 0)
    $$bindings.___tag(___tag);
  return `${validate_component(Motion, "Motion").$$render($$result, Object.assign($$restProps), {}, {
    default: ({ props, motion: motion2 }) => `${validate_component(Transformer, "T").$$render($$result, Object.assign({ motion: motion2 }, { ___tag }, props), {}, {
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
var Bar_svelte_svelte_type_style_lang = ".small-bar.svelte-100bbnt{position:absolute}.cover-image.svelte-100bbnt{height:100%;width:100%;position:absolute;top:0;bottom:0;left:0;right:0;object-fit:cover}.single-bar-container.svelte-100bbnt{z-index:1;overflow:hidden;position:absolute;background-color:white}.single-bar-container.svelte-100bbnt:nth-child(1){left:2%;top:13.8%;height:62%;width:1%}.single-bar-container.svelte-100bbnt:nth-child(2){left:3.6%;top:13.8%;height:62%;width:0.9%}.single-bar-container.svelte-100bbnt:nth-child(3){left:6.9%;top:13.9%;height:62%;width:2%}.single-bar-container.svelte-100bbnt:nth-child(4){top:13.8%;height:62%;width:2.7%}.single-bar-container.svelte-100bbnt:nth-child(5){left:14.3%;top:13.8%;height:62%}.single-bar-container.svelte-100bbnt:nth-child(6){left:17.8%;top:13.8%;height:62%;width:1.5%}.single-bar-container.svelte-100bbnt:nth-child(7){left:20%;top:13.8%;height:62%;width:1.1%}.single-bar-container.svelte-100bbnt:nth-child(8){left:23.1%;top:13.8%;height:62%;width:1.9%}.single-bar-container.svelte-100bbnt:nth-child(9){left:25.7%;top:13.8%;height:62%;width:1%}.single-bar-container.svelte-100bbnt:nth-child(10){left:28.8%;top:13.8%;height:62%;width:1%}.single-bar-container.svelte-100bbnt:nth-child(11){left:32%;top:13.8%;height:62%;width:1.9%}.single-bar-container.svelte-100bbnt:nth-child(12){left:34.6%;top:13.8%;height:62%;width:2.5%}.single-bar-container.svelte-100bbnt:nth-child(13){left:46.6%;top:13.8%;height:62%;width:1%}.single-bar-container.svelte-100bbnt:nth-child(14){left:49.8%;top:13.8%;height:62%;width:1.9%}.single-bar-container.svelte-100bbnt:nth-child(15){left:54%;top:13.8%;height:62%;width:0.9%}.single-bar-container.svelte-100bbnt:nth-child(16){left:55.6%;top:13.8%;height:62%;width:1.8%}.single-bar-container.svelte-100bbnt:nth-child(17){top:13.8%;height:62%;width:1.1%}.single-bar-container.svelte-100bbnt:nth-child(18){top:13.8%;height:62%;left:20%;width:2.5%}.single-bar-container.svelte-100bbnt:nth-child(19){left:91.3%;top:13.8%;height:62%;width:1.1%}.single-bar-container.svelte-100bbnt:nth-child(20){left:64.5%;top:13.8%;height:62%;width:1%}.single-bar-container.svelte-100bbnt:nth-child(21){left:66.4%;top:13.8%;height:62%;width:0.9%}.single-bar-container.svelte-100bbnt:nth-child(22){left:69.4%;top:13.8%;height:62%;width:1.9%}.single-bar-container.svelte-100bbnt:nth-child(23){left:73.5%;top:13.8%;height:62%;width:0.9%}.single-bar-container.svelte-100bbnt:nth-child(24){left:75.1%;top:13.8%;height:62%;width:2.7%}.single-bar-container.svelte-100bbnt:nth-child(25){left:79.9%;top:13.8%;height:62%;width:1.7%}.single-bar-container.svelte-100bbnt:nth-child(26){left:82.5%;top:13.8%;height:62%;width:0.8%}.single-bar-container.svelte-100bbnt:nth-child(27){left:85.5%;top:13.8%;height:62%;width:1.2%}.single-bar-container.svelte-100bbnt:nth-child(28){left:88.9%;top:13.8%;height:62%;width:1.7%}.single-bar-container.svelte-100bbnt:nth-child(29){left:94.4%;top:13.8%;height:62%;width:2.9%}.single-bar-container.svelte-100bbnt:nth-child(30){left:97.9%;top:13.8%;height:62%;width:1.7%}";
const css$2 = {
  code: ".small-bar.svelte-100bbnt{position:absolute}.cover-image.svelte-100bbnt{height:100%;width:100%;position:absolute;top:0;bottom:0;left:0;right:0;object-fit:cover}.single-bar-container.svelte-100bbnt{z-index:1;overflow:hidden;position:absolute;background-color:white}.single-bar-container.svelte-100bbnt:nth-child(1){left:2%;top:13.8%;height:62%;width:1%}.single-bar-container.svelte-100bbnt:nth-child(2){left:3.6%;top:13.8%;height:62%;width:0.9%}.single-bar-container.svelte-100bbnt:nth-child(3){left:6.9%;top:13.9%;height:62%;width:2%}.single-bar-container.svelte-100bbnt:nth-child(4){top:13.8%;height:62%;width:2.7%}.single-bar-container.svelte-100bbnt:nth-child(5){left:14.3%;top:13.8%;height:62%}.single-bar-container.svelte-100bbnt:nth-child(6){left:17.8%;top:13.8%;height:62%;width:1.5%}.single-bar-container.svelte-100bbnt:nth-child(7){left:20%;top:13.8%;height:62%;width:1.1%}.single-bar-container.svelte-100bbnt:nth-child(8){left:23.1%;top:13.8%;height:62%;width:1.9%}.single-bar-container.svelte-100bbnt:nth-child(9){left:25.7%;top:13.8%;height:62%;width:1%}.single-bar-container.svelte-100bbnt:nth-child(10){left:28.8%;top:13.8%;height:62%;width:1%}.single-bar-container.svelte-100bbnt:nth-child(11){left:32%;top:13.8%;height:62%;width:1.9%}.single-bar-container.svelte-100bbnt:nth-child(12){left:34.6%;top:13.8%;height:62%;width:2.5%}.single-bar-container.svelte-100bbnt:nth-child(13){left:46.6%;top:13.8%;height:62%;width:1%}.single-bar-container.svelte-100bbnt:nth-child(14){left:49.8%;top:13.8%;height:62%;width:1.9%}.single-bar-container.svelte-100bbnt:nth-child(15){left:54%;top:13.8%;height:62%;width:0.9%}.single-bar-container.svelte-100bbnt:nth-child(16){left:55.6%;top:13.8%;height:62%;width:1.8%}.single-bar-container.svelte-100bbnt:nth-child(17){top:13.8%;height:62%;width:1.1%}.single-bar-container.svelte-100bbnt:nth-child(18){top:13.8%;height:62%;left:20%;width:2.5%}.single-bar-container.svelte-100bbnt:nth-child(19){left:91.3%;top:13.8%;height:62%;width:1.1%}.single-bar-container.svelte-100bbnt:nth-child(20){left:64.5%;top:13.8%;height:62%;width:1%}.single-bar-container.svelte-100bbnt:nth-child(21){left:66.4%;top:13.8%;height:62%;width:0.9%}.single-bar-container.svelte-100bbnt:nth-child(22){left:69.4%;top:13.8%;height:62%;width:1.9%}.single-bar-container.svelte-100bbnt:nth-child(23){left:73.5%;top:13.8%;height:62%;width:0.9%}.single-bar-container.svelte-100bbnt:nth-child(24){left:75.1%;top:13.8%;height:62%;width:2.7%}.single-bar-container.svelte-100bbnt:nth-child(25){left:79.9%;top:13.8%;height:62%;width:1.7%}.single-bar-container.svelte-100bbnt:nth-child(26){left:82.5%;top:13.8%;height:62%;width:0.8%}.single-bar-container.svelte-100bbnt:nth-child(27){left:85.5%;top:13.8%;height:62%;width:1.2%}.single-bar-container.svelte-100bbnt:nth-child(28){left:88.9%;top:13.8%;height:62%;width:1.7%}.single-bar-container.svelte-100bbnt:nth-child(29){left:94.4%;top:13.8%;height:62%;width:2.9%}.single-bar-container.svelte-100bbnt:nth-child(30){left:97.9%;top:13.8%;height:62%;width:1.7%}",
  map: `{"version":3,"file":"Bar.svelte","sources":["Bar.svelte"],"sourcesContent":["<script>\\r\\n  import { Motion } from \\"svelte-motion\\";\\r\\n  import main1 from \\"../images/home/1.png\\";\\r\\n  import main2 from \\"../images/home/2.png\\";\\r\\n  import main3 from \\"../images/home/3.jpg\\";\\r\\n  import main4 from \\"../images/home/4.png\\";\\r\\n\\r\\n  export let index;\\r\\n\\r\\n  let shouldExpand = true;\\r\\n  let shouldShowLabels = false;\\r\\n  let imageVisible = true;\\r\\n  const initialLarge = {\\r\\n    3: {\\r\\n      defaultPos: {\\r\\n        left: \\"0px\\",\\r\\n      },\\r\\n      imagePos: {\\r\\n        0: \\"0%\\",\\r\\n        1: \\"0%\\",\\r\\n      },\\r\\n      img: main1,\\r\\n      position: {\\r\\n        left: \\"10.9%\\",\\r\\n\\r\\n        top: \\"13.8%\\",\\r\\n\\r\\n        width: \\"2.7%\\",\\r\\n      },\\r\\n    },\\r\\n    17: {\\r\\n      img: main2,\\r\\n      imagePos: {\\r\\n        0: \\"44%\\",\\r\\n        1: \\"20%\\",\\r\\n      },\\r\\n      defaultPos: {\\r\\n        left: \\"22.5%\\",\\r\\n      },\\r\\n      position: {\\r\\n        left: \\"59.5%\\",\\r\\n\\r\\n        top: \\"13.8%\\",\\r\\n\\r\\n        width: \\"1.1%\\",\\r\\n      },\\r\\n    },\\r\\n    23: {\\r\\n      img: main3,\\r\\n      imagePos: {\\r\\n        0: \\"44%\\",\\r\\n        1: \\"20%\\",\\r\\n      },\\r\\n      defaultPos: {\\r\\n        left: \\"67.5%\\",\\r\\n      },\\r\\n      position: {\\r\\n        left: \\"75.1%\\",\\r\\n        top: \\"13.8%\\",\\r\\n\\r\\n        width: \\"2.7%\\",\\r\\n      },\\r\\n    },\\r\\n    28: {\\r\\n      img: main4,\\r\\n      imagePos: {\\r\\n        0: \\"44%\\",\\r\\n        1: \\"20%\\",\\r\\n      },\\r\\n      defaultPos: {\\r\\n        left: \\"90%\\",\\r\\n        right: \\"0\\",\\r\\n      },\\r\\n      position: {\\r\\n        left: \\"94.4%\\",\\r\\n        top: \\"13.8%\\",\\r\\n\\r\\n        width: \\"2.9%\\",\\r\\n      },\\r\\n    },\\r\\n  };\\r\\n  let large = initialLarge[index];\\r\\n  let initial = \\"1\\";\\r\\n  let hoveredOut = 6;\\r\\n  let currAnimation = \\"2\\";\\r\\n  let variantSmall = {\\r\\n    2: {\\r\\n      rotateX: 0,\\r\\n      opacity: 1,\\r\\n      transition: { duration: hoveredOut, delay: 2.0 },\\r\\n    },\\r\\n    fullScreen: {\\r\\n      width: \\"100vw\\",\\r\\n      height: \\"70vh\\",\\r\\n      left: 0,\\r\\n      right: 0,\\r\\n      scale: 1,\\r\\n      rotateX: 0,\\r\\n      zIndex: 2,\\r\\n      position: \\"fixed\\",\\r\\n    },\\r\\n  };\\r\\n  let variantLarge = {\\r\\n    2: () => ({\\r\\n      left: initialLarge[index].position.left,\\r\\n      right: initialLarge[index].position.right,\\r\\n      scale: 1,\\r\\n      top: initialLarge[index].position.top,\\r\\n      width: initialLarge[index].position.width,\\r\\n\\r\\n      height: \\"62%\\",\\r\\n\\r\\n      transition: { duration: hoveredOut, delay: 0.5 },\\r\\n    }),\\r\\n    fullScreen: {\\r\\n      width: \\"100vw\\",\\r\\n      height: \\"70vh\\",\\r\\n      left: 0,\\r\\n      right: 0,\\r\\n      scale: 1,\\r\\n      rotateX: 0,\\r\\n      zIndex: 2,\\r\\n      position: \\"fixed\\",\\r\\n    },\\r\\n  };\\r\\n\\r\\n  const expand = (e) => {\\r\\n    initial = \\"2\\";\\r\\n    currAnimation = \\"fullScreen\\";\\r\\n\\r\\n    shouldExpand = false;\\r\\n  };\\r\\n<\/script>\\r\\n\\r\\n<Motion\\r\\n  onAnimationComplete={(name) => {\\r\\n    if (name === \\"2\\") {\\r\\n      imageVisible = false;\\r\\n      shouldShowLabels = true;\\r\\n    }\\r\\n  }}\\r\\n  animate={currAnimation}\\r\\n  variants={large ? variantLarge : variantSmall}\\r\\n  onHoverStart={() => {\\r\\n    hoveredOut = 0.2;\\r\\n  }}\\r\\n  let:motion\\r\\n  ><div\\r\\n    use:motion\\r\\n    style={large\\r\\n      ? \`\\r\\n      top:0;\\r\\n      height:100%;\\r\\n\\r\\n      left:\${initialLarge[index].defaultPos.left}; opacity:1; width:10%; height:100%\`\\r\\n      : \\"opacity:0\\"}\\r\\n    on:click={expand}\\r\\n    class=\\"{large ? 'large-bar' : 'small-bar'} single-bar-container\\"\\r\\n  >\\r\\n    {#if large}\\r\\n      <Motion\\r\\n        transition={{\\r\\n          duration: 2,\\r\\n          delay: 2,\\r\\n        }}\\r\\n        animate={{\\r\\n          opacity: 0,\\r\\n        }}\\r\\n        let:motion\\r\\n        ><img\\r\\n          src={initialLarge[index].img}\\r\\n          use:motion\\r\\n          style={\`\\r\\n    opacity:1;\\r\\n    object-position:\${initialLarge[index][\\"imagePos\\"][0]} \${initialLarge[index][\\"imagePos\\"][1]};\\r\\n  \`}\\r\\n          class=\\"cover-image\\"\\r\\n          alt=\\"\\"\\r\\n        />\\r\\n      </Motion>\\r\\n    {/if}\\r\\n    <!-- <div class=\\"close-main\\" /> -->\\r\\n    <!-- <li\\r\\n      style=\\" display:{shouldShowLabels ? 'block' : 'none'}\\"\\r\\n      class=\\"nav-label\\"\\r\\n    /> -->\\r\\n  </div>\\r\\n</Motion>\\r\\n\\r\\n<style lang=\\"scss\\">.small-bar {\\n  position: absolute;\\n}\\n\\n.cover-image {\\n  height: 100%;\\n  width: 100%;\\n  position: absolute;\\n  top: 0;\\n  bottom: 0;\\n  left: 0;\\n  right: 0;\\n  object-fit: cover;\\n}\\n\\n.close-main {\\n  height: 32px;\\n  max-height: 32px;\\n  max-width: 32px;\\n  min-height: 32px;\\n  min-width: 32px;\\n  position: absolute;\\n  right: 0;\\n  width: 32px;\\n}\\n.close-main:after {\\n  background-color: black;\\n  content: \\"\\";\\n  display: block;\\n  right: 0;\\n  position: absolute;\\n  top: 50%;\\n  height: 2px;\\n  width: 50%;\\n  transform: translate(-50%) translateY(-50%) rotate(45deg);\\n  transform-origin: center center;\\n}\\n.close-main::before {\\n  background-color: black;\\n  content: \\"\\";\\n  height: 50%;\\n  width: 2px;\\n  display: block;\\n  left: 50%;\\n  position: absolute;\\n  top: 50%;\\n  transform: translate(-50%) translateY(-50%) rotate(45deg);\\n  transform-origin: center center;\\n}\\n\\n.single-bar-container {\\n  z-index: 1;\\n  overflow: hidden;\\n  position: absolute;\\n  background-color: white;\\n}\\n.single-bar-container:nth-child(1) {\\n  left: 2%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1%;\\n}\\n.single-bar-container:nth-child(2) {\\n  left: 3.6%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 0.9%;\\n}\\n.single-bar-container:nth-child(3) {\\n  left: 6.9%;\\n  top: 13.9%;\\n  height: 62%;\\n  width: 2%;\\n}\\n.single-bar-container:nth-child(4) {\\n  top: 13.8%;\\n  height: 62%;\\n  width: 2.7%;\\n}\\n.single-bar-container:nth-child(5) {\\n  left: 14.3%;\\n  top: 13.8%;\\n  height: 62%;\\n}\\n.single-bar-container:nth-child(6) {\\n  left: 17.8%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.5%;\\n}\\n.single-bar-container:nth-child(7) {\\n  left: 20%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.1%;\\n}\\n.single-bar-container:nth-child(8) {\\n  left: 23.1%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.9%;\\n}\\n.single-bar-container:nth-child(9) {\\n  left: 25.7%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1%;\\n}\\n.single-bar-container:nth-child(10) {\\n  left: 28.8%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1%;\\n}\\n.single-bar-container:nth-child(11) {\\n  left: 32%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.9%;\\n}\\n.single-bar-container:nth-child(12) {\\n  left: 34.6%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 2.5%;\\n}\\n.single-bar-container:nth-child(13) {\\n  left: 46.6%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1%;\\n}\\n.single-bar-container:nth-child(14) {\\n  left: 49.8%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.9%;\\n}\\n.single-bar-container:nth-child(15) {\\n  left: 54%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 0.9%;\\n}\\n.single-bar-container:nth-child(16) {\\n  left: 55.6%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.8%;\\n}\\n.single-bar-container:nth-child(17) {\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.1%;\\n}\\n.single-bar-container:nth-child(18) {\\n  top: 13.8%;\\n  height: 62%;\\n  left: 20%;\\n  width: 2.5%;\\n}\\n.single-bar-container:nth-child(19) {\\n  left: 91.3%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.1%;\\n}\\n.single-bar-container:nth-child(20) {\\n  left: 64.5%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1%;\\n}\\n.single-bar-container:nth-child(21) {\\n  left: 66.4%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 0.9%;\\n}\\n.single-bar-container:nth-child(22) {\\n  left: 69.4%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.9%;\\n}\\n.single-bar-container:nth-child(23) {\\n  left: 73.5%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 0.9%;\\n}\\n.single-bar-container:nth-child(24) {\\n  left: 75.1%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 2.7%;\\n}\\n.single-bar-container:nth-child(25) {\\n  left: 79.9%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.7%;\\n}\\n.single-bar-container:nth-child(26) {\\n  left: 82.5%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 0.8%;\\n}\\n.single-bar-container:nth-child(27) {\\n  left: 85.5%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.2%;\\n}\\n.single-bar-container:nth-child(28) {\\n  left: 88.9%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.7%;\\n}\\n.single-bar-container:nth-child(29) {\\n  left: 94.4%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 2.9%;\\n}\\n.single-bar-container:nth-child(30) {\\n  left: 97.9%;\\n  top: 13.8%;\\n  height: 62%;\\n  width: 1.7%;\\n}</style>\\r\\n"],"names":[],"mappings":"AA6LmB,UAAU,eAAC,CAAC,AAC7B,QAAQ,CAAE,QAAQ,AACpB,CAAC,AAED,YAAY,eAAC,CAAC,AACZ,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,UAAU,CAAE,KAAK,AACnB,CAAC,AAqCD,qBAAqB,eAAC,CAAC,AACrB,OAAO,CAAE,CAAC,CACV,QAAQ,CAAE,MAAM,CAChB,QAAQ,CAAE,QAAQ,CAClB,gBAAgB,CAAE,KAAK,AACzB,CAAC,AACD,oCAAqB,WAAW,CAAC,CAAC,AAAC,CAAC,AAClC,IAAI,CAAE,EAAE,CACR,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,EAAE,AACX,CAAC,AACD,oCAAqB,WAAW,CAAC,CAAC,AAAC,CAAC,AAClC,IAAI,CAAE,IAAI,CACV,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,CAAC,CAAC,AAAC,CAAC,AAClC,IAAI,CAAE,IAAI,CACV,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,EAAE,AACX,CAAC,AACD,oCAAqB,WAAW,CAAC,CAAC,AAAC,CAAC,AAClC,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,CAAC,CAAC,AAAC,CAAC,AAClC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,AACb,CAAC,AACD,oCAAqB,WAAW,CAAC,CAAC,AAAC,CAAC,AAClC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,CAAC,CAAC,AAAC,CAAC,AAClC,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,CAAC,CAAC,AAAC,CAAC,AAClC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,CAAC,CAAC,AAAC,CAAC,AAClC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,EAAE,AACX,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,EAAE,AACX,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,EAAE,AACX,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,IAAI,CAAE,GAAG,CACT,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,EAAE,AACX,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,oCAAqB,WAAW,EAAE,CAAC,AAAC,CAAC,AACnC,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,CACV,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,AACb,CAAC"}`
};
const Bar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { index: index2 } = $$props;
  const initialLarge = {
    3: {
      defaultPos: { left: "0px" },
      imagePos: { 0: "0%", 1: "0%" },
      img: main1,
      position: {
        left: "10.9%",
        top: "13.8%",
        width: "2.7%"
      }
    },
    17: {
      img: main2,
      imagePos: { 0: "44%", 1: "20%" },
      defaultPos: { left: "22.5%" },
      position: {
        left: "59.5%",
        top: "13.8%",
        width: "1.1%"
      }
    },
    23: {
      img: main3,
      imagePos: { 0: "44%", 1: "20%" },
      defaultPos: { left: "67.5%" },
      position: {
        left: "75.1%",
        top: "13.8%",
        width: "2.7%"
      }
    },
    28: {
      img: main4,
      imagePos: { 0: "44%", 1: "20%" },
      defaultPos: { left: "90%", right: "0" },
      position: {
        left: "94.4%",
        top: "13.8%",
        width: "2.9%"
      }
    }
  };
  let large = initialLarge[index2];
  let hoveredOut = 6;
  let currAnimation = "2";
  let variantSmall = {
    2: {
      rotateX: 0,
      opacity: 1,
      transition: { duration: hoveredOut, delay: 2 }
    },
    fullScreen: {
      width: "100vw",
      height: "70vh",
      left: 0,
      right: 0,
      scale: 1,
      rotateX: 0,
      zIndex: 2,
      position: "fixed"
    }
  };
  let variantLarge = {
    2: () => ({
      left: initialLarge[index2].position.left,
      right: initialLarge[index2].position.right,
      scale: 1,
      top: initialLarge[index2].position.top,
      width: initialLarge[index2].position.width,
      height: "62%",
      transition: { duration: hoveredOut, delay: 0.5 }
    }),
    fullScreen: {
      width: "100vw",
      height: "70vh",
      left: 0,
      right: 0,
      scale: 1,
      rotateX: 0,
      zIndex: 2,
      position: "fixed"
    }
  };
  if ($$props.index === void 0 && $$bindings.index && index2 !== void 0)
    $$bindings.index(index2);
  $$result.css.add(css$2);
  return `${validate_component(motion, "Motion").$$render($$result, {
    onAnimationComplete: (name) => {
    },
    animate: currAnimation,
    variants: large ? variantLarge : variantSmall,
    onHoverStart: () => {
      hoveredOut = 0.2;
    }
  }, {}, {
    default: ({ motion: motion$1 }) => `<div${add_attribute("style", large ? `
      top:0;
      height:100%;

      left:${initialLarge[index2].defaultPos.left}; opacity:1; width:10%; height:100%` : "opacity:0", 0)} class="${escape(large ? "large-bar" : "small-bar") + " single-bar-container svelte-100bbnt"}">${large ? `${validate_component(motion, "Motion").$$render($$result, {
      transition: { duration: 2, delay: 2 },
      animate: { opacity: 0 }
    }, {}, {
      default: ({ motion: motion2 }) => `<img${add_attribute("src", initialLarge[index2].img, 0)}${add_attribute("style", `
    opacity:1;
    object-position:${initialLarge[index2]["imagePos"][0]} ${initialLarge[index2]["imagePos"][1]};
  `, 0)} class="${"cover-image svelte-100bbnt"}" alt="${""}">`
    })}` : ``}
    
    </div>`
  })}`;
});
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a2, b2) {
  if (a2 === b2 || a2 !== a2)
    return () => a2;
  const type = typeof a2;
  if (type !== typeof b2 || Array.isArray(a2) !== Array.isArray(b2)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a2)) {
    const arr = b2.map((bi, i) => {
      return get_interpolator(a2[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a2 || !b2)
      throw new Error("Object cannot be null");
    if (is_date(a2) && is_date(b2)) {
      a2 = a2.getTime();
      b2 = b2.getTime();
      const delta2 = b2 - a2;
      return (t) => new Date(a2 + t * delta2);
    }
    const keys = Object.keys(b2);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a2[key], b2[key]);
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
    const delta2 = b2 - a2;
    return (t) => a2 + t * delta2;
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
    let { delay = 0, duration = 400, easing = identity, interpolate: interpolate2 = get_interpolator } = assign(assign({}, defaults), opts);
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
        fn = interpolate2(value, new_value);
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
var global = '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n@font-face {\n  font-family: "Orator";\n  src: url("__VITE_ASSET__b76fd88c__") format("truetype");\n}';
var Logo_svelte_svelte_type_style_lang = ".bar-container.svelte-1lu1tnu{top:0;justify-content:space-between;z-index:1;position:relative;width:90%;display:flex;align-items:center;height:800px}";
const css$1 = {
  code: ".bar-container.svelte-1lu1tnu{top:0;justify-content:space-between;z-index:1;position:relative;width:90%;display:flex;align-items:center;height:800px}",
  map: '{"version":3,"file":"Logo.svelte","sources":["Logo.svelte"],"sourcesContent":["<script>\\r\\n  import { onDestroy, onMount } from \\"svelte\\";\\r\\n  import Bar from \\"../components/Bar.svelte\\";\\r\\n  import { spring, tweened } from \\"svelte/motion\\";\\r\\n  import { cubicOut } from \\"svelte/easing\\";\\r\\n  import { Motion } from \\"svelte-motion\\";\\r\\n\\r\\n  import \\"../global.scss\\";\\r\\n  import Logo from \\"../images/Logo.svelte\\";\\r\\n\\r\\n  let windowThreshHold = false;\\r\\n\\r\\n  onMount(() => {});\\r\\n  onDestroy(() => {});\\r\\n  const bars = Array.from(\\" \\".repeat(30));\\r\\n\\r\\n  const offset = [];\\r\\n  for (let i = 0; i < 30; i++) {\\r\\n    offset.push(\\r\\n      tweened(\\r\\n        { rotate: 80 },\\r\\n\\r\\n        {\\r\\n          delay: i * 100,\\r\\n          duration: 4000,\\r\\n          easing: cubicOut,\\r\\n        }\\r\\n      )\\r\\n    );\\r\\n  }\\r\\n  console.log(offset[0]);\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"bar-container\\">\\r\\n  {#each bars as bar, i}\\r\\n    <Bar index={i} offset={offset[i]} />\\r\\n  {/each}\\r\\n</div>\\r\\n\\r\\n<style lang=\\"scss\\">.bar-container {\\n  top: 0;\\n  justify-content: space-between;\\n  z-index: 1;\\n  position: relative;\\n  width: 90%;\\n  display: flex;\\n  align-items: center;\\n  height: 800px;\\n}</style>\\r\\n"],"names":[],"mappings":"AAuCmB,cAAc,eAAC,CAAC,AACjC,GAAG,CAAE,CAAC,CACN,eAAe,CAAE,aAAa,CAC9B,OAAO,CAAE,CAAC,CACV,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,GAAG,CACV,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,MAAM,CAAE,KAAK,AACf,CAAC"}'
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
  return `<div class="${"bar-container svelte-1lu1tnu"}">${each(bars, (bar, i) => `${validate_component(Bar, "Bar").$$render($$result, { index: i, offset: offset[i] }, {}, {})}`)}
</div>`;
});
var Home_svelte_svelte_type_style_lang = ".container.svelte-1hbfkvv{font-family:Orator;color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;background-color:black;overflow:hidden}h5.svelte-1hbfkvv{opacity:0;font-weight:100;font-size:4em;text-transform:uppercase}";
const css = {
  code: ".container.svelte-1hbfkvv{font-family:Orator;color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;background-color:black;overflow:hidden}h5.svelte-1hbfkvv{opacity:0;font-weight:100;font-size:4em;text-transform:uppercase}",
  map: '{"version":3,"file":"Home.svelte","sources":["Home.svelte"],"sourcesContent":["<script>\\r\\n  import { Motion } from \\"svelte-motion\\";\\r\\n\\r\\n  import Logo from \\"../images/Logo.svelte\\";\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"container\\">\\r\\n  <Motion\\r\\n    transition={{ duration: 1, delay: 3 }}\\r\\n    let:motion\\r\\n    animate={{ opacity: 1 }}\\r\\n  >\\r\\n    <h5 use:motion>connecting people</h5>\\r\\n  </Motion>\\r\\n  <Logo />\\r\\n  <Motion\\r\\n    transition={{ duration: 1, delay: 3 }}\\r\\n    let:motion\\r\\n    animate={{ opacity: 1 }}\\r\\n  >\\r\\n    <h5 use:motion>to the art of living</h5>\\r\\n  </Motion>\\r\\n</div>\\r\\n\\r\\n<style lang=\\"scss\\">.container {\\n  font-family: Orator;\\n  color: white;\\n  display: flex;\\n  flex-direction: column;\\n  justify-content: center;\\n  align-items: center;\\n  height: 100vh;\\n  background-color: black;\\n  overflow: hidden;\\n}\\n\\nh5 {\\n  opacity: 0;\\n  font-weight: 100;\\n  font-size: 4em;\\n  text-transform: uppercase;\\n}</style>\\r\\n"],"names":[],"mappings":"AAwBmB,UAAU,eAAC,CAAC,AAC7B,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,KAAK,CACZ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,MAAM,CAAE,KAAK,CACb,gBAAgB,CAAE,KAAK,CACvB,QAAQ,CAAE,MAAM,AAClB,CAAC,AAED,EAAE,eAAC,CAAC,AACF,OAAO,CAAE,CAAC,CACV,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,GAAG,CACd,cAAc,CAAE,SAAS,AAC3B,CAAC"}'
};
const Home = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="${"container svelte-1hbfkvv"}">${validate_component(motion, "Motion").$$render($$result, {
    transition: { duration: 1, delay: 3 },
    animate: { opacity: 1 }
  }, {}, {
    default: ({ motion: motion2 }) => `<h5 class="${"svelte-1hbfkvv"}">connecting people</h5>`
  })}
  ${validate_component(Logo_1, "Logo").$$render($$result, {}, {}, {})}
  ${validate_component(motion, "Motion").$$render($$result, {
    transition: { duration: 1, delay: 3 },
    animate: { opacity: 1 }
  }, {}, {
    default: ({ motion: motion2 }) => `<h5 class="${"svelte-1hbfkvv"}">to the art of living</h5>`
  })}
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
