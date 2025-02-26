"use client";

import { useAuthContext } from "../../Context/authContext";
import { apiUrl, getTranslation, siteName } from "../../Utils/variables";
import { useState } from "react";
import { useJwt } from "../../Context/jwtContext";
import FloatingLabelInput from "../FloatingLabelInput";
import { useLanguageContext } from "../../Context/LanguageContext";
import Alerts from "../Alerts";
import { useParams, useRouter } from "next/navigation";

export default function ChangePasswordForm() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { translation } = useLanguageContext();

  const { userData } = useAuthContext();

  const { token } = useJwt();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validate that the new passwords match
    if (newPassword !== confirmPassword) {
      setError(
        getTranslation(
          translation[0]?.translations,
          "New passwords do not match!",
          locale || "en"
        )
      );
      return;
    }

    // Check if the new password is at least 6 characters
    if (newPassword.length < 6) {
      setError(
        getTranslation(
          translation[0]?.translations,
          "New password must be at least 6 characters long.",
          locale || "en"
        )
      );
      return;
    }

    setError("");

    const success = await changePassword(
      userData?.id,
      oldPassword,
      newPassword
    );

    if (success) {
      setLoading(false);
      setMessage(
        getTranslation(
          translation[0]?.translations,
          "Password changed successfully!",
          locale || "en"
        )
      );
    }
  };

  const changePassword = async (userId, oldPassword, newPassword) => {
    // const token = localStorage.getItem("jwt_token");

    const response = await fetch(
      `${apiUrl}wp-json/custom/v1/change-password/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      setMessage(data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return true;
    } else {
      const errorData = await response.json();
      setError(errorData.message);
      return false;
    }
  };

  return (
    <div className="grid gap-5">
      {message && <Alerts title={message} status="green" />}
      {error && <Alerts title={error} status="red" />}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 lg:max-w-[500px] w-full">
          <FloatingLabelInput
            label={getTranslation(
              translation[0]?.translations,
              "Current Password",
              locale || "en"
            )}
            type="password"
            id="oldPassword"
            value={oldPassword}
            className="input"
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <FloatingLabelInput
            label={getTranslation(
              translation[0]?.translations,
              "New Password",
              locale || "en"
            )}
            type="password"
            id="newPassword"
            value={newPassword}
            className="input"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <FloatingLabelInput
            label={getTranslation(
              translation[0]?.translations,
              "Confirm New Password",
              locale || "en"
            )}
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            className="input"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div>
            <button
              type="submit"
              className="btn btn-primary btn-mobile-full w-fit"
              disabled={loading}
            >
              {loading
                ? getTranslation(
                    translation[0]?.translations,
                    "Submiting...",
                    locale || "en"
                  )
                : getTranslation(
                    translation[0]?.translations,
                    "Change Password",
                    locale || "en"
                  )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
