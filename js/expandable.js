(() => {
    let expandableControllers = document.querySelectorAll('[data-expandable]');

    for (let controller of expandableControllers.values()) {
        let expandableElemId = controller.getAttribute('data-expandable');
        if (expandableElemId === null) continue;

        let expandableElem = document.getElementById(expandableElemId);
        if (expandableElem === null) continue;

        let initElemState = expandableElem.getAttribute('data-expandable-state') ?? 'expanded';
        expandableElem.setAttribute('data-expandable-state', initElemState);

        if (initElemState === 'collapsed') {
            expandableElem.style.maxHeight = '0px';
        } else {
            expandableElem.style.maxHeight = expandableElem.scrollHeight + 'px';
        }

        controller.addEventListener('click', () => {
            let expandableState = expandableElem.getAttribute('data-expandable-state') ?? 'expanded';
            expandableState = expandableState === 'collapsed' ? 'expanded' : 'collapsed';

            expandableElem.setAttribute('data-expandable-state', expandableState);

            if (expandableState === 'collapsed') {
                expandableElem.style.maxHeight = '0px';
            } else {
                expandableElem.style.maxHeight = expandableElem.scrollHeight + 'px';
            }
        });
    }
})();