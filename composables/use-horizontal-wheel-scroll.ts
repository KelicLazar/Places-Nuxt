export function useHorizontalWheelScroll(scrollEl: Ref<HTMLElement | null>) {
  let isScrolling = false;
  let targetScroll = 0;
  let animationFrame: number;
  let added = false;
  const smoothScroll = () => {
    const el = scrollEl.value;
    if (!el)
      return;

    const currentScroll = el.scrollLeft;
    const distance = targetScroll - currentScroll;
    const step = distance * 0.1;

    if (Math.abs(distance) < 1) {
      el.scrollLeft = targetScroll;
      isScrolling = false;
      return;
    }

    el.scrollLeft += step;
    animationFrame = requestAnimationFrame(smoothScroll);
  };
  const handleWheel = (event: WheelEvent) => {
    if (!scrollEl.value)
      return;

    event.preventDefault();
    targetScroll += event.deltaY;

    const el = scrollEl.value;
    targetScroll = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, targetScroll));

    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(smoothScroll);
    }
  };

  watchEffect((onCleanup) => {
    const el = scrollEl.value;
    if (!el || added)
      return;

    el.addEventListener("wheel", handleWheel, { passive: false });
    added = true;

    onCleanup(() => {
      el.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(animationFrame);
      added = false;
    });
  });
}
