# How People Like to Learn vs. What Actually Works

Research notes for the insurance terminology app. Written September 2026.

Evidence strength: **High** = several meta-analyses or large controlled studies. **Medium** = a few good studies, or large surveys. **Low** = small studies, company blogs, or vendor surveys.

## 1. Summary

- People say they **prefer video** and short, self-paced learning they can use when they need it.
- What **works best** is **quizzing yourself** (retrieval practice) and **spacing reviews over days** (spaced repetition).
- **Words plus a picture** (like a diagram) beat words alone by a large margin.
- **Stories and concrete examples** are easier to understand and remember than plain definitions.
- Learners often **judge badly** what helps them. Rereading and watching feel effective, but quizzing works better.
- "Learning styles" (visual learner, auditory learner, and so on) are **not supported** by the evidence. Don't build around them.
- **Streaks and badges** mostly bring people back. They add a small learning benefit, and only when they sit on top of good practice.
- **Short videos** (about 6 minutes or less) hold attention better. Most people who start long self-paced courses never finish them.

## 2. What people prefer (ranked)

| # | Preference | Evidence | Source |
|---|---|---|---|
| 1 | **Video** over text or audio for learning how things work. 83% prefer video (TechSmith). 78% prefer short video to learn about a product (Wyzowl). | Medium. Big surveys, but both companies sell video, so treat the numbers as upper bounds. | [5], [6] |
| 2 | **Self-paced, just-in-time learning.** 58% want to learn at their own pace. 49% want to learn at the point of need. | Medium (LinkedIn survey, 2018; LinkedIn sells courses). | [7] |
| 3 | **Short chunks.** Engagement drops sharply once videos run past about 6 minutes (6.9M viewing sessions on edX). TechSmith 2024 found 10–20 minutes was the most popular length for instructional video, so "short" depends on the topic. | High for engagement (Guo). Low to medium for the TechSmith preference. | [8], [5] |
| 4 | **Rereading and reviewing** over testing yourself. Rereading is the study method students report most. | Medium (survey of 177 students). | [11] |
| 5 | **A real human presenter** over an animated character or AI avatar (87%). Informal talking-head and hand-drawn videos keep people watching longer. | Medium or lower. | [5], [8] |
| 6 | **Game features** (streaks, points). These raise return visits by a few percent up to about 14% in Duolingo A/B tests. | Low for learning, because the tests only measured engagement. Company blog. | [13] |

## 3. What actually works best (ranked)

| # | Method | Evidence | Source |
|---|---|---|---|
| 1 | **Retrieval practice (quizzes, flashcards you answer before flipping).** Beats rereading and every other comparison. Meta-analysis: 272 effects, about 15,000 people. Rated "high utility" by Dunlosky et al. | **High** | [1], [2] |
| 2 | **Spacing reviews over time.** Reviewing across days beats cramming. Meta-analysis: 317 experiments. The longer you need to remember something, the wider the gaps between reviews should be. Rated "high utility". | **High** | [1], [3] |
| 3 | **Successive relearning (1 + 2 combined).** Quiz on a term until you get it right, then come back in later sessions. Tested on **key-term definitions** in real college courses, which is almost exactly our use case. | **High** (more than a dozen studies) | [4] |
| 4 | **Words + visuals (diagrams).** Learners scored better in 11 out of 11 tests, with a median effect size of about d = 1.4, which is very large. The visuals must be relevant, not decoration. | **High** | [9] |
| 5 | **Stories and concrete examples.** Stories are understood and recalled better than expository text (75+ samples, 33,000+ people). Examples help people spot new cases of a concept. | **High** for stories. **Medium** for examples. | [10], [14] |
| 6 | **Video added to other teaching.** Adding video gave a large gain (g = 0.80). Replacing other teaching with video gave only a small gain (g = 0.28). Based on 105 trials. | **Medium** (some publication bias) | [12] |
| 7 | **Gamification.** Small to medium effect on learning (g = 0.49, 19 studies). Weaker and less stable effects on motivation and behavior. | **Medium** | [15] |
| 8 | **Microlearning.** Results are generally positive but scattered. Studies are small, and many are written by vendors. | **Low** | [16] |
| 9 | **Matching content to a "learning style".** No good evidence this helps. The few solid tests contradict it. | **High** (that it does **not** work) | [17] |
| — | **Audio or podcasts alone.** We found no strong evidence it helps with terminology. Diagrams need visuals. | **Low** | — |

## 4. Where preference and effectiveness disagree

- **Rereading vs. quizzing.** People pick rereading because it feels fluent. Quizzing produces more learning [1], [11].
- **Feeling of learning.** In a physics study, students learned more in active classes but *felt* they learned less [18]. People also rated cramming as better even after their own scores showed spacing won [19]. **Takeaway: don't use "did you like it?" to judge whether learning worked.**
- **Video.** People love it. It helps most as an *add-on*, and only when it is short [8], [12]. A video alone, with no quiz, is passive.
- **Learning styles.** People have real preferences, but serving them does not improve learning [17]. Offering several formats is fine for comfort and access, not for memory.
- **Streaks.** These drive visits, not understanding [13], [15]. They are useful only if every visit includes retrieval practice.
- **Self-paced freedom.** It is preferred, but completion is poor. Only 3.13% of edX MIT/Harvard learners finished their courses (5.6M learners, 2012–2018) [20]. Short paths and reminders matter.

## 5. Recommendations for our app

**Term page (v1)**
- Order: **plain definition first**, then a **concrete example**, then a **short real-life story**, then the **policy-flow diagram** placed right next to the text it explains.
- Keep the diagram simple and labeled. Cut decorative images (Mayer's coherence principle [9]).
- End every term page with **a single "check yourself" question**, not just a "Mark as read" button.

**Quizzes (v1, top priority)**
- **Scenario questions** ("Maria's car is hit… which coverage pays?") beat definition-matching for transfer. Mix in some recall questions too.
- Give **instant feedback** with a one-line explanation and a link back to the term.
- Let users **type or pick an answer before seeing it**, flashcard-style.

**Learning paths (v1)**
- Keep lessons at **5–10 minutes** each.
- Base progress % on **terms answered correctly**, not pages viewed.
- Start each session with a **quick review of 3–5 earlier terms** (a simple spaced review, no algorithm needed yet).

**Later (v2+)**
- **Real spaced repetition**: schedule each term's review from past answers, similar to Duolingo's model [21]. Use a "review due" queue.
- **Light gamification**: a streak that only counts *quiz* activity, plus completion badges per path. No leaderboards at first.
- **Short videos (2–5 minutes)** for the hardest flows, such as claims and subrogation, used as an add-on and always followed by a quiz.
- Role-based paths for readers, developers, underwriters, and product owners.
- Skip: learning-style quizzes, audio-only lessons, and long videos.

## 6. Sources

1. Dunlosky, Rawson, Marsh, Nathan, Willingham. *Improving Students' Learning With Effective Learning Techniques.* Psychological Science in the Public Interest, 2013. https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html
2. Adesope, Trevisan, Sundararajan. *Rethinking the Use of Tests: A Meta-Analysis of Practice Testing.* Review of Educational Research, 2017. https://journals.sagepub.com/doi/10.3102/0034654316689306
3. Cepeda, Pashler, Vul, Wixted, Rohrer. *Distributed Practice in Verbal Recall Tasks.* Psychological Bulletin, 2006. https://pubmed.ncbi.nlm.nih.gov/16719566/
4. Rawson, Dunlosky et al. Successive relearning research (summary). RetrievalPractice.org, 2018. https://www.retrievalpractice.org/archive/2018/successive-relearning
5. TechSmith. *Video Viewer Study / 2026 Video Statistics*, 2024–2026 (about 1,000 respondents, vendor). https://www.techsmith.com/blog/2026-video-statistics/
6. Wyzowl. *Video Marketing Statistics 2025* (vendor). https://wyzowl.com/video-marketing-statistics/
7. LinkedIn Learning. *2018 Workplace Learning Report* (vendor). https://business.linkedin.com/content/dam/me/learning/en-us/pdfs/linkedin-learning-workplace-learning-report-2018.pdf
8. Guo, Kim, Rubin. *How Video Production Affects Student Engagement.* ACM Learning@Scale, 2014. https://up.csail.mit.edu/other-pubs/las2014-pguo-engagement.pdf
9. Mayer. *Research-Based Principles for Designing Multimedia Instruction*, 2014 (and *Multimedia Learning*, Cambridge). https://www.unh.edu/teaching-learning-resource-hub/sites/default/files/media/2023-06/itow-research-based-principles-for-designing-multimedia-instruction-mayer.pdf
10. Mar, Li, Nguyen, Ta. *Memory and Comprehension of Narrative Versus Expository Texts: A Meta-Analysis.* Psychonomic Bulletin & Review, 2021. https://pmc.ncbi.nlm.nih.gov/articles/PMC8219577/
11. Karpicke, Butler, Roediger. *Metacognitive Strategies in Student Learning.* Memory, 2009. https://bpb-us-e2.wpmucdn.com/sites.wustl.edu/dist/8/805/files/2026/06/Karpicke-et-al.-2009-Metacognitive-strategies-in-student-learning-Do-students-practise-retrieval-when-they-study-on-thei.pdf
12. Noetel et al. *Video Improves Learning in Higher Education: A Systematic Review.* Review of Educational Research, 2021. https://www.aera.net/Newsroom/Video-Improves-Learning-in-Higher-Education-A-Systematic-Review
13. Duolingo. *How Streaks Keep Duolingo Learners Committed*, 2017 (company blog). https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals
14. Rawson, Thomas, Jacoby. *The Power of Examples.* Educational Psychology Review, 2015 (see replication). https://cronfa.swan.ac.uk/Record/cronfa59139
15. Sailer, Homner. *The Gamification of Learning: A Meta-Analysis.* Educational Psychology Review, 2020. https://link.springer.com/article/10.1007/s10648-019-09498-w
16. *Microlearning Beyond Boundaries: A Systematic Review*, 2025. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11774797/
17. Pashler, McDaniel, Rohrer, Bjork. *Learning Styles: Concepts and Evidence.* Psychological Science in the Public Interest, 2008. https://digitalcommons.usf.edu/psy_facpub/1765/
18. Deslauriers et al. *Measuring Actual Learning Versus Feeling of Learning.* PNAS, 2019. https://kellymiller.scholars.harvard.edu/publications/measuring-actual-learning-versus-feeling-learning-response-being-actively
19. Kornell, Bjork. *Learning Concepts and Categories: Is Spacing the "Enemy of Induction"?* Psychological Science, 2008. https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/Kornell_Bjork_2008_PsychScience.pdf
20. Reich, Ruipérez-Valiente. *The MOOC Pivot.* Science, 2019. https://tsl.mit.edu/research/the-mooc-pivot/
21. Settles, Meeder. *A Trainable Spaced Repetition Model for Language Learning.* ACL, 2016. https://aclanthology.org/P16-1174/
