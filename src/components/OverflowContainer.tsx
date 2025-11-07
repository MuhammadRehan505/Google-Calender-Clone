import {
  type ReactNode,
  type Key,
  useState,
  useRef,
  useLayoutEffect,
} from "react";

type OverflowContainerProps<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
  renderOverflow: (overflowAmount: number) => ReactNode;
  getKey: (item: T) => Key;
  className?: string;
};

export function OverflowContainer<T>({
  items,
  getKey,
  renderItem,
  renderOverflow,
  className,
}: OverflowContainerProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [overflowAmount, setOverflowAmount] = useState(0);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const containerElement = entries[0]?.target as HTMLElement;
      if (!containerElement) return;

      const children =
        containerElement.querySelectorAll<HTMLElement>("[data-item]");
      const overflowElement =
        containerElement.parentElement?.querySelector<HTMLElement>(
          "[data-overflow]"
        );

      // Temporarily hide overflow to measure
      if (overflowElement) overflowElement.style.display = "none";

      // Reset display for all items
      children.forEach((el) => el.style.removeProperty("display"));

      let amount = 0;

      for (let i = children.length - 1; i >= 0; i--) {
        if (containerElement.scrollHeight <= containerElement.clientHeight)
          break;
        amount = children.length - i;
        if (overflowElement) overflowElement.style.removeProperty("display");
      }

      setOverflowAmount(amount);
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [items]);

  return (
    <>
      <div ref={containerRef} className={className}>
        {items.map((item) => (
          <div data-item key={getKey(item)}>
            {renderItem(item)}
          </div>
        ))}
      </div>
      <div data-overflow>{renderOverflow(overflowAmount)}</div>
    </>
  );
}
