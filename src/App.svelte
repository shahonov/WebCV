<script>
	import { setContext } from "svelte";
	import { blur, fade } from "svelte/transition";

	import Overview from "./slides/OverviewSlide.svelte";
	import Experience from "./slides/ExperienceSlide.svelte";
	import SoftSkills from "./slides/SoftSkillsSlide.svelte";
	import Playground from "./slides/PlaygroundSlide.svelte";
	import TechnicalSkills from "./slides/TechnicalSkillsSlide.svelte";

	import { slidesConfig } from "./slides/configuration";

	const slides = {
		["Overview"]: Overview,
		["Experience"]: Experience,
		["Tech Skills"]: TechnicalSkills,
		["Soft Skills"]: SoftSkills,
		["Playground"]: Playground,
	};

	let currentSlide = "Overview";
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
		<div class="left-arrow" />
		<div class="content">
			<svelte:component this={component} />
		</div>
		<div class="right-arrow" />
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
	@import "./slides/configuration.scss";

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
					cursor: pointer;
					padding: 1vh 2vw;
					color: $darkGrey;
					transition: $transitionTime;
					border-bottom: 3px solid $black;

					&.active {
						color: $lightGrey;
						transition: $transitionTime;
						border-bottom: 3px solid $darkRed;
					}

					&:hover {
						color: $mediumGrey;
						border-bottom: 3px solid $mediumGrey;
					}
				}
			}

			.left-arrow {
				width: 5%;
				height: 80%;
			}

			.content {
				width: 90%;
				height: 80%;
			}

			.right-arrow {
				width: 5%;
				height: 80%;
			}

			.bottom-controls {
				width: 100%;
				height: 10%;
				display: flex;
				align-items: center;
				justify-content: center;

				.nav-control {
					cursor: pointer;
					padding: 1vh 2vw;
					color: $mediumGrey;
					transition: $transitionTime;
					border-bottom: 3px solid $black;

					&.active {
						color: $lightGrey;
						transition: $transitionTime;
						border-bottom: 3px solid $darkRed;
					}

					&:hover {
						color: $mediumGrey;
						border-bottom: 3px solid $mediumGrey;
					}
				}
			}
		}
	}
</style>
