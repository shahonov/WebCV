<script>
	import { setContext } from "svelte";
	import { slide, blur } from "svelte/transition";

	import Overview from "./slides/OverviewSlide.svelte";
	import Experience from "./slides/ExperienceSlide.svelte";
	import SoftSkills from "./slides/SoftSkillsSlide.svelte";
	import Playground from "./slides/PlaygroundSlide.svelte";
	import TechnicalSkills from "./slides/TechnicalSkillsSlide.svelte";

	import { slidesConfig } from "./slides/configuration";

	const slides = {
		overview: Overview,
		experience: Experience,
		techSkills: TechnicalSkills,
		softSkills: SoftSkills,
		playground: Playground,
	};

	let currentSlide = "overview";
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
		inT: (node) => slide(node, { delay: 0, duration: slidesConfig.speed }),
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
</script>

<main>
	<div class="main-screen">
		<svelte:component this={component} />
	</div>
</main>

<style>
	main {
		width: 99vw;
		height: 98vh;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid black;
	}

	.main-screen {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
