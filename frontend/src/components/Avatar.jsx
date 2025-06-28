import "./Avatar.css";

import React from "react";
import { verifyAvatar } from "../utils/verifyAvatar";
import { verifyBorder } from "../utils/verifyBorder";

export default function Avatar({
    avatar = "image",
    size = 64,
    status = "default",
    top = 2,
    left = 4,
    minus = 15,
}) {
    const src = verifyAvatar(avatar);
    const frame = verifyBorder(status);

    // Calcula o tamanho baseado nas props
    let calculatedSize;
    switch (String(size)) { // Convertendo para string para garantir a comparação
        case "32":
            calculatedSize = 70;
            break;
        case "64":
            calculatedSize = 100;
            break;
        case "96":
            calculatedSize = 120;
            break;
        default:
            calculatedSize = size;
    }

    const avatarDivStyle = {
        width: `${calculatedSize - minus}px`,
        height: `${calculatedSize - minus}px`
    };

    const avatarFrameStyle = {
        marginLeft: `${left}px`,
        marginTop: `${top}px`,
        width: `${calculatedSize + 1}px`
    };

    return (
        <div className="modal-border-container">
            <div id="modal-border-avatar-div" style={avatarDivStyle}>
                <img
                    id="modal-border-avatar-frame"
                    src={frame}
                    alt=""
                    style={avatarFrameStyle}
                />
                <div id="frame-div-avatar">
                    <img id="modal-border-avatar-picture" src={src} alt="" />
                </div>
            </div>
        </div>
    );
}
