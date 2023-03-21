(() => {
    const themeSelectorElem = document.getElementById('theme-selector');
    const themes = [
        {
            name: 'light',
            icon: '☀️'
        },
        {
            name: 'dark',
            icon: '🌘'
        }
    ];

    function setThemeId(id) {
        if (id < 0) { id = themes.length - 1; }
        else if (id > themes.length - 1) { id = 0; }

        themeSelectorElem.innerText = themes[id].icon;
        document.body.setAttribute('data-app-theme', id);

        localStorage.setItem('app-theme', id);
    }

    function getThemeId() {
        let appThemeId = parseInt(localStorage.getItem('app-theme'));

        if (isNaN(appThemeId)) {
            appThemeId = 0;
            setThemeId(0);
        }

        return appThemeId;
    }

    setThemeId(getThemeId());

    themeSelectorElem.addEventListener('click', () => {
        setThemeId(getThemeId() + 1);
    });
})();