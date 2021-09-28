<script>
    import { getContext } from "svelte";

    const globals = getContext("global");

    const { inT, outT } = globals;
</script>

<section in:inT out:outT class="slide">
    <div class="technical-skills-slide">
        <h1>Technical skills slide</h1>
    </div>
</section>

<style>
    .slide {
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .technical-skills-slide {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ccc;
    }
</style>
