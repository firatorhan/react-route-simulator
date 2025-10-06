import CoordinateField from "../../components/coordinate-field/CoordinateField";
import styles from "./FormPage.module.css";
import { Icons } from "../../components/icons";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import Map from "../../components/map/Map";

export default function FormPage() {
  const [open, setOpen] = useState(false);

  const [route, setRoute] = useState<[number, number][]>([
    [41.015137, 28.97953],
    [41.025137, 28.98953],
    [41.035137, 28.97953],
  ]);
  const [tempRoute, setTempRoute] = useState<[number, number][]>([]);

  const handleOpenModal = () => {
    setTempRoute(route);
    setOpen(true);
  };

  const handleApprove = () => {
    setRoute(tempRoute);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

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
            name="start"
            value={`${route[0][0]}, ${route[0][1]}`}
            icon={<Icons.flag />}
            onChange={() => console.log("change")}
            onClick={handleOpenModal}
          />
          <CoordinateField
            label="Way Point 1"
            name="point1"
            value={`${route[1][0]}, ${route[1][1]}`}
            icon={<Icons.flag />}
            onChange={() => console.log("change")}
            onClick={handleOpenModal}
          />
          <CoordinateField
            label="Way Point 2"
            name="point2"
            value={`${route[2][0]}, ${route[2][1]}`}
            icon={<Icons.mapCheck />}
            onChange={() => console.log("change")}
          />
        </form>

        {open && (
          <Modal onClose={handleCancel}>
            <div className="modal-body">
              <div>
                <h3 className="modal-title">Rota düzenle</h3>
                <p className="modal-desc">
                  Noktaları sürükleyerek konumlarını değiştir.
                </p>
              </div>

              <div>
                <Map
                  route={tempRoute}
                  onRouteChange={(newRoute) => setTempRoute(newRoute)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleApprove}>
                  Approve new route
                </button>
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}

        <button className={styles.button}>Go!</button>
      </div>
    </div>
  );
}
