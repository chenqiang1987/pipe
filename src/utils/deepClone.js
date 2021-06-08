export const isEmpty = obj => Object.keys(obj).length === 0;

export const checkType = value => Object.prototype.toString.call(value);

export const deepClone = obj => {
    let _obj = new obj.constructor;
    for (const [k, v] of Object.entries(obj)) {
        const valType = checkType(v);
        if (obj !== null && valType === '[object Object]') {
            if (/(RegExp|Date)/.test(valType)) {
                _obj[k] = new v.constructor(v);
                continue
            }
            _obj[k] = deepClone(v)
            continue
        }
        _obj[k] = v
    }
    return _obj
}

