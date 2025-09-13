import { motion } from "framer-motion";
import "./ErrorBlock.css";

export default function ErrorBlock({ title, message }) {
  return (
    <motion.div
      className="error-block"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="error-title">{title}</h2>
      <p className="error-message">{message}</p>
    </motion.div>
  );
}
