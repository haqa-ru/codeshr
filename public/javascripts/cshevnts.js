window.addEventListener("load", async () => {
    themeCheckboxOnClick();
    await fetchContent()
    await languageSelectorOnChange();
});

window.onpopstate = (e) => {
    if (e.state) {
        document.getElementById("content").innerHTML = e.state.html;
        document.title = e.state.pageTitle;
    }
};

myCodeMirror.on("change", () => fetchChanges());

myCodeMirror.on("cursorActivity", () => {
    document.getElementById("cursorposition").innerHTML = `ln: ${
        myCodeMirror.getCursor().line
    } | ${myCodeMirror.getCursor().ch} :ch`;
});