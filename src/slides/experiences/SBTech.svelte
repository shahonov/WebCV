<script>
    import Template from "./ExperienceTamplate.svelte";

    const period = "2018 - 2020";
    const techs = [".NET Core", "MS SQL", "React", "MobX", "TypeScript"];
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
