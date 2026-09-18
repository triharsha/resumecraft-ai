const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  required = false,
  autoComplete,
  helperText,
}) => {
  const inputId =
    `field-${name}`;

  const errorId =
    `${inputId}-error`;

  const helperId =
    `${inputId}-helper`;

  const describedBy = error
    ? errorId
    : helperText
      ? helperId
      : undefined;

  return (
    <div
      className="
        flex
        min-w-0
        flex-col
      "
    >
      <label
        htmlFor={inputId}
        className="
          flex
          h-4
          shrink-0
          items-center
          gap-1

          text-xs
          font-black
          leading-4

          text-zinc-700
          dark:text-zinc-300
        "
      >
        {label}

        {required && (
          <span
            className="
              text-rose-500
            "
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      <input
        id={inputId}
        type={type}
        placeholder={
          placeholder
        }
        autoComplete={
          autoComplete
        }
        aria-required={
          required ||
          undefined
        }
        aria-invalid={
          Boolean(error)
        }
        aria-describedby={
          describedBy
        }
        {...register(name)}
        className={`
          mt-2

          h-12
          w-full
          min-w-0
          shrink-0

          rounded-xl

          border

          bg-white
          dark:bg-zinc-950

          px-3.5

          text-sm

          text-zinc-950
          dark:text-white

          outline-none

          transition-all

          placeholder:text-zinc-400
          dark:placeholder:text-zinc-600

          ${
            error
              ? `
                  border-rose-400

                  focus:border-rose-500
                  focus:ring-4
                  focus:ring-rose-500/10

                  dark:border-rose-700
                `
              : `
                  border-stone-200
                  dark:border-zinc-800

                  hover:border-stone-300
                  dark:hover:border-zinc-700

                  focus:border-violet-500
                  focus:ring-4
                  focus:ring-violet-500/10
                `
          }
        `}
      />

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="
            mt-1.5

            text-xs
            font-semibold

            text-rose-600
            dark:text-rose-400
          "
        >
          {error.message}
        </p>
      ) : helperText ? (
        <p
          id={helperId}
          className="
            mt-1.5

            text-xs
            leading-5

            text-zinc-400
            dark:text-zinc-500
          "
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default FormField;