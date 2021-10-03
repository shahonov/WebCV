<script>
    import { onMount, getContext, onDestroy } from "svelte";
    import { slidesConfig } from "./configuration";

    const globals = getContext("global");
    const { inT, outT } = globals;

    onMount(() => {
        slidesConfig.loadParallax();
    });

    onDestroy(() => {
        slidesConfig.removeParallax();
    });
</script>

<section in:inT out:outT class="slide">
    <div class="soft-skills-slide">
        <h1 class="parallax">Soft skills slide</h1>
        <h1 class="parallax">Soft skills slide</h1>
        <h1 class="parallax">Soft skills slide</h1>
        <h1 class="parallax">Soft skills slide</h1>
    </div>
</section>

<style lang="scss">
    @import "./styles.scss";

    .slide {
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .soft-skills-slide {
            width: 100%;
            height: 100%;
            opacity: 0.95;
            display: flex;
            flex-wrap: wrap;
            color: $mediumGrey;
            align-items: center;
            justify-content: center;
            background-color: $black;

            .parallax {
                width: 100%;
                text-align: center;
            }
        }
    }
</style>
