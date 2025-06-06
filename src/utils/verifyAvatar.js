import avatarDefault from "./assets/avatars/default.png";
import leaf from "./assets/avatars/leaf.png";
import basketball from "./assets/avatars/basketball.png";
import bonsai from "./assets/avatars/bonsai.png";
import chef from "./assets/avatars/chef.png";
import chess from "./assets/avatars/chess.png";
import doctor from "./assets/avatars/doctor.png";
import dog from "./assets/avatars/dog.png";
import electric_guitar from "./assets/avatars/electric_guitar.png";
import executive from "./assets/avatars/executive.png";
import fall from "./assets/avatars/fall.gif";
import fish from "./assets/avatars/fish.png";
import flare from "./assets/avatars/flare.png";
import gerber_daisy from "./assets/avatars/gerber_daisy.png";
import golf from "./assets/avatars/golf.png";
import guest from "./assets/avatars/guest.png";
import guitar from "./assets/avatars/guitar.png";
import kitten from "./assets/avatars/kitten.png";
import morty from "./assets/avatars/morty.png";
import music from "./assets/avatars/music.png";
import robot from "./assets/avatars/robot.png";
import seastar from "./assets/avatars/seastar.png";
import shopping from "./assets/avatars/shopping.png";
import soccer from "./assets/avatars/soccer.gif";
import sports from "./assets/avatars/sports.png";
import spring from "./assets/avatars/spring.gif";
import summer from "./assets/avatars/summer.gif";
import surf from "./assets/avatars/surf.png";
import tennis from "./assets/avatars/tennis.png";
import winter from "./assets/avatars/winter.gif";

import forest from "./assets/avatars/forest.png";
import flower from "./assets/avatars/flower.png";
import rocket from "./assets/avatars/rocket.png";
import duck from "./assets/avatars/duck.png";
import bike from "./assets/avatars/bike.png";
import skate from "./assets/avatars/skate.png";
import ball from "./assets/avatars/ball.png";
import dogb from "./assets/avatars/dogb.png";
import beach from "./assets/avatars/beach.png";

import horses from "./assets/avatars/horses.png";

export const defaultPhotosArray = [
    "leaf",
    "basketball",
    "bonsai",
    "chef",
    "chess",
    "doctor",
    "dog",
    "electric_guitar",
    "executive",
    "fall",
    "fish",
    "flare",
    "gerber_daisy",
    "golf",
    "guest",
    "guitar",
    "kitten",
    "morty",
    "music",
    "robot",
    "seastar",
    "shopping",
    "soccer",
    "sports",
    "spring",
    "summer",
    "surf",
    "tennis",
    "winter",
    "forest",
    "flower",
    "rocket",
    "duck",
    "bike",
    "skate",
    "ball",
    "dogb",
    "beach",
    "horses",
];

export const verifyAvatarDefault = (avatarname) => {
    if (!avatarname) return avatarDefault;

    if (avatarname === "leaf") return leaf;
    if (avatarname === "basketball") return basketball;
    if (avatarname === "bonsai") return bonsai;
    if (avatarname === "chef") return chef;
    if (avatarname === "chess") return chess;
    if (avatarname === "doctor") return doctor;
    if (avatarname === "dog") return dog;
    if (avatarname === "electric_guitar") return electric_guitar;
    if (avatarname === "executive") return executive;
    if (avatarname === "fall") return fall;
    if (avatarname === "fish") return fish;
    if (avatarname === "flare") return flare;
    if (avatarname === "gerber_daisy") return gerber_daisy;
    if (avatarname === "golf") return golf;
    if (avatarname === "guest") return guest;
    if (avatarname === "guitar") return guitar;
    if (avatarname === "kitten") return kitten;
    if (avatarname === "morty") return morty;
    if (avatarname === "music") return music;
    if (avatarname === "robot") return robot;
    if (avatarname === "seastar") return seastar;
    if (avatarname === "shopping") return shopping;
    if (avatarname === "soccer") return soccer;
    if (avatarname === "sports") return sports;
    if (avatarname === "spring") return spring;
    if (avatarname === "summer") return summer;
    if (avatarname === "surf") return surf;
    if (avatarname === "tennis") return tennis;
    if (avatarname === "winter") return winter;
    if (avatarname === "forest") return forest;
    if (avatarname === "flower") return flower;
    if (avatarname === "rocket") return rocket;
    if (avatarname === "duck") return duck;
    if (avatarname === "bike") return bike;
    if (avatarname === "skate") return skate;
    if (avatarname === "ball") return ball;
    if (avatarname === "dogb") return dogb;
    if (avatarname === "beach") return beach;
    if (avatarname === "horses") return horses;

    return avatarname;
};
