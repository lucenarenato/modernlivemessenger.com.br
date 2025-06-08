import avatarDefault from "./assets/avatars/default.png";
import image from "./assets/avatars/image.png"
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

export const avatarMap = {
    image,
    leaf,
    basketball,
    bonsai,
    chef,
    chess,
    doctor,
    dog,
    electric_guitar,
    executive,
    fall,
    fish,
    flare,
    gerber_daisy,
    golf,
    guest,
    guitar,
    kitten,
    morty,
    music,
    robot,
    seastar,
    shopping,
    soccer,
    sports,
    spring,
    summer,
    surf,
    tennis,
    winter,
    forest,
    flower,
    rocket,
    duck,
    bike,
    skate,
    ball,
    dogb,
    beach,
    horses,
};

export const verifyAvatar = (avatarNameOrUrl) => {
    if (!avatarNameOrUrl) return avatarDefault;

    if (avatarNameOrUrl.startsWith("http") || avatarNameOrUrl.startsWith("/")) {
        return avatarNameOrUrl;
    }

    return avatarMap[avatarNameOrUrl] || avatarDefault;
};