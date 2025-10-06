// FormPage.jsx
import CoordinateField from "./components/CoordinateField";
import styles from "./FormPage.module.css";
import { Icons } from "../../components/icons";
import { useState } from "react";
import Modal from "../../components/modal/Modal";

export default function FormPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.pageLayout}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Welcome aboard!</h2>
          <p className={styles.description}>Let’s create your journey.</p>
        </div>

        <form className={styles.form}>
          <CoordinateField
            label="Start Point"
            name="lon"
            value={"xx"}
            icon={<Icons.flag />}
            onChange={() => console.log("change")}
            onClick={() => setOpen(true)}
          />
          <CoordinateField
            label="End point"
            name="lon"
            value={"yy"}
            icon={<Icons.mapCheck />}
            onChange={() => console.log("change")}
          />
        </form>

        {open && (
          <Modal onClose={() => setOpen(false)}>
            <div className="modal-body">
              <div>
                <h3 className="modal-title">title</h3>
                <p className="modal-desc">desc</p>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button">Deactivate</button>
              <button type="button" onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
          </Modal>
        )}

        <button className={styles.button}>Go!</button>
      </div>
    </div>
  );
}
