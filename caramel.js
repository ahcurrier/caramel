(() => {

	const caramel = $c => {

		var $viewWrap = $c.querySelector('.caramel-view'),
			$view = $c.querySelector('.caramel-view > div'),
			$items = $c.querySelectorAll('.item'),
			$dotNav = $c.querySelector('.caramel-dots-wrap'),
			$caption = $c.querySelector('.caramel-caption'),
			$dots,
			isSwiping,
			touchStartX,
			swipeX,
			viewWidth,
			items = [],
			itemCount,
			dotCount = $items.length,
			initialCount,
			startCount,
			$itemsWrap,
			itemsHtml,
			nxInterval,

			currentIndex,
			nextIndex,
			prevIndex,

			boundedIndex = index => {
				return (itemCount + index) % itemCount;
			},

			oldIndex,

			goIndex = index => {
				if (!$c.classList.contains('updating')) {
					currentIndex = boundedIndex(index);
					nextIndex = boundedIndex(currentIndex + 1);
					prevIndex = boundedIndex(currentIndex - 1);
					console.log('go: ' + prevIndex + ' < ' + currentIndex + ' > ' + nextIndex + ', (was ' + oldIndex + '), delta: ' + (index - oldIndex));
					updateDisplay(index - oldIndex);
					oldIndex = currentIndex;
				}
			},

			goNext = () => {
				goIndex(currentIndex + 1);
			},

			goPrev = () => {
				goIndex(currentIndex - 1);
			},

			updateDisplay = delta => {

				var $panels;

				if (delta !== 0) {

					$dots.forEach(d => { d.classList.remove('current-dot'); });
					$dots[currentIndex % dotCount].classList.add('current-dot');
					$c.classList.add('will-update');

					$panels = $view.children;

					if (delta > 0) {

						$panels[4].innerHTML = items[nextIndex].display;
						
						if (delta > 1) {
							$panels[3].innerHTML = items[currentIndex].display;
						}
						$c.classList.add('updating', 'updating-forward');

						window.setTimeout(() => {
							$c.classList.remove('will-update');
							$c.classList.remove('updating', 'updating-forward', 'updating-backward');
							if (delta > 1) {
								$panels[2].innerHTML = items[prevIndex].display;
							}
							$view.appendChild($panels[0]);
						}, 775);

					} else {

						$panels[0].innerHTML = items[prevIndex].display;
						if (delta < -1) {
							$panels[1].innerHTML = items[currentIndex].display;
						}
						$c.classList.add('updating', 'updating-backward');
						window.setTimeout(() => {
							$c.classList.remove('will-update');
							$c.classList.remove('updating', 'updating-forward', 'updating-backward');
							if (delta < -1) {
								$panels[2].innerHTML = items[nextIndex].display;
							}
							$view.prepend($panels[4]);
						}, 775);
					}

					$caption.innerHTML = '';
					$caption.appendChild(items[currentIndex].$cap);
				}

			},

			item = ($item, n) => {

				var $i = $item.querySelector('img'),
					$cap = $item.querySelector('.item-caption'),
					itemType = $i.getAttribute('data-type'),
					$dot = document.createElement('a'),
					q, display, $cap, dotTitle;
					
				$dot.style.setProperty('background-image', 'url(' + $i.getAttribute('data-src') + ')');

				if ($i.hasAttribute('data-title')) {
					let dotTitle = document.createElement('h6'); 
					dotTitle.innerHTML = $i.getAttribute('data-title'); console.log(dotTitle);
					$dot.appendChild(dotTitle);
					$cap.prepend(dotTitle);
				}

				if (itemType === 'image') {
					display = '<div style="background-image:url(' + $i.getAttribute('data-src-large') + ')">';
				} else if (itemType === 'vimeo' || itemType === 'youtube') {
					display = '<iframe src="' + $i.getAttribute('data-src-large') + ')" frameborder="0" webkitallowfullscreen="webkitAllowFullScreen" mozallowfullscreen="mozallowfullscreen" allowfullscreen="allowFullScreen"></iframe>';
				}
				
				if (n < dotCount) {
					$dot.addEventListener('click', () => { goIndex(n); });
					$dotNav.append($dot);
				}

				return { display, $cap };

			};
		
		if ($items.length < 3) {
			$itemsWrap = $c.querySelector('.caramel-items');
			itemsHtml = $itemsWrap.innerHTML;
			initialCount = $items.length;
			startCount = initialCount;
			while (startCount < 3) {
				$itemsWrap.append(itemsHtml);
				startCount += initialCount;
			}
			$items = $c.querySelectorAll('.item');			
		}
		
		itemCount = $items.length;
		currentIndex = itemCount - 1;
		oldIndex = boundedIndex(currentIndex - 1);

		$items.forEach(($item, index) => {
			items.push(item($item, index));
		});

		$dots = $dotNav.querySelectorAll('a');
		$c.querySelector('.next').addEventListener('click', goNext);
		$c.querySelector('.prev').addEventListener('click', goPrev);

		$view.addEventListener('touchstart', e => {
			var t;
			if (!$c.classList.contains('updating')) {
				$c.classList.remove('will-update');
				t = e.changedTouches[0];
				isSwiping = true;
				viewWidth = $view.offsetWidth / 100;
				touchStartX = t.pageX;
				e.preventDefault();
			}
		});

		$view.addEventListener('touchmove', e => {
			var t;
			if (isSwiping) {
				t = e.changedTouches[0];
				swipeX = (t.pageX - touchStartX) / viewWidth - 40;
				$viewWrap.style.setProperty('transform', 'translateX(' + swipeX + '%)');
				e.preventDefault();
			}
		});

		$view.addEventListener('touchend', e => {
			var t;
			if (isSwiping) {
				$c.classList.add('will-update');
				$viewWrap.style = '';
				if (swipeX < -48) {
					goNext();
				} else if (swipeX > -32) {
					goPrev();
				}
				isSwiping = false;
				e.preventDefault();
			}
		});

		goNext();

	};

	document.querySelectorAll('.caramel').forEach(caramel);

})();







