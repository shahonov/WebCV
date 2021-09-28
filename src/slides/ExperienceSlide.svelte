<script>
    import { getContext } from "svelte";

    const globals = getContext("global");

    const { inT, outT } = globals;
</script>

<section in:inT out:outT class="slide">
    <div class="experience-slide">
        <h1>Experience slide</h1>
    </div>
</section>

<style>
    .slide {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .experience-slide {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ddd;
    }
</style>
