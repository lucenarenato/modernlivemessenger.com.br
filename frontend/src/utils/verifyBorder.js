import online from "./assets/borders/online.png";
import busy from "./assets/borders/busy.png";
import away from "./assets/borders/away.png";
import invisible from "./assets/borders/invisible.png";
import frame from "./assets/borders/frame_64.png";

export const borderMap = {
    online,
    busy,
    away,
    invisible,
    default: frame,
};

export const verifyBorder = (status) => {
    return borderMap[status] || borderMap.default;
};