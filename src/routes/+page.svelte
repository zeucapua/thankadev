<script lang="ts">
  import { enhance } from "$app/forms";
  const OPENSAUCED_API_BASE_URL="https://api.opensauced.pizza/v2";

  let { form = $bindable<{result: string}>() }: { form: { result: string }} = $props();

  interface RepositoryInfo {
    description: string;
  }

  interface ThankYouNote {
    repository_name: string;
    repository_description: string;
    repository_image: string;
    generated_thank_you_note: string;
  }

  let searchTerm = $state("");

  let subject = $state("");

  let repositoryResults = $derived.by(async () => {
    if (subject) {
      const infoResponse = await fetch(`${OPENSAUCED_API_BASE_URL}/repos/${subject}/info`);
      const sbomResponse = await fetch(`${OPENSAUCED_API_BASE_URL}/repos/sbom?repos=${encodeURI(subject)}`);

      const info = await infoResponse.json() as RepositoryInfo;
      const sbom = await sbomResponse.json();

      return { info, sbom };
    }

    return null;
  });

  let parsedData = $derived.by(() => {
    if (form && form.result) {
      const lines = form.result.split("\n");
      const relevantLines = lines.slice(1, lines.length-2).join("");
      console.log({ relevantLines });
      const result = JSON.parse(relevantLines);
      return result as ThankYouNote[];
    }

    return [];
  });
</script>

<main class="relative flex flex-col gap-4 p-8 items-center"> 
  <span class="fixed inset-0 bg-gradient-to-b to-orange-500 from-orange-100 -z-10 max-w-screen max-h-screen"></span>
  <div class="flex gap-4 items-end">
    <img src="/turkeydev.png" alt="ThankADev Turkey Logo" class="size-64" />
    <img src="/thankadev.png" alt="#ThankADev handwritten" class="size-48" />
  </div>
  <div class="flex gap-4 items-center justify-center">
    <input 
      type="text" 
      bind:value={searchTerm} 
      placeholder="Search a repository"
      class="px-4 py-2 rounded-xl border"
    />
    <button 
      onclick={() => { subject = searchTerm; form = {result: ""}; }}
      class="px-4 py-2 rounded-xl border border-orange-500 bg-orange-500 hover:bg-orange-800 hover:border-orange-800 text-white"
    >
      Search
    </button>
  </div>
  <p class="text-sm font-serif">Powered by OpenSauced and Google Gemini</p>


  <div class="flex flex-col w-full items-center gap-4 max-h-full">
    {#if subject}
      {#await repositoryResults}
        <p>Loading...</p>
      {:then repoData}
        {#if repoData}
          <section class="flex flex-col gap-4 border px-12 py-8 rounded-lg w-full bg-white">
            <h1 class="text-2xl font-bold text-center">{subject}: {repoData.info.description}</h1> 
            <form use:enhance method="POST" action="?/generateThanksSBOM" class="flex gap-4 justify-center items-center border-b-2 pb-2">
              <h4 class="font-medium text-xl">SBOM</h4>
              <input name="subject" type="hidden" value={subject} />
              <input name="sbom" type="hidden" value={JSON.stringify(repoData.sbom[subject])} />
              <button 
                type="submit" 
                class="px-4 py-2 rounded-xl border border-orange-500 bg-orange-500 hover:bg-orange-800 hover:border-orange-800 hover:text-white"
              >
                Generate Notes
              </button>
            </form>
            <ul class="flex gap-2 flex-wrap">
              {#each repoData.sbom[subject] as repo}
                <p class="px-2 py-1 border rounded-lg">{repo}</p>
              {/each}
            </ul>
          </section>
        {/if}
      {/await}
    {/if}

    {#if parsedData && parsedData.length > 0}
      <section class="flex flex-col gap-4">
        {#each parsedData as note: ThankYouNote}
          <article class="bg-white flex flex-col gap-4 px-12 py-8 border rounded-lg">
            <div class="flex flex-col gap-2 items-center">
              <img 
                src={note.repository_image} 
                alt={`${note.repository_name} GitHub picture`}
                class="size-12" 
              />
              <h1 class="text-xl font-bold">{note.repository_name}</h1>
              <h2 class="font-medium">{note.repository_description}</h2>
            </div>
            <div class="flex flex-col gap-2 font-serif">
              <p>"</p>
              <p class="italic text-center">{note.generated_thank_you_note}</p>
              <p class="self-end">"</p>
            </div>
            <a 
              href={`https://twitter.com/intent/tweet?text=${note.generated_thank_you_note}&hashtags=ThankADev`}
              class="w-fit self-end px-4 py-2 rounded-xl border border-orange-500 bg-orange-500 hover:bg-orange-800 hover:border-orange-800 hover:text-white"
            >
              Tweet
            </a>
            <a 
              href={`https://bsky.app/intent/compose?text=${note.generated_thank_you_note+" #ThankADev"}`}
              class="w-fit self-end px-4 py-2 rounded-xl border border-blue-500 bg-blue-500 hover:bg-blue-800 hover:border-blue-800 hover:text-white"
              >
              Skeet
            </a>
          </article>
        {/each}
      </section>
    {/if}
  </div>

</main>
