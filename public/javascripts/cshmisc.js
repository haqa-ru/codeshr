async function loadJS(src) {
    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
    return script;
}
