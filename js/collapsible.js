(() => {
    let collapsibles = document.getElementsByClassName('collapsible');

    for (let i = 0; i < collapsibles.length; i++) {
        collapsibles[i].addEventListener('click', () => {
            collapsibles[i].classList.toggle('active');

            let content = collapsibles[i].nextElementSibling;

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = '38px';
            }
        });
    }
})();