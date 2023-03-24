import { useEffect, useState } from "react";
import { useAppointmentsApi } from "./useAppointmentsApi";
import styles from "./App.module.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type ExistingAppointments = {
  name: string;
  startTime: number;
  endTime: number;
};

const schema = yup.object().shape({
  name: yup.string().required(),
  startTime: yup.string().required(),
  endTime: yup.string().required(),
});

const convertDateToTimestamp = (date: Date) => {
  return new Date(date).getTime();
};

const convertTimestampToString = (timestamp: number): string => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formattedDate = date.toLocaleString("en-US", options);
  return formattedDate;
};

function App() {
  const API = useAppointmentsApi();
  const { register, watch, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const [existingAppointments, setExistingAppointments] = useState<
    ExistingAppointments[]
  >([]);
  const [errorText, setErrorText] = useState<string | null>(null);

  const canUserSubmitForm = Boolean(
    watch("name") && watch("startTime") && watch("endTime")
  );

  const onSubmit = async (formData: Record<string, any>) => {
    setErrorText(null);

    // check if appointment already exists. If so, show an error message and return.
    const appointmentConflict = existingAppointments.find(
      (appointment) =>
        convertDateToTimestamp(formData.startTime) >= appointment.startTime ||
        convertDateToTimestamp(formData.endTime) <= appointment.endTime
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
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <h2 className={styles.formTitle}>Create an appointment</h2>
          <label className={styles.label}>
            <span className={styles.labelText}>Your name</span>
            <input
              className={styles.input}
              type="text"
              placeholder="John Smith"
              {...register("name")}
              required
            />
          </label>
          <label className={styles.label}>
            <span className={styles.labelText}>Start Time</span>
            <input
              className={styles.input}
              type="datetime-local"
              {...register("startTime")}
              required
            />
          </label>
          <label className={styles.label}>
            <span className={styles.labelText}>End Time</span>
            <input
              className={styles.input}
              type="datetime-local"
              {...register("endTime")}
              required
            />
          </label>
          <button
            type="submit"
            className={styles.button}
            disabled={!canUserSubmitForm}
          >
            Submit Request
          </button>
        </form>
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
