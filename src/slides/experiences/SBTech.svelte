<script>
    import Template from "./ExperienceTamplate.svelte";
    import { techSkills } from "./skills";

    const period = "2018 - 2020";
    const techs = techSkills.sbTech
        .sort((a, b) => a.weight - b.weight)
        .map((x) => x.label);
    const orgs = ["Windows", "Jira", "Slack", "Agile"];
</script>

<Template {period} {techs} {orgs}>
    Product company, developing an end-to-end e-gambling solutions.
    <br />
    Our team was responsible for markets and configurations,
    <br />
    maintaing over 30 microservices (REST APIs),
    <br />
    as well as internal front-end tracking utilities.
</Template>
