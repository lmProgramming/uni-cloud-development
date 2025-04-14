let currentIndex: number = 0;

function moveGallery(direction: number): void {
  const gallery = document.querySelector(".gallery") as HTMLElement | null;
  const leftArrow = document.querySelector(
    ".left-arrow"
  ) as HTMLButtonElement | null;
  const rightArrow = document.querySelector(
    ".right-arrow"
  ) as HTMLButtonElement | null;

  if (!gallery || !leftArrow || !rightArrow) {
    console.error("Gallery or arrow elements not found");
    return;
  }

  const totalItems: number = gallery.children.length;

  let visibleItems: number;
  if (window.innerWidth <= 768) {
    visibleItems = 1;
  } else {
    visibleItems = 2;
  }

  if (totalItems <= visibleItems) {
    leftArrow.style.display = "none";
    rightArrow.style.display = "none";
    gallery.style.transform = "translateX(0%)"; // Ensure it's reset if previously scrolled
    return;
  } else {
    leftArrow.style.display = "block";
    rightArrow.style.display = "block";
  }

  const maxIndex: number = Math.max(0, totalItems - visibleItems);

  currentIndex += direction;

  if (currentIndex < 0) {
    currentIndex = 0;
  } else if (currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }

  const itemWidthPercent: number = 100 / visibleItems;
  const offset: number = -(currentIndex * itemWidthPercent);

  gallery.style.transform = `translateX(${offset}%)`;

  leftArrow.disabled = currentIndex === 0;
  rightArrow.disabled = currentIndex === maxIndex;
}

window.addEventListener("resize", () => {
  currentIndex = 0;
  moveGallery(0);
});

document.addEventListener("DOMContentLoaded", () => {
  moveGallery(0);
});
