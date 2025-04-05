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

module.exports = {
    colorRgbToHex,
    secondsToHms
};
