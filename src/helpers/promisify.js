function promisify(f, manyArgs = false) {
    return function (...args) {
        return new Promise((resoleve, reject) => {
            function callback(err, ...results) {
                if (err) {
                    reject(err);
                } else {
                    resoleve(manyArgs ? results : results[0]);
                }
            }

            args.push(callback);
            f.apply(this, args);
        });
    }
}

module.exports = promisify;