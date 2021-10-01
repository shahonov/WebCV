<script>
    import Template from "./ExperienceTamplate.svelte";

    const period = "2021 - current";
    const techs = ["Svelte", "GraphQL", "Postrges SQL", "Ruby on Rails"];
    const orgs = ["Linux", "GitLab", "Slack", "Agile"];
</script>

<Template {period} {techs} {orgs}>
    Product company, developing an online platform for booking and managing
    scientific resources for laboratories.
    <br />
    Some of the main clients are: Harvard University, Oxford University, etc.
</Template>
