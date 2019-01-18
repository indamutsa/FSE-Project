var moment = require('moment');
var message = ((from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
});

module.exports = {
    message
}