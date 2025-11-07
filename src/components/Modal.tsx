import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cc } from "../utils/cc";

export type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export function Modal({ children, isOpen, onClose }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const prevIsOpen = useRef<boolean | undefined>(undefined);
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  useLayoutEffect(() => {
    if (!isOpen && prevIsOpen.current) {
      setIsClosing(true);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;
  const container = document.querySelector("#modal-container");
  if (!container) return null;
  return createPortal(
    <div
      onAnimationEnd={() => setIsClosing(false)}
      className={cc("modal", isClosing && "closing")}
    >
      <div className="overlay" onClick={onClose} />
      <div className="modal-body" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    container
  );
}
