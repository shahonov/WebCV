<script>
    import { onMount, getContext, onDestroy } from "svelte";
    import { slidesConfig } from "./configuration";
    import { skillType, techSkills } from "./experiences/skills";

    const globals = getContext("global");
    const { inT, outT } = globals;

    onMount(() => {
        slidesConfig.loadParallax();
    });

    onDestroy(() => {
        slidesConfig.removeParallax();
    });

    const extractOrderedTechSkills = (skillType) => {
        const keys = Object.keys(techSkills);
        const skills = [];
        for (let key of keys) {
            const orgTechSkills = techSkills[key];
            for (const orgTechSkill of orgTechSkills) {
                const { label, weight } = orgTechSkill;
                const foundItem = skills.find((x) => x.label === label);
                if (!foundItem) {
                    if (orgTechSkill.type === skillType) {
                        skills.push({ label, weight });
                    }
                }
            }
        }
        const sorted = skills.sort((a, b) => a.weight - b.weight);
        return sorted;
    };

    const frontEndSkills = extractOrderedTechSkills(skillType.fe);
    const backEndSkills = extractOrderedTechSkills(skillType.be);
</script>

<section in:inT out:outT class="slide">
    <div class="technical-skills-slide">
        <h4>Technical skills</h4>
        <div class="tech-skills-wrapper">
            <ul>
                {#each frontEndSkills as techSkill, i (i)}
                    <li>{techSkill.label}</li>
                {/each}
            </ul>
            <ul>
                {#each backEndSkills as techSkill, i (i)}
                    <li>{techSkill.label}</li>
                {/each}
            </ul>
        </div>
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
