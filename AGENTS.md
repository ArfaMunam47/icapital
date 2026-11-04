<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The intro overlay must dismiss through CSS independently of React hydration so a delayed preview cannot hide the story indefinitely.
- Keep the scroll playhead in useStoryProgress and layered/video media in StoryLandscape; native scrolling remains user-controlled while scene changes and video frames follow one eased playhead.
- Creative chapters use the existing scene playhead and StoryLandscape media variants rather than separate scrolling systems, keeping navigation and transitions consistent.
- Living chapter surfaces render in a lifecycle-managed Canvas 2D module through StoryLandscape; continuous media bypasses video seeking so idle motion and native scrolling coexist.
- Scene audio uses opt-in browser Web Audio with playhead crossfades, visibility suspension and unmount cleanup; never autoplay sound or couple it to scrubbed video tracks.
- Keep the final contact experience in ContactEnding, with a separately tested enquiry schema and scoped ending styles; without a delivery integration it only validates and offers copying, never reports a sent enquiry.
- Business facts, services, legal links and contact details live in src/lib/business.ts; unverified entries render only in dev builds so placeholders never publish.
