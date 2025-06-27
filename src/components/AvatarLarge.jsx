import React, { useContext, useEffect, useState } from 'react';
import statusFrames from '../imports/statusFrames';
import { AuthContext } from '../context/AuthContext';
import usertiles from '../imports/usertiles';

const AvatarLarge = ({ image, status }) => {
  const { user } = useContext(AuthContext);

  const [userStatus, setUserStatus] = useState(statusFrames.OnlineSmall);
  const [contactStatus, setContactStatus] = useState(statusFrames.OnlineSmall);
  const [contactAvatar, setContactAvatar] = useState("");

  useEffect(() => {
    if (user) {
      switch (user.status) {
        case 'online':
          setUserStatus(statusFrames.OnlineLarge);
          break;
        case 'offline':
          setUserStatus(statusFrames.OfflineLarge);
          break;
        case 'away':
          setUserStatus(statusFrames.AwayLarge);
          break;
        case 'busy':
          setUserStatus(statusFrames.BusyLarge);
          break;
        default:
          setUserStatus(statusFrames.OfflineLarge);
          break;
      }

      switch (status) {
        case 'online':
          setContactStatus(statusFrames.OnlineLarge);
          break;
        case 'offline':
          setContactStatus(statusFrames.OfflineLarge);
          break;
        case 'away':
          setContactStatus(statusFrames.AwayLarge);
          break;
        case 'busy':
          setContactStatus(statusFrames.BusyLarge);
          break;
        default:
          setContactStatus(statusFrames.OnlineLarge);
          break;
      }

    } else {
      setUserStatus(statusFrames.OfflineLarge);
    }
  }, [user.status]);

  useEffect(() => {
    if (image === "default") {
      setContactAvatar("./assets/usertiles/default.png")

    } else {
      setContactAvatar(usertiles[image])
      console.log(usertiles[image])
    }
  }, [user.avatar]);

  return (
    <div className="h-28 w-28">
      <img className="absolute ml-[9px] mt-[8px] w-24 rounded-sm" src={image ? contactAvatar : usertiles[user.avatar]} alt="Avatar" />
      <img className="absolute ml-[-10px] mt-[-7px]" src={status ? contactStatus : userStatus} alt="Frame" />
    </div>
  );
};

export default AvatarLarge;
