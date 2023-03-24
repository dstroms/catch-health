import styles from "./../App.module.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  name: yup.string().required(),
  startTime: yup.string().required(),
  endTime: yup.string().required(),
});

type FormProps = {
  onSubmit: (formData: Record<string, any>) => Promise<void>;
};

function Form({ onSubmit }: FormProps) {
  const { register, watch, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const canUserSubmitForm = Boolean(
    watch("name") && watch("startTime") && watch("endTime")
  );

  return (
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
  );
}

export default Form;
