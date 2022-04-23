const myCodeMirror = CodeMirror.fromTextArea(
    document.getElementById("editorworkspace"),
    {
        lineNumbers: true,
        value: document.getElementById("editorworkspace").innerHTML,
        styleActiveLine: true,
        matchBrackets: true,
    }
);

const linkToResource = document.getElementById("linktoresource");
const languageSelector = document.getElementById("languageselector");
const idTypeCheckbox = document.getElementById("idtypecheckbox");

async function fetchContent() {
    try {
        const response = await fetch(`/api/share?id=${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then((data) => data.json());

        myCodeMirror.setOption("mode", response.lang);
        myCodeMirror.setValue(response.content);

        languageSelector.value = response.lang;

        if (response.bigId) {
            idTypeCheckbox.checked = true;
        }

        linkToResource.innerHTML = id;
    } catch {
        id = undefined;
    }
}

async function fetchChanges() {
    const response = await fetch("/api/share", {
        method: "POST",
        body: JSON.stringify({
            content: myCodeMirror.getValue(),
            id: id,
            lang: languageSelector.value,
            bigId: idTypeCheckbox.checked,
        }),
        headers: { "Content-Type": "application/json" },
    }).then((data) => data.json());

    id = response.id;
    linkToResource.innerHTML = id;

    window.history.pushState(
        `codeshr#${response.id}`,
        `csh#${response.id}`,
        `/${response.id}`
    );
}

function linkToResourceOnClick() {
    navigator.clipboard.writeText(window.location.href);
}

async function languageSelectorOnChange() {
    const script = await loadJS(languageSelector.options[languageSelector.selectedIndex].getAttribute("script"));
    script.onload = () => myCodeMirror.setOption("mode", languageSelector.value);
        
    if (id) {
        await fetchChanges();
    }
}

function themeCheckboxOnClick() {
    const themeCssFile = document.getElementById("themecssfile");
    if (document.getElementById("themecheckbox").checked) {
        themeCssFile.href = "/stylesheets/dark-csh.css";
        myCodeMirror.setOption("theme", "darcula");
    } else {
        themeCssFile.href = "/stylesheets/light-csh.css";
        myCodeMirror.setOption("theme", "default");
    }
}

function idTypeCheckboxOnClick() {
    if (id) {
        fetchChanges();
    }
}