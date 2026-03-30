import React, { useEffect, useState } from "react";
import { FaLinkedin, FaUserCircle } from "react-icons/fa";
import "./ProfileCard.css";

const ProfileCard = ({ name, image, linkedin }) => {
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [image]);

  const handleOpenLinkedIn = (e) => {
    e.stopPropagation(); // prevents bubbling
    if (linkedin) {
      window.open(linkedin, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="profile-card">
      <div
        className="profile-card-image-wrapper"
        onClick={handleOpenLinkedIn}
        style={{ cursor: linkedin ? "pointer" : "default" }}
      >
        {image && !hasImageError ? (
          <img
            src={image}
            alt={name}
            className="profile-card-image"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <FaUserCircle className="profile-card-default-icon" />
        )}
      </div>

      <div className="profile-card-info">
        <span className="profile-card-name">{name}</span>

        {linkedin && (
          <span
            className="profile-card-linkedin-icon"
            onClick={handleOpenLinkedIn}
            style={{ cursor: "pointer" }}
          >
            <FaLinkedin />
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;