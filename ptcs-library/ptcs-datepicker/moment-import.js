(function(win) {
    let moment = win.moment;
    if (!moment) {
        let msg = 'moment.js is required before ptcs-datepicker import';
        throw new Error(msg);
    }
}(window));
