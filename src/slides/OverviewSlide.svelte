<script>
    import { getContext } from "svelte";

    const globals = getContext("global");

    const { inT, outT } = globals;
</script>

<section in:inT out:outT class="slide">
    <div class="overview-slide">
        <h1>Overview slide</h1>
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

    .overview-slide {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ccc;
    }
</style>
