let currentIndex: number = 0

function moveGallery (direction: number): void {
  const gallery = document.querySelector('.gallery') as HTMLElement | null

  if (!gallery) {
    console.error('Gallery element not found')
    return
  }

  const totalItems: number = gallery.children.length
  const visibleItems: number = 2

  currentIndex += direction

  if (currentIndex < 0) {
    currentIndex += totalItems - 1
  } else {
    currentIndex = currentIndex % visibleItems
  }

  const offset: number = -(currentIndex * 50) // Each item is 50% of the container width
  gallery.style.transform = `translateX(${offset}%)`
}
