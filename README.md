<img src="/static/turkeydev.png" style="width: 250px; height: 250px;"/>

# Thank a Dev

Generate thank you notes for open source maintainers based on your repository's SBOM (software bill of materials).
As seen on Jason Lengstorf's Web Dev Challenge series.

## Tech Stack
- Svelte(Kit): JS UI and meta framework
- Google Gemini: AI SDK (sponsor of the WDC episode)
- OpenSauced API: To easily generate an SBOM list
- TailwindCSS: CSS Library

## How it works
1. User inputs their repository of choice (eg `zeucapua/thankadev`)
2. Program will output the list of dependencies
3. User clicks `Generate Notes`
4. User goes through each thank you note generated and decide which to tweet
5. Program opens a new tab to a tweet intent
