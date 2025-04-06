const random = length => {
    const chars = '0123456789';
    let result = '';

    while (length > 0) {
        length--;
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
};

const colorRgbToHex = rgbStr => {
    //十六进制颜色值的正则表达式
    const reg =
        /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8}|[0-9a-fA-f]{6}[0-9]{2})$/;
    if (reg.test(rgbStr)) {
        return rgbStr;
    } else {
        const rgbArray = rgbStr
            .replace(/(?:\(|\)|rgba|rgb|RGBA|RGB)*/g, '')
            .split(',');
        let strHex = '#';
        for (let i = 0; i < rgbArray.length; i++) {
            if (i !== 3) {
                if (rgbArray[i] == '0') {
                    strHex += '00';
                } else {
                    let newItem = Number(rgbArray[i]).toString(16);
                    if (newItem.length < 2) {
                        newItem = '0' + newItem;
                    }
                    strHex += newItem;
                }
            } else {
                strHex += rgbArray[i] == '0' ? '' : Number(rgbArray[i]) * 100;
            }
        }
        return strHex;
    }
};

const secondsToHms = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);
    return [hours, minutes, secs].map(v => (v < 10 ? '0' + v : v)).join(':');
};

// 解析时间为毫秒
const parseTime = time => {
    // 如果 time 是一个数字，它表示以秒为单位的时间跨度
    if (typeof time === 'number') {
        return time * 1000; // 转换为毫秒
    }

    // 如果 time 是一个字符串，解析它来获取时间跨度和单位
    const match = time.match(/^(\d+)(d|h|m|s)$/);
    if (match) {
        const amount = parseInt(match[1], 10);
        const unit = match[2];

        switch (unit) {
            case 'd':
                return amount * 24 * 60 * 60 * 1000; // 天转换为毫秒
            case 'h':
                return amount * 60 * 60 * 1000; // 小时转换为毫秒
            case 'm':
                return amount * 60 * 1000; // 分钟转换为毫秒
            case 's':
                return amount * 1000; // 秒转换为毫秒
            default:
                throw new Error(`不支持的时间单位: ${unit}`);
        }
    }

    throw new Error(`无效的值: ${time}`);
};

module.exports = {
    random,
    colorRgbToHex,
    secondsToHms,
    parseTime
};
