import { Dispatch, FC, Fragment, SetStateAction, useState } from "react";
import styles from "./SideBar.module.scss";
import { adminSideBarItems } from "@/app/constants/admin-side-bar-items";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const SideBar: FC<Props> = ({ open, setOpen }) => {
  return (
    <Fragment>
      <button
        type="button"
        className={styles["open-btn"]}
        onClick={() => setOpen(true)}
      >
        <FaArrowRightLong />
      </button>
      <aside className={`${styles["side-bar"]} ${open ? styles.open : ""}`}>
        <div className={styles["close-btn-container"]}>
          <button type="button" onClick={() => setOpen(false)}>
            <FaArrowLeftLong />
          </button>
        </div>
        <Link href="/" className={styles["aside-title"]}>
          <h1 className="m-0">{process.env.NEXT_PUBLIC_PORTFOLIO_OWNER}</h1>
        </Link>
        <hr />
        <ul>
          {adminSideBarItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </aside>
    </Fragment>
  );
};

export default SideBar;
