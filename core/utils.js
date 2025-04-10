const random = length => {
    return Array.from({length}, () => Math.floor(Math.random() * 10)).join('');
};

const colorRgbToHex = rgbStr => {
    //十六进制颜色值的正则表达式
    const reg =
        /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8}|[0-9a-fA-f]{6}[0-9]{2})$/;
    if (reg.test(rgbStr)) {
        return rgbStr;
    }
    // 提取RGB值
    const rgbValues = rgbStr
        .replace(/(?:\(|\)|rgba|rgb|RGBA|RGB)*/g, '')
        .split(',')
        .map(Number);

    // 转换为十六进制
    const hex = rgbValues
        .slice(0, 3)
        .map(value => {
            const hex = value.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');

    // 如果有透明度，添加透明度值
    const alpha = rgbValues[3];
    return alpha ? `#${hex}${Math.round(alpha * 100)}` : `#${hex}`;
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
