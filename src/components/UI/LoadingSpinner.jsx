import { motion } from "framer-motion";
import "./LoadingSpinner.css";

export default function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <motion.div
        className="spinner"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
      />
    </div>
  );
}
