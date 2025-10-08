import CoordinateField from "../../components/coordinate-field/CoordinateField";
import styles from "./FormPage.module.css";
import { Icons } from "../../components/icons";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import Map from "../../components/map/Map";
import { useNavigate } from "react-router-dom";

export default function FormPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState<[number, number][]>([[40.1516, 25.8805]]);
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
  const handleAddPoint = () => {
    const lastPoint = route[route.length - 1];

    const newPoint: [number, number] = [
      Number((lastPoint[0] + 0.015).toFixed(4)),
      Number(lastPoint[1].toFixed(4)),
    ];

    const newRoute: [number, number][] = [...route, newPoint];

    setTempRoute(newRoute);
    setOpen(true);
  };

  const handleGo = () => {
    navigate("/simulation"); // ✅ yönlendirme burası
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
          {route.slice(1).map((r, index) => (
            <CoordinateField
              key={`${r[0]}, ${r[1]}`}
              label={`Way Point ${index + 1}`}
              name="point1"
              value={`${r[0]}, ${r[1]}`}
              icon={<Icons.mapCheck />}
              onChange={() => console.log("change")}
              onClick={handleOpenModal}
            />
          ))}
          <div className={styles.addPoint} onClick={handleAddPoint}>
            <Icons.add />
            <span>Add Way Point</span>
          </div>
        </form>
        {open && (
          <Modal onClose={handleCancel}>
            <div className={styles.modalBody}>
              <div className={styles.modalHeader}>
                <h3>Rota düzenle</h3>
                <p>Noktaları sürükleyerek konumlarını değiştir.</p>
              </div>

              <div>
                <Map
                  route={tempRoute}
                  onRouteChange={(newRoute) => setTempRoute(newRoute)}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="button" onClick={handleApprove}>
                  Approve new route
                </button>
              </div>
            </div>
          </Modal>
        )}
        <button
          disabled={route.length < 2}
          className={styles.button}
          onClick={handleGo}
        >
          Go!
        </button>
      </div>
    </div>
  );
}
