<script>
    import { onMount, getContext } from "svelte";
    import { slidesConfig } from "./configuration";

    const globals = getContext("global");
    const { inT, outT } = globals;

    onMount(() => {
        slidesConfig.loadParallax();
    });
</script>

<section in:inT out:outT class="slide">
    <div class="technical-skills-slide">
        <h1 class="parallax" speed="7" sign="-">Technical skills slide</h1>
        <h1 class="parallax" speed="10" sign="+">Technical skills slide</h1>
        <h1 class="parallax" speed="15" sign="-">Technical skills slide</h1>
        <h1 class="parallax" speed="2" sign="+">Technical skills slide</h1>
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

        .technical-skills-slide {
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
