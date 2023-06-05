export function processRules(rules: any[]) {
    return {
        style: rules
            .flatMap((x) => (x ? x.style || x : []))
            .reduce((acc, x) => {
                for (const key in x) {
                    if (key[0] === ':' || key[0] === '@') continue;

                    acc[key] = x[key];
                }
                return acc;
            }, {}),
    };
}
