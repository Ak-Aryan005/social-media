import { Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}

export default function InputField({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  autoComplete,
}: InputFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-foreground"
      >
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <Field
        as="input"
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full px-4 py-3 bg-muted text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder:text-muted-foreground"
      />
      <ErrorMessage name={name}>
        {(msg) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-destructive text-sm"
          >
            {msg}
          </motion.div>
        )}
      </ErrorMessage>
    </motion.div>
  );
}
