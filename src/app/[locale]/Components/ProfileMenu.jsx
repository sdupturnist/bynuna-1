"use client";
import { accountMenus } from "../Utils/variables";
import AccountMenu from "./AccountMenu";
import Logout from "./Logout";

export default function ProfileMenu({locale}) {
  return (
    <div className="lg:border border-t border-border pb-5 sm:pb-0">
      {accountMenus &&
        accountMenus.map((item, index) => (
          <AccountMenu
          locale={locale}
            key={index}
            icon={item?.icon}
            title={item?.label}
            desc="View and manage your orders."
            url={item?.url}
          />
        ))}
      <Logout />
    </div>
  );
}
