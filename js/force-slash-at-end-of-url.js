(() => {
    if (!location.href.endsWith('/')) {
        location.replace(location.href + '/');
    }
})();