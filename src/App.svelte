<script>
	import { setContext } from "svelte";
	import { blur, fade } from "svelte/transition";

	import Overview from "./slides/OverviewSlide.svelte";
	import Experience from "./slides/ExperienceSlide.svelte";
	import SoftSkills from "./slides/SoftSkillsSlide.svelte";
	import Playground from "./slides/PlaygroundSlide.svelte";
	import TechnicalSkills from "./slides/TechnicalSkillsSlide.svelte";

	import { slidesConfig } from "./slides/configuration";
	import { layoutConfig } from "./configuration";

	const slides = {
		["Overview"]: Overview,
		["Experience"]: Experience,
		["Tech Skills"]: TechnicalSkills,
		["Soft Skills"]: SoftSkills,
		["Playground"]: Playground,
	};

	let currentSlide = "Experience";
	$: currentSlideIndex = Object.keys(slides).indexOf(currentSlide);
	$: component = slides[currentSlide];

	function changeSlide(slide) {
		if (slide !== currentSlide) {
			currentSlide = "";
			setTimeout(() => {
				currentSlide = slide;
			}, slidesConfig.speed);
		}
	}

	function nextSlide() {
		if (currentSlideIndex < Object.keys(slides).length - 1) {
			const prevIndex = currentSlideIndex;
			currentSlide = "";
			setTimeout(() => {
				const nextIndex = prevIndex + 1;
				currentSlide = Object.keys(slides)[nextIndex];
			}, slidesConfig.speed);
		}
	}

	function prevSlide() {
		if (currentSlideIndex > 0) {
			const prevIndex = currentSlideIndex;
			currentSlide = "";
			setTimeout(() => {
				const nextIndex = prevIndex - 1;
				currentSlide = Object.keys(slides)[nextIndex];
			}, slidesConfig.speed);
		}
	}

	setContext("global", {
		changeSlide,
		inT: (node) => fade(node, { delay: 0, duration: slidesConfig.speed }),
		outT: (node) => blur(node, { delay: 0, duration: slidesConfig.speed }),
	});

	let lastCall = 0;
	window.addEventListener("keyup", (ev) => {
		if (lastCall + slidesConfig.speed > Date.now()) {
			return;
		}

		lastCall = Date.now();
		if (ev.code === "ArrowRight") {
			if (currentSlideIndex < Object.keys(slides).length - 1) {
				const prevIndex = currentSlideIndex;
				currentSlide = "";
				setTimeout(() => {
					const nextIndex = prevIndex + 1;
					currentSlide = Object.keys(slides)[nextIndex];
				}, slidesConfig.speed);
			}
		} else if (ev.code === "ArrowLeft") {
			if (currentSlideIndex > 0) {
				const prevIndex = currentSlideIndex;
				currentSlide = "";
				setTimeout(() => {
					const nextIndex = prevIndex - 1;
					currentSlide = Object.keys(slides)[nextIndex];
				}, slidesConfig.speed);
			}
		}
	});

	let isPrevHovered = false;
	const hoverPrev = () => (isPrevHovered = true);
	const unhoverPrev = () => (isPrevHovered = false);

	let isNextHovered = false;
	const hoverNext = () => (isNextHovered = true);
	const unhoverNext = () => (isNextHovered = false);

	$: prevArrowColor = isPrevHovered
		? layoutConfig.lightGrey
		: layoutConfig.mediumGrey;
	$: nextArrowColor = isNextHovered
		? layoutConfig.lightGrey
		: layoutConfig.mediumGrey;

	const topControls = Object.keys(slides);
</script>

<main>
	<div class="main-screen">
		<div class="top-controls">
			{#each topControls as control, i (i)}
				<div
					class="nav-control"
					on:click={() => changeSlide(control)}
					class:active={currentSlide === control}
				>
					{control}
				</div>
			{/each}
		</div>
		<div
			class="left-arrow"
			on:click={prevSlide}
			on:mouseenter={hoverPrev}
			on:mouseleave={unhoverPrev}
		>
			<svg
				fill={prevArrowColor}
				viewBox="-74 0 362 362.66667"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="m213.667969 
					181.332031c0 
					4.269531-1.28125 
					8.535157-3.628907 
					11.734375l-106.664062 
					160c-3.839844 
					5.761719-10.242188 
					9.601563-17.707031 
					9.601563h-64c-11.734375 
					0-21.335938-9.601563-21.335938-21.335938 
					0-4.265625 
					1.28125-8.53125 
					3.628907-11.730469l98.773437-148.269531-98.773437-148.265625c-2.347657-3.199218-3.628907-7.464844-3.628907-11.734375 
					0-11.730469 
					9.601563-21.332031 
					21.335938-21.332031h64c7.464843 
					0 
					13.867187 
					3.839844 
					17.707031 
					9.601562l106.664062 
					160c2.347657 
					3.199219 
					3.628907 
					7.464844 
					3.628907 
					11.730469zm0 
					0"
				/>
			</svg>
		</div>
		<div class="content">
			<svelte:component this={component} />
		</div>
		<div
			class="right-arrow"
			on:click={nextSlide}
			on:mouseenter={hoverNext}
			on:mouseleave={unhoverNext}
		>
			<svg
				fill={nextArrowColor}
				viewBox="-74 0 362 362.66667"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="m213.667969 
					181.332031c0 
					4.269531-1.28125 
					8.535157-3.628907 
					11.734375l-106.664062 
					160c-3.839844 
					5.761719-10.242188 
					9.601563-17.707031 
					9.601563h-64c-11.734375 
					0-21.335938-9.601563-21.335938-21.335938 
					0-4.265625 
					1.28125-8.53125 
					3.628907-11.730469l98.773437-148.269531-98.773437-148.265625c-2.347657-3.199218-3.628907-7.464844-3.628907-11.734375 
					0-11.730469 
					9.601563-21.332031 
					21.335938-21.332031h64c7.464843 
					0 
					13.867187 
					3.839844 
					17.707031 
					9.601562l106.664062 
					160c2.347657 
					3.199219 
					3.628907 
					7.464844 
					3.628907 
					11.730469zm0 
					0"
				/>
			</svg>
		</div>
		<div class="bottom-controls">
			{#each topControls as control, i (i)}
				<div
					class="nav-control"
					on:click={() => changeSlide(control)}
					class:active={currentSlide === control}
				>
					{i + 1}
				</div>
			{/each}
		</div>
	</div>
</main>

<style lang="scss">
	@import "./slides/styles.scss";

	main {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;

		.main-screen {
			width: 100%;
			height: 100%;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;

			.top-controls {
				width: 100%;
				height: 10%;
				display: flex;
				align-items: center;
				justify-content: center;

				.nav-control {
					width: 10%;
					padding: 1vh;
					cursor: pointer;
					color: $darkGrey;
					text-align: center;
					transition: $transitionTime;
					border-bottom: 3px solid $black;

					&.active {
						width: 15%;
						color: $lightGrey;
						transition: $transitionTime;
						border-bottom: 3px solid $darkRed;
					}

					&:hover {
						width: 12.5%;
						color: $mediumGrey;
						border-bottom: 3px solid $mediumGrey;
					}
				}
			}

			.left-arrow {
				width: 5%;
				height: 80%;
				display: flex;
				cursor: pointer;
				align-items: center;
				justify-content: center;

				svg {
					transform: rotate(180deg);
				}
			}

			.content {
				width: 85%;
				height: 80%;
			}

			.right-arrow {
				width: 5%;
				height: 80%;
				display: flex;
				cursor: pointer;
				align-items: center;
				justify-content: center;
			}

			.bottom-controls {
				width: 100%;
				height: 10%;
				display: flex;
				align-items: center;
				justify-content: center;

				.nav-control {
					width: 5%;
					padding: 1vh;
					cursor: pointer;
					color: $darkGrey;
					text-align: center;
					transition: $transitionTime;
					border-bottom: 3px solid $black;

					&.active {
						width: 10%;
						color: $lightGrey;
						transition: $transitionTime;
						border-bottom: 3px solid $darkRed;
					}

					&:hover {
						width: 7.5%;
						color: $mediumGrey;
						border-bottom: 3px solid $mediumGrey;
					}
				}
			}
		}
	}
</style>
