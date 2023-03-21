(() => {
    let date = new Date();
    let hours = date.getHours();

    let shiftThisDay = 0, shiftThisWeek = 0;

    if (hours >= 6 && hours < 14) {
        shiftThisDay = 1;
        document.querySelectorAll('.hour-bubble._1').forEach(elem => elem.classList.add('of-this-shift'));
    }
    else if (hours >= 14 && hours < 22) {
        shiftThisDay = 2;
        document.querySelectorAll('.hour-bubble._2').forEach(elem => elem.classList.add('of-this-shift'));
    } else {
        shiftThisDay = 3;
        document.querySelectorAll('.hour-bubble._3').forEach(elem => elem.classList.add('of-this-shift'));
    }

    let day = date.getDay();
    if (shiftThisDay == 3 && date.getHours() >= 0 && date.getHours() < 6) {
        day -= 1;
        if (day < 0) day = 6;
    }

    // 0 is sunday, 1 is monday
    switch (date.getDay()) {
        case 1:
            shiftThisWeek = 0 + shiftThisDay;
            break;
        case 2:
            shiftThisWeek = 3 + shiftThisDay;
            break;
        case 3:
            shiftThisWeek = 6 + shiftThisDay;
            break;
        case 4:
            shiftThisWeek = 9 + shiftThisDay;
            break;
        case 5:
            shiftThisWeek = 12 + shiftThisDay;
            break;
        case 6:
            shiftThisWeek = 15 + shiftThisDay;
            break;
        case 0:
            shiftThisWeek = 18 + shiftThisDay;
            break;
    }

    let onejan = new Date(date.getFullYear(), 0, 1);
    let week = Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);

    document.getElementById('shift-this-week').innerText = `${shiftThisWeek} / ${week}`;
})();