<script>
    import { getContext } from "svelte";

    import SbTech from "./experiences/SBTech.svelte";
    import MotionSoftware from "./experiences/MotionSoftware.svelte";
    import Clustermarket from "./experiences/Clustermarket.svelte";

    import { slidesConfig } from "./configuration";

    const tabs = {
        ["SBTech"]: SbTech,
        ["Motion Software"]: MotionSoftware,
        ["Clustermarket"]: Clustermarket,
    };

    let currentTab = "Clustermarket";
    $: component = tabs[currentTab];

    function changeTab(tab) {
        if (tab !== currentTab) {
            currentTab = "";
            setTimeout(() => {
                currentTab = tab;
            }, slidesConfig.speed);
        }
    }

    const globals = getContext("global");
    const { inT, outT } = globals;
</script>

<section in:inT out:outT class="slide">
    <div class="experience-slide">
        <nav class="tabs">
            {#each Object.keys(tabs) as tab, i (i)}
                <h4
                    class="tab"
                    on:click={() => changeTab(tab)}
                    class:active={tab === currentTab}
                >
                    {tab}
                </h4>
            {/each}
        </nav>
        <div class="content">
            <svelte:component this={component} />
        </div>
    </div>
</section>

<style lang="scss">
    @import "./styles.scss";

    .slide {
        width: 100%;
        height: 100%;

        .experience-slide {
            width: 100%;
            height: 100%;
            opacity: 0.95;
            display: flex;
            flex-wrap: wrap;
            color: $mediumGrey;
            background-color: $black;

            nav.tabs {
                width: 100%;
                height: 10%;
                display: flex;
                align-items: center;
                justify-content: center;

                .tab {
                    width: 15%;
                    padding: 1vh;
                    cursor: pointer;
                    color: $darkGrey;
                    text-align: center;
                    transition: $transitionTime;
                    border-bottom: 3px solid $black;

                    &.active {
                        width: 20%;
                        color: $lightGrey;
                        transition: $transitionTime;
                        border-bottom: 3px solid $darkRed;
                    }

                    &:hover {
                        width: 17.5%;
                        color: $mediumGrey;
                        border-bottom: 3px solid $mediumGrey;
                    }
                }
            }

            div.content {
                width: 100%;
                height: 90%;
            }
        }
    }
</style>
