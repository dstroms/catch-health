import { useEffect, useState } from "react";
import { useAppointmentsApi } from "./useAppointmentsApi";
import styles from "./App.module.css";
import Form from "./components/form";
import {
  convertDateToTimestamp,
  convertTimestampToString,
} from "./utils/timestamp-converters";
import { ExistingAppointments } from "./App.types";

function App() {
  const API = useAppointmentsApi();

  const [existingAppointments, setExistingAppointments] = useState<
    ExistingAppointments[]
  >([]);
  const [errorText, setErrorText] = useState<string | null>(null);

  const onSubmit = async (formData: Record<string, any>) => {
    setErrorText(null);

    // check if appointment already exists. If so, show an error message and return.
    const appointmentConflict = existingAppointments.find(
      (appointment) =>
        convertDateToTimestamp(formData.startTime) === appointment.startTime ||
        convertDateToTimestamp(formData.endTime) === appointment.endTime
    );
    if (appointmentConflict) {
      setErrorText(
        "Someone already has an appointment at that time. Please select another time and try again."
      );
      return;
    }
    try {
      await API.post({
        name: formData.name,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });
    } catch (error) {
      setErrorText("Error submitting form. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const appointments = await API.get();
      setExistingAppointments(appointments.appointments);
    };
    fetchData();
  }, [API]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.headerText}>Appointments</h1>
      </header>
      <main className={styles.content}>
        {errorText && (
          <div className={styles.error} aria-live="polite">
            <p>{errorText}</p>
          </div>
        )}
        <Form onSubmit={onSubmit} />

        <section className={styles.appointmentsContainer}>
          <h2 className={styles.appointmentsTitle}>Existing Appointments</h2>
          <ul className={styles.appointments}>
            <li className={styles.appointment}>
              {existingAppointments.map((appointment) => (
                <div key={appointment.startTime + appointment.endTime}>
                  <p>
                    <b>{appointment.name}</b>
                  </p>
                  <p>
                    {convertTimestampToString(appointment.startTime)} -{" "}
                    {convertTimestampToString(appointment.endTime)}
                  </p>
                </div>
              ))}
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
