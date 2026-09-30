"""Builds the LearnInsurance wireframe artboards (.dc.html) into ./source.

Run: python3 docs/wireframes/build.py && python3 docs/wireframes/preview.py
"""
import json, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "source")
W = 1280

CSS = """
body{margin:0;font-family:'IBM Plex Sans',system-ui,sans-serif;color:#1f1f1c;background:#f4f4f1;font-size:15px;line-height:1.5}
a{color:#1f1f1c}a:hover{color:#1d4ed8}
h1,h2,h3,h4,p{margin:0}
.hdr{display:flex;align-items:center;gap:32px;height:72px;padding:0 48px;background:#ffffff;border-bottom:1px solid #cfcfca;box-sizing:border-box}
.logo{display:flex;gap:10px;align-items:center;font-weight:600;font-size:18px;text-decoration:none}
.logomark{width:26px;height:26px;border:2px solid #1f1f1c;border-radius:6px;box-sizing:border-box}
.nav{display:flex;gap:28px;font-size:15px;flex-grow:1}
.nav a{text-decoration:none;color:#44443f}
.nav a.on{color:#1f1f1c;font-weight:600;text-decoration:underline;text-underline-offset:6px}
.box{background:#ffffff;border:1px solid #cfcfca;border-radius:10px;box-sizing:border-box}
.ph{background:#e4e4df;border-radius:6px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 20px;border-radius:8px;border:1.5px solid #1f1f1c;background:#ffffff;font:inherit;font-weight:500;text-decoration:none;color:#1f1f1c;box-sizing:border-box;white-space:nowrap}
.btn.pri{background:#1f1f1c;color:#ffffff}
.btn.ghost{border-color:#cfcfca}
.chip{display:inline-flex;align-items:center;height:28px;padding:0 12px;border-radius:14px;border:1px solid #bdbdb7;font-size:13px;background:#ffffff;color:#33332f;text-decoration:none;white-space:nowrap;box-sizing:border-box}
.chip.dark{background:#1f1f1c;color:#ffffff;border-color:#1f1f1c}
.chip.fill{background:#e4e4df;border-color:#e4e4df}
.chip.ai{border:1.5px dashed #1d4ed8;color:#1d4ed8;font-weight:500}
.muted{color:#5b5b55}
.small{font-size:13px}
.label{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#5b5b55}
.state{display:inline-flex;font-family:'IBM Plex Mono',monospace;font-size:12px;padding:4px 10px;border:1px dashed #5b5b55;border-radius:4px;color:#44443f;background:#ffffff}
.bar{height:8px;background:#e1e1dc;border-radius:4px;overflow:hidden}
.bar>div{height:100%;background:#1f1f1c}
.input{display:flex;align-items:center;gap:12px;height:56px;padding:0 20px;border:1.5px solid #1f1f1c;border-radius:10px;background:#ffffff;box-sizing:border-box}
.input input{border:0;outline:0;font:inherit;font-size:17px;flex-grow:1;background:transparent;color:#1f1f1c}
.input input::placeholder{color:#5b5b55}
.field{display:flex;flex-direction:column;gap:6px;font-size:14px;font-weight:500}
.field input,.field select{height:44px;border:1px solid #9a9a94;border-radius:8px;padding:0 12px;font:inherit;background:#ffffff}
.stage{display:flex;align-items:center;justify-content:center;height:44px;padding:0 14px;border:1.5px solid #bdbdb7;border-radius:8px;font-size:13px;font-weight:500;background:#ffffff;color:#44443f;white-space:nowrap}
.stage.on{border-color:#1d4ed8;background:#1d4ed8;color:#ffffff}
.arrow{color:#8a8a84;font-size:16px}
.tree a{text-decoration:none}
.row{display:flex;align-items:center}
.ftr{display:flex;justify-content:space-between;align-items:center;padding:0 48px;height:72px;border-top:1px solid #cfcfca;background:#ffffff;font-size:13px;color:#5b5b55;box-sizing:border-box}
"""

FONT = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&amp;family=IBM+Plex+Sans:wght@400;500;600&amp;display=swap">'

SEARCH_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>'


def header(active="", signed_in=False):
    def nav(href, text, key):
        cls = ' class="on"' if key == active else ""
        return f'<a href="{href}"{cls}>{text}</a>'
    right = (
        '<a href="Dashboard.dc.html" class="btn ghost">My progress</a>'
        '<div style="width: 40px; height: 40px; border-radius: 20px; background: #1f1f1c; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 600" aria-label="Ram&#39;s account">R</div>'
        if signed_in else
        '<a href="SignIn.dc.html" class="btn ghost">Sign in</a><a href="SignIn.dc.html" class="btn pri">Sign up</a>'
    )
    return (
        '<header class="hdr">'
        '<a href="Home.dc.html" class="logo"><span class="logomark"></span>LearnInsurance</a>'
        '<nav class="nav">'
        + nav("Glossary.dc.html", "Terms A–Z", "terms")
        + nav("Types.dc.html", "Insurance types", "types")
        + nav("Paths.dc.html", "Learning paths", "paths")
        + '</nav>'
        '<label class="input" style="height: 44px; width: 260px; border-width: 1px; border-color: #9a9a94">'
        + SEARCH_ICON +
        '<input type="search" placeholder="Search a term" aria-label="Search a term" style="font-size: 14px">'
        '</label>'
        + right +
        '</header>'
    )


FOOTER = ('<footer class="ftr" style="height: 96px"><div style="display: flex; flex-direction: column; gap: 2px"><span style="font-weight: 500; color: #1f1f1c">LearnInsurance · US insurance, in plain English</span>'
          '<span>Educational only. Not insurance, legal or financial advice. Your policy wording decides what is covered.</span></div>'
          '<div style="display: flex; gap: 20px"><a href="Glossary.dc.html">Terms</a><a href="Types.dc.html">Types</a>'
          '<a href="Paths.dc.html">Paths</a><a href="Pipeline.dc.html">How terms are made</a><a href="NotFound.dc.html">Privacy</a><a href="NotFound.dc.html">Terms of use</a><a href="Home.dc.html">Cookie settings</a></div></footer>')


def page(title, h, body, props_extra="", w=None):
    w = w or W
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{FONT}
<style>{CSS}</style>
</helmet>
<div style="position: relative; width: {w}px; height: {h}px; box-sizing: border-box; display: flex; flex-direction: column; background: #f4f4f1; overflow: hidden">
{body}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
renderVals() {{
return {{}};
}}
}}
</script>
</body>
</html>
"""


def flow(on=(), size="normal"):
    stages = ["Quote", "Underwriting", "Bind", "Issue", "Changes", "Claim", "Renewal"]
    parts = []
    for i, s in enumerate(stages):
        cls = "stage on" if s in on else "stage"
        parts.append(f'<div class="{cls}">{s}</div>')
        if i < len(stages) - 1:
            parts.append('<span class="arrow" aria-hidden="true">→</span>')
    return '<div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap">' + "".join(parts) + "</div>"


def chips(items, cls="chip", href=None):
    return "".join(
        (f'<a href="{href}" class="{cls}">{t}</a>' if href else f'<span class="{cls}">{t}</span>') for t in items
    )


boards = {}

# ---------------- 1. Home ----------------
H = 1100
home = header() + f"""
<section style="display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 72px 48px 56px; background: #ffffff; border-bottom: 1px solid #cfcfca">
<span class="label">US insurance · 1,016 terms · 551 insurance types</span>
<h1 style="font-size: 44px; font-weight: 600; text-align: center; max-width: 820px; line-height: 1.15">Understand insurance words in plain English</h1>
<p class="muted" style="font-size: 18px; text-align: center; max-width: 680px">For people reading their policy, developers new to insurance, underwriters and product owners.</p>
<a href="Search.dc.html" class="input" style="width: 720px; margin-top: 8px; text-decoration: none">{SEARCH_ICON}<span class="muted" style="font-size: 17px; flex-grow: 1">Search any term, e.g. deductible, subrogation, endorsement</span><span class="btn pri" style="min-height: 40px">Search</span></a>
<div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: center"><span class="small muted">Most used:</span>{chips(["Insured","Policy","Premium","Quote","Deductible","Claim","Coverage","Renewal","Policyholder"], href="Term.dc.html")}</div>
</section>

<section style="display: flex; flex-direction: column; gap: 16px; padding: 48px 48px 0">
<h2 style="font-size: 22px">How a policy works</h2>
<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 12px">{flow()}<p class="small muted">Every term page shows where the term fits in this flow, with a short real-life story.</p></div>
</section>

<section style="display: flex; gap: 32px; padding: 40px 48px 48px">
<div style="flex-grow: 1; display: flex; flex-direction: column; gap: 16px">
<div class="row" style="justify-content: space-between"><h2 style="font-size: 22px">Browse by insurance type</h2><a href="Types.dc.html" class="small">See full tree →</a></div>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px">
{"".join(f'<a href="Types.dc.html" class="box" style="padding: 14px 16px; text-decoration: none; display: flex; justify-content: space-between"><span style="font-weight: 500">{n}</span><span class="small muted">{c}</span></a>' for n, c in [("Life","58"),("Health","69"),("Auto","45"),("Home &amp; property","39"),("Liability","43"),("Commercial","29"),("Specialty &amp; cyber","72"),("Financial lines","44"),("Marine &amp; aviation","44")])}
</div>
</div>
<div style="width: 400px; display: flex; flex-direction: column; gap: 16px">
<div class="row" style="justify-content: space-between"><h2 style="font-size: 22px">Learning paths</h2><a href="Paths.dc.html" class="small">All paths →</a></div>
{"".join(f'<a href="PathDetail.dc.html" class="box" style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; text-decoration: none"><div><div style="font-weight: 500">{n}</div><div class="small muted">{d}</div></div><span class="btn ghost" style="min-height: 36px; padding: 0 14px">Start</span></a>' for n, d in [("Insurance basics","Start here · 30 terms"),("Auto insurance","48 terms"),("Cyber insurance","50 terms")])}
</div>
</section>
<div style="flex-grow: 1"></div>
""" + FOOTER
home += '''<div class="box" role="region" aria-label="Cookie consent" style="position: absolute; left: 48px; right: 48px; bottom: 120px; padding: 16px 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); border-color: #1f1f1c">
<span class="state">Cookie consent</span><p class="small" style="flex-grow: 1">We use analytics cookies to see which terms help people most. You can change this anytime.</p>
<button class="btn ghost">Only necessary</button><button class="btn pri">Accept</button></div>'''
boards["Home.dc.html"] = ("1 · Home", H, page("Home", H, home))

# ---------------- 2. Search ----------------
H = 1080
result = lambda t, d, tags: f'<a href="Term.dc.html" class="box" style="padding: 16px 20px; display: flex; flex-direction: column; gap: 6px; text-decoration: none"><div class="row" style="gap: 10px"><span style="font-weight: 600; font-size: 17px">{t}</span>{tags}</div><p class="small muted">{d}</p></a>'
search = header() + f"""
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; padding: 32px 48px">
<div style="display: flex; flex-direction: column; gap: 16px">
<span class="state">State A · term found</span>
<label class="input">{SEARCH_ICON}<input type="search" placeholder="retro" aria-label="Search"></label>
<p class="small muted">3 results for “retro” · sorted by most used</p>
{result("Retroactive Date", "The earliest date an incident can happen and still be covered by a claims-made policy.", '<span class="chip fill">Medium usage</span>')}
{result("Retrospective Rating", "A premium that is adjusted after the policy ends, based on the actual losses.", '<span class="chip fill">Low usage</span>')}
{result("Retention", "The amount of loss the insured or insurer keeps before other cover pays.", '<span class="chip fill">Medium usage</span>')}
<div class="box" style="padding: 16px 20px; display: flex; flex-direction: column; gap: 8px"><span class="label">Insurance types matching</span><div style="display: flex; gap: 8px">{chips(["Cyber Insurance › Claims-made"], href="Types.dc.html")}</div></div>
</div>

<div style="display: flex; flex-direction: column; gap: 16px">
<span class="state">State B · term not found → request it</span>
<label class="input">{SEARCH_ICON}<input type="search" placeholder="hammer clause" aria-label="Search"></label>
<div class="box" style="padding: 28px; display: flex; flex-direction: column; gap: 16px">
<h2 style="font-size: 22px">We don’t have “hammer clause” yet</h2>
<p class="muted">Request it and we’ll add it automatically. You’ll get a plain-English definition, an example and a real-life story.</p>
<label class="field">Term<input type="text" placeholder="hammer clause"></label>
<label class="field">Where did you see it? (optional)<input type="text" placeholder="e.g. my professional liability policy"></label>
<label class="field">Email me when it’s ready (optional)<input type="email" placeholder="you@example.com"></label>
<button class="btn pri" style="align-self: flex-start">Request this term</button>
<div class="row" style="gap: 8px"><span class="small muted">Did you mean:</span>{chips(["Consent to settle","Settlement"], href="Term.dc.html")}</div>
</div>
<span class="state">State C · after request</span>
<div class="box" style="padding: 20px 24px; display: flex; flex-direction: column; gap: 6px; border-color: #1f1f1c">
<div style="font-weight: 600">Request received</div>
<p class="small muted">Our AI writer is creating “hammer clause” and a second AI reviewer will check it. It will appear with an AI-generated tag.</p>
<a href="Dashboard.dc.html" class="small">Track this request →</a>
</div>
</div>
</div>
<div style="flex-grow: 1"></div>
""" + FOOTER
boards["Search.dc.html"] = ("2 · Search & request a term", H, page("Search", H, search))


def mc(name, opts, sel=None):
    out = []
    for o in opts:
        on = (o == sel)
        style = "border: 2px solid #1d4ed8; background: #eef2ff" if on else "border: 1px solid #bdbdb7"
        c = ' checked="checked"' if on else ""
        out.append(f'<label class="row" style="gap: 14px; min-height: 48px; padding: 0 16px; border-radius: 10px; background: #ffffff; {style}"><input type="radio" name="{name}"{c}>{o}</label>')
    return '<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px">' + "".join(out) + "</div>"

def pcard_mini(title, lines, hl=False):
    border = "border: 2px solid #1d4ed8" if hl else "border: 1px solid #9a9a94"
    body = "".join(f'<div class="small" style="padding: 6px 0; border-top: 1px solid #e4e4df">{l}</div>' for l in lines)
    return f'<div style="flex-grow: 1; flex-basis: 0; background: #ffffff; border-radius: 8px; padding: 14px; {border}"><div class="label" style="margin-bottom: 6px">{title}</div>{body}</div>'

# ---------------- 3. Term detail ----------------
H = 2760
story_steps = [
    ("Quote &amp; Bind", "Tom buys auto insurance for <b>$100/month</b> with $50,000 liability coverage."),
    ("Issue", "He gets his policy documents on the 1st."),
    ("Changes", "On the 20th, Tom moves to a new city and wants to add collision coverage. His insurer makes both changes with an <b>endorsement</b>."),
    ("Result", "The new address and added coverage raise his premium to <b>$120/month</b>, starting the 20th."),
    ("Renewal", "At renewal, the policy continues with the new address and coverage included."),
]
story = "".join(
    f'<div class="row" style="gap: 16px; align-items: flex-start"><div style="width: 32px; height: 32px; flex-shrink: 0; border-radius: 16px; {"background: #1d4ed8; color: #ffffff" if s=="Changes" else "background: #e4e4df"}; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px">{i+1}</div><div><div style="font-weight: 600">{s}</div><p class="muted">{t}</p></div></div>'
    for i, (s, t) in enumerate(story_steps)
)
def faq(q, a, open_):
    ans = '<p class="muted small">' + a + '</p>' if open_ else ""
    sign = "–" if open_ else "+"
    return ('<div style="border-top: 1px solid #cfcfca; padding: 14px 0; display: flex; flex-direction: column; gap: 6px">'
            '<div class="row" style="justify-content: space-between"><span style="font-weight: 500">' + q + '</span>'
            '<span class="muted" aria-hidden="true">' + sign + '</span></div>' + ans + '</div>')
glance = lambda k, v: f'<div style="display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-top: 1px solid #e4e4df"><span class="small muted">{k}</span><span class="small" style="font-weight: 500; text-align: right">{v}</span></div>'
term = header("terms") + f"""
<div style="padding: 28px 48px 0; display: flex; flex-direction: column; gap: 16px">
<nav class="small muted" aria-label="Breadcrumb"><a href="Glossary.dc.html">Terms</a> / <a href="Glossary.dc.html">Policy wording</a> / Endorsement</nav>
<div class="row" style="justify-content: space-between; align-items: flex-start">
<div style="display: flex; flex-direction: column; gap: 10px">
<h1 style="font-size: 44px; font-weight: 600">Endorsement</h1>
<p class="muted">Also known as: policy change, rider (life &amp; health), mid-term adjustment</p>
<div class="row" style="gap: 8px">{chips(["Medium usage"], "chip dark")}{chips(["Beginner","All insurance types","Policy wording"], "chip fill")}<span class="chip ai">AI-generated · AI-reviewed</span></div>
</div>
<div class="row" style="gap: 8px"><button class="btn">Save term</button><a href="#check" class="btn pri">Check yourself</a></div>
</div>
</div>

<div style="display: flex; gap: 32px; padding: 24px 48px 48px; align-items: flex-start">
<main style="flex-grow: 1; display: flex; flex-direction: column; gap: 20px; min-width: 0">
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">
<div class="box" style="padding: 24px; border: 2px solid #1f1f1c; display: flex; flex-direction: column; gap: 8px">
<span class="label">Quick answer</span>
<p style="font-size: 18px">An endorsement is an official change to an insurance policy after it starts, such as a new address, an added driver or extra coverage. It becomes part of the policy and can raise or lower the premium.</p>
</div>
<figure class="box" style="margin: 0; padding: 20px; display: flex; flex-direction: column; gap: 12px; background: #fafaf8">
<div class="row" style="justify-content: space-between"><span class="label">See it</span><span class="state">Diagram template: before → after</span></div>
<div class="row" style="gap: 10px; align-items: center">
{pcard_mini("Policy · Jan 1", ["$100 / month","Old address","Liability only"])}
<div style="display: flex; flex-direction: column; align-items: center; gap: 4px"><span class="chip dark">Endorsement</span><span class="arrow" aria-hidden="true" style="font-size: 22px">→</span><span class="small muted">Jan 20</span></div>
{pcard_mini("Policy · Jan 20", ["<b>$120 / month</b>","<b>New address</b>","Liability <b>+ collision</b>"], True)}
</div>
<figcaption class="small muted">Same policy, updated. No new policy is bought.</figcaption>
</figure>
</div>

<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 10px">
<h2 style="font-size: 20px">In plain English</h2>
<p>Your policy is a contract. When something in your life changes, you don’t buy a new policy. The insurer adds an endorsement, a written update that changes part of the contract.</p>
<h3 style="font-size: 16px; margin-top: 8px">Example</h3>
<p class="muted">Adding your teenage son as a driver on your car policy is done with an endorsement.</p>
</div>

<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 16px">
<h2 style="font-size: 20px">Where it happens in the policy flow</h2>
{flow(on=("Changes",))}
<div style="height: 1px; background: #e4e4df"></div>
<h3 style="font-size: 17px">Tom’s story</h3>
<div style="display: flex; flex-direction: column; gap: 16px">{story}</div>
</div>


<div id="check" class="box" style="padding: 24px; border: 2px solid #1d4ed8; display: flex; flex-direction: column; gap: 14px">
<div class="row" style="justify-content: space-between"><span class="label">Check yourself · 1 question</span><span class="small muted">Correct answers count toward your path progress</span></div>
<h2 style="font-size: 20px">Halfway through his policy, Tom adds his daughter as a driver. What is this change called?</h2>
{mc("tq", ["A claim","An endorsement","A renewal","A binder"], "An endorsement")}
<div class="row" style="justify-content: space-between"><span class="small muted">You’ll see this term again in a quick review in a few days.</span><button class="btn pri">Check answer</button></div>
</div>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">
<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 10px"><h2 style="font-size: 18px">Where you’ll see it</h2><div style="display: flex; gap: 8px; flex-wrap: wrap">{chips(["Policy document","Declarations page","Change request form","Policy admin system"], "chip fill")}</div></div>
<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 10px"><h2 style="font-size: 18px">US notes</h2><p class="small muted">Standard endorsement forms are often ISO forms. Some changes need state-approved wording.</p></div>
</div>

<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 4px">
<h2 style="font-size: 20px; margin-bottom: 8px">Frequently asked questions</h2>
{faq("What is an endorsement in insurance?", "An official written change to your policy after it starts.", True)}
{faq("Does an endorsement change my premium?", "", False)}
{faq("What is the difference between an endorsement and a rider?", "", False)}
</div>

<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 10px; border-style: dashed; background: transparent">
<div class="row" style="justify-content: space-between"><h2 style="font-size: 18px">Comments</h2><span class="state">Next phase · tool not decided</span></div>
<div class="ph" style="height: 56px"></div>
</div>
<div class="box" style="padding: 14px 18px; background: transparent; border-style: dashed"><p class="small"><b>Educational only.</b> This is a general explanation, not advice. What’s covered depends on your own policy wording. Ask your insurer or agent about your policy.</p></div>
<p class="small muted">Last updated Sep 30, 2026 · Source: LearnInsurance editorial + AI writer, AI reviewer</p>
</main>

<aside style="width: 340px; flex-shrink: 0; display: flex; flex-direction: column; gap: 20px">
<div class="box" style="padding: 20px">
<h2 style="font-size: 16px; margin-bottom: 6px">At a glance</h2>
{glance("Usage","Medium")}{glance("Difficulty","Beginner")}{glance("Category","Policy wording")}{glance("Insurance types","All")}{glance("Most useful for","Individuals, Developers, Product owners")}
</div>
<div class="box" style="padding: 20px; display: flex; flex-direction: column; gap: 10px">
<h2 style="font-size: 16px">Related terms</h2>
{"".join(f'<a href="Term.dc.html" class="row" style="justify-content: space-between; padding: 6px 0; text-decoration: none"><span>{t}</span><span class="small muted">{u}</span></a>' for t, u in [("Rider","Medium"),("Declarations page","High"),("Premium","High"),("Mid-term cancellation","Low"),("Policy change request","Medium")])}
</div>
<div class="box" style="padding: 20px; display: flex; flex-direction: column; gap: 12px">
<h2 style="font-size: 16px">Part of these learning paths</h2>
<a href="PathDetail.dc.html" style="text-decoration: none; display: flex; flex-direction: column; gap: 6px"><div class="row" style="justify-content: space-between"><span>Auto insurance</span><span class="small muted">term 14 of 48</span></div><div class="bar"><div style="width: 28%"></div></div></a>
<a href="PathDetail.dc.html" style="text-decoration: none; display: flex; flex-direction: column; gap: 6px"><div class="row" style="justify-content: space-between"><span>Insurance basics</span><span class="small muted">term 9 of 30</span></div><div class="bar"><div style="width: 0%"></div></div></a>
</div>
<div class="box" style="padding: 20px; display: flex; flex-direction: column; gap: 8px">
<h2 style="font-size: 16px">Something wrong?</h2>
<p class="small muted">Report an error in this explanation.</p>
<button class="btn ghost" style="align-self: flex-start">Report an issue</button>
</div>
</aside>
</div>
<div style="flex-grow: 1"></div>
""" + FOOTER
boards["Term.dc.html"] = ("3 · Term detail", H, page("Term: Endorsement", H, term))

# ---------------- 4. Glossary ----------------
H = 1240
def check(label, checked=False):
    c = ' checked="checked"' if checked else ""
    return f'<label class="row small" style="gap: 10px; min-height: 32px"><input type="checkbox"{c}>{label}</label>'
filt = lambda title, items: f'<div style="display: flex; flex-direction: column; gap: 2px; padding: 16px 0; border-top: 1px solid #e4e4df"><span class="label" style="margin-bottom: 6px">{title}</span>{"".join(items)}</div>'
rows = [
    ("Deductible","The amount you pay yourself before insurance starts paying.","High","Beginner"),
    ("Declarations page","The summary page of your policy: who, what, how much and when.","High","Beginner"),
    ("Depreciation","Loss of value over time because of age and wear.","Medium","Beginner"),
    ("Direct written premium","Premium an insurer writes itself, before reinsurance.","Low","Advanced"),
    ("Dwelling coverage","Pays to repair or rebuild the structure of your home.","High","Beginner"),
    ("Duty to defend","The insurer’s duty to pay for your legal defense in a covered lawsuit.","Medium","Intermediate"),
]
gl_rows = "".join(
    f'<a href="Term.dc.html" style="display: grid; grid-template-columns: 220px minmax(0, 1fr) 120px 120px; gap: 16px; align-items: center; padding: 16px 20px; border-top: 1px solid #e4e4df; text-decoration: none"><span style="font-weight: 600">{t}</span><span class="small muted">{d}</span><span class="chip {"dark" if u=="High" else "fill"}" style="justify-self: start">{u}</span><span class="small muted">{lv}</span></a>'
    for t, d, u, lv in rows
)
letters = "".join(f'<a href="Glossary.dc.html" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 6px; text-decoration: none; {"background: #1f1f1c; color: #ffffff" if L=="D" else ""}">{L}</a>' for L in "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
glossary = header("terms") + f"""
<div style="padding: 32px 48px 0; display: flex; flex-direction: column; gap: 16px">
<div class="row" style="justify-content: space-between"><h1 style="font-size: 34px; font-weight: 600">All terms <span class="muted" style="font-weight: 400">1,016</span></h1>
<label class="field" style="flex-direction: row; align-items: center; gap: 10px">Sort<select><option>Most used first</option><option>A–Z</option><option>Easiest first</option></select></label></div>
<nav class="box row" style="padding: 8px; gap: 2px; justify-content: space-between" aria-label="Letters">{letters}</nav>
</div>
<div style="display: flex; gap: 24px; padding: 24px 48px 48px; align-items: flex-start">
<aside class="box" style="width: 260px; flex-shrink: 0; padding: 4px 20px">
{filt("Usage", [check("High",True),check("Medium",True),check("Low")])}
{filt("Difficulty", [check("Beginner"),check("Intermediate"),check("Advanced")])}
{filt("Insurance type", [check("Life"),check("Health"),check("Auto"),check("Property"),check("Cyber / specialty"),'<a href="Glossary.dc.html" class="small">+ 8 more</a>'])}
{filt("Useful for", [check("Individuals"),check("Developers"),check("Underwriters"),check("Product owners")])}
</aside>
<div class="box" style="flex-grow: 1; overflow: hidden">
<div style="display: grid; grid-template-columns: 220px minmax(0, 1fr) 120px 120px; gap: 16px; padding: 12px 20px; background: #f4f4f1"><span class="label">Term</span><span class="label">Plain English</span><span class="label">Usage</span><span class="label">Level</span></div>
{gl_rows}
<div class="row" style="justify-content: space-between; padding: 16px 20px; border-top: 1px solid #e4e4df"><span class="small muted">Showing 1–6 of 64 “D” terms</span><div class="row" style="gap: 8px"><button class="btn ghost">Previous</button><button class="btn">Next</button></div></div>
</div>
</div>
<div style="flex-grow: 1"></div>
""" + FOOTER
boards["Glossary.dc.html"] = ("4 · Terms A–Z", H, page("Terms A–Z", H, glossary))

# ---------------- 5. Types tree ----------------
H = 1200
def node(level, name, count="", state="", selected=False):
    mark = {"open": "▾", "closed": "▸", "": "·"}[state]
    sel = "background: #1d4ed8; color: #ffffff; " if selected else ""
    cnt = f'<span class="small" style="{"color: #ffffff" if selected else "color: #5b5b55"}">{count}</span>' if count else ""
    return (f'<a href="Types.dc.html" class="row" style="{sel}gap: 10px; min-height: 36px; padding: 0 12px 0 {12 + level*24}px; border-radius: 6px; justify-content: space-between">'
            f'<span class="row" style="gap: 10px"><span aria-hidden="true" style="width: 12px">{mark}</span><span style="{"font-weight: 600" if level==0 else ""}">{name}</span></span>{cnt}</a>')
tree_nodes = "".join([
    node(0,"Life Insurance","58","open"),
    node(1,"Term Life","","closed"),
    node(1,"Permanent Life","","open"),
    node(2,"Whole Life","","closed"),
    node(2,"Universal Life","","open"),
    node(3,"Indexed Universal Life"),
    node(3,"Variable Universal Life"),
    node(1,"Annuities","","closed"),
    node(0,"Health Insurance","69","closed"),
    node(0,"Personal Property Insurance","39","closed"),
    node(0,"Auto Insurance","45","closed"),
    node(0,"Casualty &amp; Liability","43","closed"),
    node(0,"Commercial Lines","29","closed"),
    node(0,"Specialty Insurance","72","open"),
    node(1,"Cyber Insurance","12","open", True),
    node(2,"First-party cyber","","closed"),
    node(2,"Third-party cyber","","closed"),
    node(1,"Pet Insurance"),
    node(1,"Travel Insurance","","closed"),
    node(0,"Financial Lines","44","closed"),
    node(0,"Marine, Aviation &amp; Transit","44","closed"),
    node(0,"Agricultural &amp; Crop","25","closed"),
    node(0,"Social &amp; Government Programs","36","closed"),
    node(0,"Reinsurance","20","closed"),
    node(0,"Alternative Risk Transfer","27","closed"),
])
types = header("types") + f"""
<div style="padding: 32px 48px 0; display: flex; justify-content: space-between; align-items: center">
<h1 style="font-size: 34px; font-weight: 600">Insurance types <span class="muted" style="font-weight: 400">551</span></h1>
<div class="row" style="gap: 12px"><label class="input" style="height: 44px; width: 300px; border-width: 1px">{SEARCH_ICON}<input type="search" placeholder="Filter types" aria-label="Filter types" style="font-size: 14px"></label>
<div class="row box" style="padding: 4px; gap: 4px"><button class="btn pri" style="min-height: 36px">Tree</button><button class="btn ghost" style="min-height: 36px; border: 0">Map view</button></div>
<button class="btn ghost">Expand all</button></div>
</div>
<div style="display: flex; gap: 24px; padding: 24px 48px 48px; align-items: flex-start">
<nav class="box tree" style="width: 480px; flex-shrink: 0; padding: 12px; display: flex; flex-direction: column; gap: 2px" aria-label="Insurance types">{tree_nodes}</nav>
<section class="box" style="flex-grow: 1; padding: 28px; display: flex; flex-direction: column; gap: 18px">
<nav class="small muted" aria-label="Breadcrumb">Specialty Insurance › Cyber Insurance</nav>
<div class="row" style="justify-content: space-between"><h2 style="font-size: 30px">Cyber Insurance</h2><div class="row" style="gap: 10px"><span class="chip fill">Commercial &amp; personal</span><a href="TypePage.dc.html" class="btn ghost" style="min-height: 36px">Open full page →</a></div></div>
<p style="font-size: 17px">Covers the costs of data breaches, ransomware and other cyber attacks, both your own losses and claims from others.</p>
<div style="display: flex; flex-direction: column; gap: 6px"><span class="label">Example</span><p class="muted">A dental clinic is hit by ransomware. Cyber insurance pays for data recovery, customer notifications and lost income while systems are down.</p></div>
<div style="display: flex; flex-direction: column; gap: 6px"><span class="label">US notes</span><p class="muted">No federal standard form. Most states require breach notifications, which this cover often pays for.</p></div>
<div style="display: flex; flex-direction: column; gap: 10px"><span class="label">Sub-types</span><div class="row" style="gap: 8px; flex-wrap: wrap">{chips(["First-party cyber","Third-party cyber","Ransomware / cyber extortion","Business interruption","Tech E&amp;O"], href="Types.dc.html")}</div></div>
<div style="display: flex; flex-direction: column; gap: 10px"><span class="label">Key terms for this type</span><div class="row" style="gap: 8px; flex-wrap: wrap">{chips(["Retroactive date","Claims-made","Breach response","Sublimit","Waiting period","Social engineering","War exclusion"], href="Term.dc.html")}</div></div>
<div class="box" style="padding: 20px; display: flex; justify-content: space-between; align-items: center; background: #f4f4f1"><div><div style="font-weight: 600">Learn Cyber Insurance step by step</div><div class="small muted">50 terms · 5 modules · quizzes · about 2 hours</div></div><a href="PathDetail.dc.html" class="btn pri">Start learning path</a></div>
</section>
</div>
<div style="flex-grow: 1"></div>
""" + FOOTER
boards["Types.dc.html"] = ("5 · Insurance types tree", H, page("Insurance types", H, types))

# ---------------- 6. Paths ----------------
H = 1240
def tcard(name, meta, pct=None):
    if pct is None:
        right = '<span class="btn ghost" style="min-height: 36px; padding: 0 14px">Start</span>'
        bar = ""
    else:
        right = '<span class="btn" style="min-height: 36px; padding: 0 14px">Continue</span>'
        bar = f'<div style="display: flex; flex-direction: column; gap: 4px"><div class="bar"><div style="width: {pct}%"></div></div><span class="small muted">{pct}% complete</span></div>'
    return (f'<a href="Review.dc.html" class="box" style="padding: 18px; display: flex; flex-direction: column; gap: 12px; text-decoration: none">'
            f'<div class="row" style="justify-content: space-between; gap: 12px"><div><h3 style="font-size: 17px">{name}</h3><p class="small muted">{meta}</p></div>{right}</div>{bar}</a>')
type_paths = [("Life insurance","40 terms",None),("Health insurance","45 terms",None),("Auto insurance","48 terms",None),
              ("Home &amp; property","42 terms",None),("Liability","35 terms",None),("Commercial insurance","45 terms",None),
              ("Cyber insurance","50 terms",42),("Financial lines","38 terms",None),("Marine &amp; aviation","32 terms",None),
              ("Crop &amp; agriculture","25 terms",None),("Government programs","30 terms",None),("Reinsurance","30 terms",None)]
paths = header("paths", True) + f"""
<div style="padding: 32px 48px 0; display: flex; flex-direction: column; gap: 20px">
<h1 style="font-size: 34px; font-weight: 600">Learning paths</h1>
<a href="PathDetail.dc.html" class="box" style="padding: 24px; display: flex; gap: 24px; align-items: center; border: 2px solid #1f1f1c; text-decoration: none">
<div class="ph" style="width: 120px; height: 88px; flex-shrink: 0"></div>
<div style="flex-grow: 1; display: flex; flex-direction: column; gap: 6px"><span class="label">Start here</span><h2 style="font-size: 22px">Insurance basics</h2><p class="small muted">The words every insurance type uses: premium, deductible, claim, coverage, policy and more. 30 terms.</p><div class="bar" style="max-width: 520px"><div style="width: 100%"></div></div><span class="small muted">Completed</span></div>
<span class="btn">Review</span></a>
<div style="display: flex; flex-direction: column; gap: 4px"><h2 style="font-size: 22px">By insurance type</h2><p class="small muted">One path per insurance type. Each ends with a quiz.</p></div>
</div>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; padding: 16px 48px 48px">
{"".join(tcard(n, m, p) for n, m, p in type_paths)}
</div>
<div style="flex-grow: 1"></div>
""" + FOOTER
boards["Paths.dc.html"] = ("6 · Learning paths", H, page("Learning paths", H, paths))

# ---------------- 7. Path detail ----------------
H = 1300
def item(name, status):
    icon = {"done": ('✓', "background: #1f1f1c; color: #ffffff"), "now": ('•', "background: #1d4ed8; color: #ffffff"), "todo": ('', "border: 1.5px solid #bdbdb7")}[status]
    extra = '<span class="small" style="color: #1d4ed8; font-weight: 600">Up next</span>' if status == "now" else ""
    return (f'<a href="Learn.dc.html" class="row" style="gap: 12px; min-height: 40px; padding: 0 12px; border-radius: 6px; text-decoration: none; {"background: #eef2ff" if status=="now" else ""}">'
            f'<span style="width: 22px; height: 22px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 13px; box-sizing: border-box; {icon[1]}" aria-hidden="true">{icon[0]}</span><span style="flex-grow: 1">{name}</span>{extra}</a>')
def module(n, title, meta, items, quiz, open_=True):
    body = "".join(item(a, b) for a, b in items) if open_ else ""
    return (f'<div class="box" style="padding: 20px; display: flex; flex-direction: column; gap: 10px">'
            f'<div class="row" style="justify-content: space-between"><div><span class="label">Module {n}</span><h3 style="font-size: 18px">{title}</h3></div><div class="row" style="gap: 12px"><span class="small muted">{meta}</span>{quiz}</div></div>{body}</div>')
pdetail = header("paths", True) + f"""
<div style="padding: 28px 48px 0; display: flex; flex-direction: column; gap: 14px">
<nav class="small muted" aria-label="Breadcrumb"><a href="Paths.dc.html">Learning paths</a> / Cyber insurance</nav>
<div class="row" style="justify-content: space-between; align-items: flex-end">
<div style="display: flex; flex-direction: column; gap: 8px"><h1 style="font-size: 38px; font-weight: 600">Cyber insurance</h1><p class="muted">From “what is cyber insurance” to claims and underwriting. 50 terms in 5 modules.</p></div>
<div class="row" style="gap: 8px"><a href="Quiz.dc.html" class="btn">Final quiz</a><a href="Review.dc.html" class="btn pri">Continue learning</a></div>
</div>
<div class="box" style="padding: 20px 24px; display: flex; gap: 32px; align-items: center">
<div style="flex-grow: 1; display: flex; flex-direction: column; gap: 8px"><div class="row" style="justify-content: space-between"><span style="font-weight: 600">Your progress</span><span style="font-weight: 600">42%</span></div><div class="bar" style="height: 12px; border-radius: 6px"><div style="width: 42%"></div></div></div>
<div><div style="font-weight: 600; font-size: 20px">21 / 50</div><div class="small muted">answered correctly</div></div>
<div><div style="font-weight: 600; font-size: 20px">1 / 5</div><div class="small muted">quizzes passed</div></div>
</div>
</div>
<div style="display: flex; gap: 24px; padding: 20px 48px 48px; align-items: flex-start">
<div style="flex-grow: 1; display: flex; flex-direction: column; gap: 14px">
{module(1, "Cyber basics", "10 terms · done", [], '<span class="chip dark">Quiz 9/10 ✓</span>', False)}
{module(2, "Coverages", "11 of 12 left", [("First-party vs third-party","done"),("Breach response costs","done"),("Business interruption","now"),("Cyber extortion / ransomware","todo"),("Data restoration","todo"),("Social engineering fraud","todo")], '<a href="Quiz.dc.html" class="btn ghost" style="min-height: 36px">Module quiz</a>')}
{module(3, "Claims &amp; incident response", "10 terms", [], '<span class="small muted">Quiz</span>', False)}
{module(4, "Underwriting &amp; pricing", "10 terms", [], '<span class="small muted">Quiz</span>', False)}
{module(5, "Policy wording", "8 terms", [], '<span class="small muted">Quiz</span>', False)}
</div>
<aside style="width: 340px; flex-shrink: 0; display: flex; flex-direction: column; gap: 16px">
<div class="box" style="padding: 20px; display: flex; flex-direction: column; gap: 8px"><h2 style="font-size: 16px">You’ll be able to</h2><p class="small muted">Read a cyber policy, follow a claim from breach to payment, and talk with underwriters using the right words.</p></div>
<div class="box" style="padding: 20px; display: flex; flex-direction: column; gap: 8px"><h2 style="font-size: 16px">Order</h2><p class="small muted">Terms go from Beginner to Advanced and from most used to least used. Progress counts terms you answer correctly.</p></div>
</aside>
</div>
<div style="flex-grow: 1"></div>
""" + FOOTER
boards["PathDetail.dc.html"] = ("7 · Path detail (Ram’s cyber path)", H, page("Path: Cyber insurance", H, pdetail))

# ---------------- 8. Learn card ----------------
H = 1180
seg = lambda w, bg, fg, txt: f'<div style="flex-grow: {w}; flex-basis: 0; height: 44px; background: {bg}; color: {fg}; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; border-radius: 4px">{txt}</div>'
learn = header("paths", True) + f"""
<div style="padding: 20px 48px; background: #ffffff; border-bottom: 1px solid #cfcfca; display: flex; align-items: center; gap: 24px">
<a href="PathDetail.dc.html" class="small">← Cyber insurance</a>
<div style="flex-grow: 1" class="bar"><div style="width: 42%"></div></div>
<span class="small" style="font-weight: 500">Term 22 of 50 · 21 answered correctly · 42%</span>
</div>
<div style="display: flex; justify-content: center; padding: 32px 48px">
<article class="box" style="width: 1080px; padding: 36px; display: flex; flex-direction: column; gap: 20px; border: 2px solid #1f1f1c">
<div class="row" style="justify-content: space-between"><span class="label">Module 2 · Coverages</span><div class="row" style="gap: 6px">{chips(["High usage"],"chip dark")}{chips(["Beginner"],"chip fill")}</div></div>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px">
<div style="display: flex; flex-direction: column; gap: 14px">
<h1 style="font-size: 36px; font-weight: 600">Business interruption</h1>
<p style="font-size: 18px">Pays the income you lose while your business can’t run because of a covered event, like a cyber attack.</p>
<div class="box" style="padding: 16px; background: #f4f4f1; display: flex; flex-direction: column; gap: 6px"><span class="label">Maria’s story</span><p class="muted">Maria’s online store is down for 3 days after ransomware. She normally earns $2,000/day. After a 12-hour waiting period, her policy pays about $5,000 of lost income.</p></div>
<a href="Term.dc.html" class="small">Read full term page →</a>
</div>
<figure class="box" style="margin: 0; padding: 20px; display: flex; flex-direction: column; gap: 14px; background: #fafaf8">
<div class="row" style="justify-content: space-between"><span class="label">See it</span><span class="state">Diagram template: timeline</span></div>
<div class="row small muted" style="justify-content: space-between"><span>Mon 9am · attack</span><span>Thu 9am · back online</span></div>
<div class="row" style="gap: 4px">{seg(1, "#cfcfca", "#1f1f1c", "12 hr wait")}{seg(5, "#1d4ed8", "#ffffff", "Covered: lost income paid")}</div>
<div class="row" style="gap: 16px"><span class="row small" style="gap: 6px"><span style="width: 12px; height: 12px; background: #cfcfca; border-radius: 2px"></span>Waiting period (you pay)</span><span class="row small" style="gap: 6px"><span style="width: 12px; height: 12px; background: #1d4ed8; border-radius: 2px"></span>Insurer pays</span></div>
<div style="height: 1px; background: #e4e4df"></div>
<span class="label">Where it happens</span>
{flow(on=("Claim",))}
</figure>
</div>
<div style="display: flex; flex-direction: column; gap: 12px; padding-top: 20px; border-top: 1px solid #e4e4df">
<span class="label">Check yourself</span>
<h2 style="font-size: 20px">A bakery’s card system is hacked and it closes for 2 days. Which part of its cyber policy pays for lost sales?</h2>
{mc("lq", ["Third-party liability","Business interruption","Data restoration","Regulatory fines"], "Business interruption")}
</div>
<div class="row" style="justify-content: space-between">
<a href="Learn.dc.html" class="btn ghost">← Previous</a>
<div class="row" style="gap: 8px"><a href="Learn.dc.html" class="btn">Skip</a><a href="Learn.dc.html" class="btn pri">Check answer &amp; next →</a></div>
</div>
</article>
</div>
<div style="flex-grow: 1"></div>
""" + FOOTER
boards["Learn.dc.html"] = ("8 · Learn one term at a time", H, page("Learn: Business interruption", H, learn))

# ---------------- 7b. Quick review ----------------
H = 1300
dots = "".join(f'<span style="width: 40px; height: 8px; border-radius: 4px; background: {c}"></span>' for c in ["#1f1f1c", "#1d4ed8", "#cfcfca", "#cfcfca"])
review = header("paths", True) + f"""
<div style="display: flex; justify-content: center; padding: 48px">
<article class="box" style="width: 820px; padding: 36px; display: flex; flex-direction: column; gap: 20px; border: 2px solid #1f1f1c">
<div class="row" style="justify-content: space-between"><span class="label">Quick review before you continue</span><a href="Learn.dc.html" class="small">Skip review</a></div>
<div class="row" style="gap: 6px">{dots}<span class="small muted" style="margin-left: 8px">2 of 4</span></div>
<p class="muted">You learned this term 3 days ago.</p>
<h2 style="font-size: 24px; line-height: 1.35">A cyber policy only covers incidents that happened after a certain date. What is that date called?</h2>
{mc("rq", ["Effective date","Retroactive date","Renewal date","Waiting period"], "Retroactive date")}
<div class="box" style="padding: 16px 20px; display: flex; flex-direction: column; gap: 4px; background: #f4f4f1"><span style="font-weight: 600">✓ Correct</span><p class="small muted">Retroactive date: the earliest date an incident can happen and still be covered.</p></div>
<div class="row" style="justify-content: space-between"><span class="small muted">Terms you miss come back in the next review.</span><a href="Learn.dc.html" class="btn pri">Next →</a></div>
</article>
</div>
<div style="display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 0 48px 48px">
<span class="state">Empty state · nothing to review</span>
<div class="box" style="width: 820px; padding: 36px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center">
<div style="width: 56px; height: 56px; border-radius: 28px; background: #1f1f1c; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 24px" aria-hidden="true">✓</div>
<h2 style="font-size: 24px">You’re all caught up</h2><p class="muted">No terms to review today. Keep going with your path.</p>
<a href="Learn.dc.html" class="btn pri">Continue learning</a></div>
</div>
<div style="flex-grow: 1"></div>
""" + FOOTER
boards["Review.dc.html"] = ("7b · Quick review (start of each session)", H, page("Quick review", H, review))

# ---------------- 9. Quiz ----------------
H = 1000
def opt(t, st=""):
    style = {"sel": "border: 2px solid #1d4ed8; background: #eef2ff", "": "border: 1px solid #bdbdb7"}[st]
    c = ' checked="checked"' if st == "sel" else ""
    return f'<label class="row" style="gap: 14px; min-height: 56px; padding: 0 18px; border-radius: 10px; background: #ffffff; {style}"><input type="radio" name="q3"{c}>{t}</label>'
quiz = header("paths", True) + f"""
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; padding: 32px 48px">
<div style="display: flex; flex-direction: column; gap: 16px">
<span class="state">Question</span>
<div class="box" style="padding: 32px; display: flex; flex-direction: column; gap: 18px">
<div class="row" style="justify-content: space-between"><span class="label">Module 2 quiz · Cyber coverages</span><span class="small muted">Question 3 of 10</span></div>
<div class="bar"><div style="width: 30%"></div></div>
<h2 style="font-size: 22px; line-height: 1.35">Maria’s store is offline for 3 days after a ransomware attack. Which coverage pays for her lost sales?</h2>
<div style="display: flex; flex-direction: column; gap: 10px">{opt("Third-party liability")}{opt("Business interruption","sel")}{opt("Data restoration")}{opt("Regulatory fines")}</div>
<button class="btn pri" style="align-self: flex-end">Check answer</button>
</div>
<span class="state">After answering</span>
<div class="box" style="padding: 20px 24px; display: flex; flex-direction: column; gap: 6px; border: 2px solid #1f1f1c"><div style="font-weight: 600">✓ Correct</div><p class="small muted">Business interruption pays lost income while the business can’t operate. <a href="Term.dc.html">Review the term</a></p></div>
</div>
<div style="display: flex; flex-direction: column; gap: 16px">
<span class="state">Result</span>
<div class="box" style="padding: 32px; display: flex; flex-direction: column; gap: 18px; align-items: flex-start">
<span class="label">Module 2 quiz complete</span>
<div style="font-size: 56px; font-weight: 600; line-height: 1">8 / 10</div>
<span class="chip dark">Passed · 80%</span>
<p class="muted">You need 70% to pass. Your progress is saved to your account.</p>
<div style="width: 100%; display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #e4e4df; padding-top: 16px"><span class="label">Review what you missed</span>
<a href="Term.dc.html" class="row" style="justify-content: space-between"><span>Q6 · Social engineering fraud</span><span class="small muted">Review →</span></a>
<a href="Term.dc.html" class="row" style="justify-content: space-between"><span>Q9 · Waiting period</span><span class="small muted">Review →</span></a></div>
<div class="row" style="gap: 8px"><a href="Quiz.dc.html" class="btn">Retake</a><a href="PathDetail.dc.html" class="btn pri">Continue to module 3</a></div>
</div>
</div>
</div>
<div style="flex-grow: 1"></div>
""" + FOOTER
boards["Quiz.dc.html"] = ("9 · Quiz", H, page("Quiz", H, quiz))

# ---------------- 10. Dashboard ----------------
H = 1080
stat = lambda n, l: f'<div class="box" style="padding: 20px; display: flex; flex-direction: column; gap: 4px"><div style="font-size: 32px; font-weight: 600">{n}</div><div class="small muted">{l}</div></div>'
prow = lambda n, p, meta: f'<a href="PathDetail.dc.html" style="display: flex; flex-direction: column; gap: 8px; padding: 14px 0; border-top: 1px solid #e4e4df; text-decoration: none"><div class="row" style="justify-content: space-between"><span style="font-weight: 500">{n}</span><span class="small muted">{meta}</span></div><div class="bar"><div style="width: {p}%"></div></div></a>'
dash = header("", True) + f"""
<div style="padding: 32px 48px 0; display: flex; flex-direction: column; gap: 20px">
<h1 style="font-size: 34px; font-weight: 600">Hi Ram</h1>
<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px">{stat("51","Terms answered correctly")}{stat("2","Paths in progress")}{stat("3","Quizzes passed")}{stat("86%","Average quiz score")}</div>
</div>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; padding: 20px 48px 48px">
<div class="box" style="padding: 24px"><h2 style="font-size: 18px; margin-bottom: 8px">My paths</h2>
{prow("Cyber insurance",42,"42% · 21 of 50")}{prow("Insurance basics",100,"Completed")}{prow("Auto insurance",0,"Not started")}</div>
<div style="display: flex; flex-direction: column; gap: 20px">
<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 10px"><h2 style="font-size: 18px">Recently learned</h2><div class="row" style="gap: 8px; flex-wrap: wrap">{chips(["Breach response","First-party cyber","Third-party cyber","Retroactive date","Claims-made"], href="Term.dc.html")}</div></div>
<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 10px"><h2 style="font-size: 18px">Saved terms</h2><div class="row" style="gap: 8px; flex-wrap: wrap">{chips(["Subrogation","Endorsement","Sublimit"], href="Term.dc.html")}</div></div>
<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 4px"><h2 style="font-size: 18px; margin-bottom: 6px">My term requests</h2>
<a href="Term.dc.html" class="row" style="justify-content: space-between; padding: 10px 0; border-top: 1px solid #e4e4df; text-decoration: none"><span>hammer clause</span><span class="chip dark">Published</span></a>
<div class="row" style="justify-content: space-between; padding: 10px 0; border-top: 1px solid #e4e4df"><span>silent cyber</span><span class="chip fill">AI review in progress</span></div></div>
</div>
</div>
<div style="flex-grow: 1"></div>
""" + FOOTER
boards["Dashboard.dc.html"] = ("10 · My progress", H, page("My progress", H, dash))

# ---------------- 11. Sign in ----------------
H = 900
signin = header("paths") + f"""
<div style="flex-grow: 1; position: relative; background: #d8d8d3; display: flex; align-items: center; justify-content: center">
<div class="box" role="dialog" aria-label="Sign in" style="width: 420px; padding: 36px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 12px 40px rgba(0,0,0,0.12)">
<span class="state" style="align-self: flex-start">Clerk sign-in</span>
<h2 style="font-size: 24px">Sign in to track your progress</h2>
<p class="small muted">Save learned terms, see your % per path and take quizzes.</p>
<button class="btn" style="width: 100%"><span class="ph" style="width: 18px; height: 18px; border-radius: 9px"></span>Continue with Google</button>
<div class="row" style="gap: 12px"><div style="flex-grow: 1; height: 1px; background: #cfcfca"></div><span class="small muted">or</span><div style="flex-grow: 1; height: 1px; background: #cfcfca"></div></div>
<label class="field">Email<input type="email" placeholder="you@example.com"></label>
<a href="Paths.dc.html" class="btn pri" style="width: 100%">Continue</a>
<p class="small muted" style="text-align: center">No account? <a href="SignIn.dc.html">Sign up</a></p>
</div>
</div>
"""
boards["SignIn.dc.html"] = ("11 · Sign in / sign up", H, page("Sign in", H, signin))

# ---------------- 12. Pipeline ----------------
H = 900
step = lambda n, t, d, who: f'<div class="box" style="width: 200px; padding: 18px; display: flex; flex-direction: column; gap: 8px; flex-shrink: 0"><span class="label">Step {n} · {who}</span><div style="font-weight: 600">{t}</div><p class="small muted">{d}</p></div>'
arr = '<span class="arrow" aria-hidden="true" style="font-size: 22px">→</span>'
pipe = header() + f"""
<div style="padding: 40px 48px; display: flex; flex-direction: column; gap: 28px">
<div style="display: flex; flex-direction: column; gap: 8px"><span class="label">Behind the scenes · no manual steps</span><h1 style="font-size: 34px; font-weight: 600">How a requested term gets published</h1></div>
<div class="row" style="gap: 12px; align-items: stretch">
{step(1,"User requests a term","From the search page when a term isn’t found.","App")}<div class="row">{arr}</div>
{step(2,"GitHub issue created","Labelled term-request, with the term and context.","GitHub")}<div class="row">{arr}</div>
{step(3,"Writer agent","Validates it’s a real US term, researches, writes the full entry.","Claude")}<div class="row">{arr}</div>
{step(4,"Reviewer agent","Checks accuracy and format. Sends it back to the writer if needed.","Claude")}<div class="row">{arr}</div>
{step(5,"Publish","Commits the content file with the AI tag. Vercel redeploys. Issue closed.","Keystatic + Vercel")}
</div>
<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 12px">
<h2 style="font-size: 18px">What the writer agent creates for each term</h2>
<div class="row" style="gap: 8px; flex-wrap: wrap">{chips(["Quick answer (AEO)","Plain-English definition","Example","Policy-flow stages","Person story (e.g. Tom)","Visual (pick a diagram template)","Check-yourself question","FAQs + schema","Meta title &amp; description (SEO)","Related terms","Usage frequency","Difficulty","Insurance types","US notes","AI-generated tag"],"chip fill")}</div>
</div>
<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 12px">
<h2 style="font-size: 18px">Stack</h2>
<div class="row" style="gap: 8px; flex-wrap: wrap">{chips(["Astro","Keystatic","Pagefind search","Vercel","Clerk auth","PostHog analytics","Google Search Console","GitHub Issues + Actions","Claude agents"],"chip")}</div>
</div>
</div>
<div style="flex-grow: 1"></div>
""" + FOOTER
boards["Pipeline.dc.html"] = ("12 · Auto term pipeline", H, page("Term pipeline", H, pipe))

# ---------------- 5b. Type page ----------------
H = 1640
sub = lambda n, d: f'<a href="TypePage.dc.html" class="box" style="padding: 16px; display: flex; flex-direction: column; gap: 4px; text-decoration: none"><span style="font-weight: 600">{n}</span><span class="small muted">{d}</span></a>'
typepage = header("types") + f"""
<div style="padding: 28px 48px 0; display: flex; flex-direction: column; gap: 12px">
<nav class="small muted" aria-label="Breadcrumb"><a href="Types.dc.html">Insurance types</a> / <a href="Types.dc.html">Specialty Insurance</a> / Cyber Insurance</nav>
<div class="row" style="justify-content: space-between; align-items: flex-end">
<div style="display: flex; flex-direction: column; gap: 10px"><span class="small muted">URL: /types/cyber-insurance</span><h1 style="font-size: 44px; font-weight: 600">Cyber Insurance</h1><div class="row" style="gap: 8px">{chips(["Commercial &amp; personal","12 sub-types","50 key terms"],"chip fill")}</div></div>
<div class="row" style="gap: 8px"><a href="Types.dc.html" class="btn ghost">View in tree</a><a href="PathDetail.dc.html" class="btn pri">Start learning path</a></div>
</div>
</div>
<div style="display: flex; gap: 32px; padding: 24px 48px 48px; align-items: flex-start">
<main style="flex-grow: 1; display: flex; flex-direction: column; gap: 20px; min-width: 0">
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">
<div class="box" style="padding: 24px; border: 2px solid #1f1f1c; display: flex; flex-direction: column; gap: 8px"><span class="label">Quick answer</span><p style="font-size: 18px">Cyber insurance pays for the costs of data breaches and cyber attacks: your own losses (first-party) and claims from others (third-party).</p></div>
<figure class="box" style="margin: 0; padding: 20px; display: flex; flex-direction: column; gap: 12px; background: #fafaf8"><div class="row" style="justify-content: space-between"><span class="label">See it</span><span class="state">Diagram template: split</span></div>
<div class="row" style="gap: 10px; align-items: stretch">{pcard_mini("First-party · your losses", ["Data recovery","Business interruption","Ransom / extortion"])}{pcard_mini("Third-party · others sue you", ["Customer lawsuits","Regulatory fines","Media liability"], True)}</div></figure>
</div>
<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 8px"><h2 style="font-size: 20px">Who buys it</h2><p class="muted">Any business that stores customer data or depends on computers, from dental clinics to online stores. Some personal policies exist too.</p><h3 style="font-size: 16px; margin-top: 8px">Example</h3><p class="muted">A dental clinic is hit by ransomware. Cyber insurance pays for data recovery, customer notices and lost income.</p></div>
<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 14px"><h2 style="font-size: 20px">Types of cyber insurance</h2>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px">{sub("First-party cyber","Your own costs after an attack")}{sub("Third-party cyber","Claims from customers and others")}{sub("Cyber extortion","Ransom and negotiation costs")}{sub("Business interruption","Income lost while systems are down")}{sub("Tech E&amp;O","Errors in tech products or services")}{sub("Personal cyber","Identity theft and online fraud for individuals")}</div></div>
<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 14px"><div class="row" style="justify-content: space-between"><h2 style="font-size: 20px">Key terms, most used first</h2><a href="Glossary.dc.html" class="small">All 50 terms →</a></div>
<div class="row" style="gap: 8px; flex-wrap: wrap">{chips(["Claims-made","Retroactive date","Breach response","Business interruption","Ransomware","Sublimit"],"chip dark")}{chips(["Waiting period","Social engineering","War exclusion","Dependent business interruption","Betterment"],"chip")}</div></div>
<div class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 4px"><h2 style="font-size: 20px; margin-bottom: 8px">Frequently asked questions</h2>{faq("What does cyber insurance cover?", "Your own costs after a cyber attack and claims others make against you.", True)}{faq("Do small businesses need cyber insurance?", "", False)}{faq("Is ransomware covered?", "", False)}</div>
<div class="box" style="padding: 14px 18px; background: transparent; border-style: dashed"><p class="small"><b>Educational only.</b> Coverage varies by insurer and policy. Check your own policy wording.</p></div>
</main>
<aside style="width: 340px; flex-shrink: 0; display: flex; flex-direction: column; gap: 20px">
<div class="box" style="padding: 20px"><h2 style="font-size: 16px; margin-bottom: 6px">At a glance</h2>{glance("Parent","Specialty Insurance")}{glance("Market","Commercial &amp; personal")}{glance("Sub-types","12")}{glance("Key terms","50")}</div>
<div class="box" style="padding: 20px; display: flex; flex-direction: column; gap: 8px"><h2 style="font-size: 16px">US notes</h2><p class="small muted">No federal standard form. All 50 states have breach-notification laws, which this cover often pays for.</p></div>
<div class="box" style="padding: 20px; display: flex; flex-direction: column; gap: 8px"><h2 style="font-size: 16px">Related types</h2>{"".join(f'<a href="TypePage.dc.html" style="padding: 4px 0">{t}</a>' for t in ["Technology E&amp;O","Crime insurance","Media liability","Kidnap &amp; ransom"])}</div>
<div class="box" style="padding: 20px; display: flex; flex-direction: column; gap: 10px; background: #f4f4f1"><h2 style="font-size: 16px">Learn it step by step</h2><p class="small muted">50 terms · 5 modules · quizzes</p><a href="PathDetail.dc.html" class="btn pri">Start learning path</a></div>
</aside>
</div>
<div style="flex-grow: 1"></div>
""" + FOOTER
boards["TypePage.dc.html"] = ("5b · Insurance type page", H, page("Cyber Insurance", H, typepage))

# ---------------- Guest learning ----------------
H = 1300
guest = header("paths", False) + """
<div style="padding: 14px 48px; background: #1f1f1c; color: #ffffff; display: flex; align-items: center; gap: 16px">
<span style="flex-grow: 1">You’re learning as a guest. Your progress is saved on this device only.</span>
<a href="SignIn.dc.html" class="btn" style="min-height: 36px; border-color: #ffffff">Sign up to keep it</a></div>
""" + learn[len(header("paths", True)):].replace("21 answered correctly · 42%", "5 answered correctly · 10%").replace('<div style="width: 42%"></div>', '<div style="width: 10%"></div>', 1)
guest = guest.replace('<div style="flex-grow: 1"></div>', '''<div style="display: flex; justify-content: center; padding: 0 48px 32px"><div class="box" role="dialog" aria-label="Save your progress" style="width: 1080px; padding: 24px; display: flex; align-items: center; gap: 20px; border: 2px solid #1d4ed8">
<span class="state">Shown after 5 correct answers</span><div style="flex-grow: 1"><div style="font-weight: 600">Nice, 5 terms done. Save your progress?</div><p class="small muted">Create a free account to keep your progress on any device and track your %.</p></div>
<a href="Learn.dc.html" class="btn ghost">Maybe later</a><a href="SignIn.dc.html" class="btn pri">Sign up free</a></div></div>
<div style="flex-grow: 1"></div>''', 1)
boards["GuestLearn.dc.html"] = ("8b · Learning as a guest", H, page("Learn as guest", H, guest))

# ---------------- Settings ----------------
H = 1040
def toggle(label, desc, on):
    c = ' checked="checked"' if on else ""
    return f'<label class="row" style="gap: 16px; padding: 16px 0; border-top: 1px solid #e4e4df; justify-content: space-between"><span><span style="font-weight: 500; display: block">{label}</span><span class="small muted">{desc}</span></span><input type="checkbox"{c} style="width: 22px; height: 22px"></label>'
settings = header("", True) + f"""
<div style="padding: 32px 48px 0"><h1 style="font-size: 34px; font-weight: 600">Account settings</h1></div>
<div style="display: flex; gap: 24px; padding: 24px 48px 48px; align-items: flex-start">
<nav class="box" style="width: 240px; flex-shrink: 0; padding: 12px; display: flex; flex-direction: column; gap: 2px" aria-label="Settings">
<a href="Settings.dc.html" style="padding: 10px 12px; border-radius: 6px; background: #1f1f1c; color: #ffffff; text-decoration: none">Profile</a>
<a href="Settings.dc.html" style="padding: 10px 12px; text-decoration: none">Email preferences</a>
<a href="Settings.dc.html" style="padding: 10px 12px; text-decoration: none">Privacy &amp; data</a></nav>
<div style="flex-grow: 1; display: flex; flex-direction: column; gap: 20px">
<section class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 16px"><div class="row" style="justify-content: space-between"><h2 style="font-size: 20px">Profile</h2><span class="state">Managed by Clerk</span></div>
<div class="row" style="gap: 16px"><div style="width: 64px; height: 64px; border-radius: 32px; background: #1f1f1c; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 600">R</div><div><div style="font-weight: 600">Ram</div><div class="small muted">ram@example.com · Signed in with Google</div></div></div>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px"><label class="field">Display name<input type="text" placeholder="Ram"></label><label class="field">Email<input type="email" placeholder="ram@example.com"></label></div>
<button class="btn pri" style="align-self: flex-start">Save changes</button></section>
<section class="box" style="padding: 24px; display: flex; flex-direction: column"><h2 style="font-size: 20px; margin-bottom: 8px">Email preferences</h2>
{toggle("Term request updates", "When a term you requested is published.", True)}{toggle("Product news", "New learning paths and features. About once a month.", False)}</section>
<section class="box" style="padding: 24px; display: flex; flex-direction: column; gap: 12px"><h2 style="font-size: 20px">Privacy &amp; data</h2>
{toggle("Analytics cookies", "Helps us see which terms are useful.", True)}
<div class="row" style="justify-content: space-between; padding-top: 16px; border-top: 1px solid #e4e4df"><div><div style="font-weight: 500">Delete account</div><div class="small muted">Removes your account and all learning progress. This can’t be undone.</div></div><button class="btn" style="border-color: #b42318; color: #b42318">Delete account</button></div></section>
</div>
</div>
<div style="flex-grow: 1"></div>
""" + FOOTER
boards["Settings.dc.html"] = ("13 · Account settings", H, page("Account settings", H, settings))

# ---------------- 404 ----------------
H = 820
notfound = header() + f"""
<div style="flex-grow: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 48px; text-align: center">
<span class="label">404 · page not found</span>
<h1 style="font-size: 40px; font-weight: 600">We couldn’t find that page</h1>
<p class="muted" style="max-width: 520px">It may have moved. Try searching for the term, or request it if it’s missing.</p>
<a href="Search.dc.html" class="input" style="width: 560px; text-decoration: none">{SEARCH_ICON}<span class="muted" style="flex-grow: 1; text-align: left">Search a term</span></a>
<div class="row" style="gap: 8px"><a href="Home.dc.html" class="btn">Go home</a><a href="Search.dc.html" class="btn pri">Request a term</a></div>
</div>
""" + FOOTER
boards["NotFound.dc.html"] = ("14 · Page not found (404)", H, page("Page not found", H, notfound))

# ---------------- Mobile ----------------
MW = 390
mhdr = f'<header class="row" style="height: 60px; padding: 0 16px; gap: 12px; background: #ffffff; border-bottom: 1px solid #cfcfca; justify-content: space-between"><a href="MHome.dc.html" class="logo" style="font-size: 16px"><span class="logomark" style="width: 22px; height: 22px"></span>LearnInsurance</a><div class="row" style="gap: 4px"><a href="Search.dc.html" aria-label="Search" style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center">{SEARCH_ICON}</a><button aria-label="Menu" style="width: 44px; height: 44px; border: 0; background: transparent; display: flex; flex-direction: column; gap: 5px; align-items: center; justify-content: center"><span style="width: 20px; height: 2px; background: #1f1f1c"></span><span style="width: 20px; height: 2px; background: #1f1f1c"></span><span style="width: 20px; height: 2px; background: #1f1f1c"></span></button></div></header>'
mfoot = '<footer style="padding: 20px 16px; border-top: 1px solid #cfcfca; background: #ffffff; font-size: 12px; color: #5b5b55; display: flex; flex-direction: column; gap: 8px"><span>Educational only. Not insurance, legal or financial advice.</span><div class="row" style="gap: 16px"><a href="NotFound.dc.html">Privacy</a><a href="NotFound.dc.html">Terms of use</a><a href="MHome.dc.html">Cookies</a></div></footer>'
def mflow(on):
    st = ["Quote","Underwriting","Bind","Issue","Changes","Claim","Renewal"]
    return '<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px">' + "".join(f'<div class="stage{" on" if s in on else ""}" style="height: 36px; padding: 0 4px; font-size: 11px">{s}</div>' for s in st) + '</div>'
def mmc(name, opts, sel):
    out = []
    for o in opts:
        st = "border: 2px solid #1d4ed8; background: #eef2ff" if o == sel else "border: 1px solid #bdbdb7"
        c = ' checked="checked"' if o == sel else ""
        out.append(f'<label class="row" style="gap: 12px; min-height: 48px; padding: 0 14px; border-radius: 10px; background: #ffffff; {st}"><input type="radio" name="{name}"{c}>{o}</label>')
    return '<div style="display: flex; flex-direction: column; gap: 8px">' + "".join(out) + '</div>'

H = 1500
mhome = mhdr + f"""
<section style="padding: 32px 16px; background: #ffffff; display: flex; flex-direction: column; gap: 14px; border-bottom: 1px solid #cfcfca">
<h1 style="font-size: 30px; font-weight: 600; line-height: 1.15">Understand insurance words in plain English</h1>
<p class="muted">1,016 US insurance terms, explained simply.</p>
<a href="Search.dc.html" class="input" style="text-decoration: none; height: 52px">{SEARCH_ICON}<span class="muted">Search any term</span></a>
<div class="row" style="gap: 6px; flex-wrap: wrap">{chips(["Premium","Deductible","Claim","Coverage","Policy"], href="MTerm.dc.html")}</div>
</section>
<section style="padding: 24px 16px; display: flex; flex-direction: column; gap: 12px"><h2 style="font-size: 20px">How a policy works</h2><div class="box" style="padding: 14px">{mflow(())}</div></section>
<section style="padding: 0 16px 24px; display: flex; flex-direction: column; gap: 10px"><h2 style="font-size: 20px">Learning paths</h2>
{"".join(f'<a href="MLearn.dc.html" class="box" style="padding: 14px; display: flex; justify-content: space-between; align-items: center; text-decoration: none"><div><div style="font-weight: 500">{n}</div><div class="small muted">{d}</div></div><span class="small">Start →</span></a>' for n, d in [("Insurance basics","Start here · 30 terms"),("Auto insurance","48 terms"),("Cyber insurance","50 terms")])}</section>
<section style="padding: 0 16px 24px; display: flex; flex-direction: column; gap: 10px"><h2 style="font-size: 20px">Browse by type</h2>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px">{"".join(f'<a href="TypePage.dc.html" class="box" style="padding: 12px; text-decoration: none; font-weight: 500">{n}</a>' for n in ["Life","Health","Auto","Home","Liability","Cyber"])}</div></section>
<div style="flex-grow: 1"></div>
""" + mfoot
boards["MHome.dc.html"] = ("M1 · Home (mobile)", H, page("Home mobile", H, mhome, w=MW))

H = 2100
mterm = mhdr + f"""
<div style="padding: 20px 16px; display: flex; flex-direction: column; gap: 14px">
<nav class="small muted" aria-label="Breadcrumb">Terms / Endorsement</nav>
<h1 style="font-size: 32px; font-weight: 600">Endorsement</h1>
<div class="row" style="gap: 6px; flex-wrap: wrap">{chips(["Medium usage"],"chip dark")}{chips(["Beginner"],"chip fill")}<span class="chip ai">AI-generated</span></div>
<div class="box" style="padding: 16px; border: 2px solid #1f1f1c; display: flex; flex-direction: column; gap: 6px"><span class="label">Quick answer</span><p>An official change to your policy after it starts, like a new address or extra coverage.</p></div>
<figure class="box" style="margin: 0; padding: 14px; display: flex; flex-direction: column; gap: 8px; background: #fafaf8"><span class="label">See it</span>
{pcard_mini("Policy · Jan 1", ["$100 / month","Old address"])}
<div class="row" style="justify-content: center; gap: 8px"><span class="arrow" aria-hidden="true">↓</span><span class="chip dark">Endorsement</span></div>
{pcard_mini("Policy · Jan 20", ["<b>$120 / month</b>","<b>New address + collision</b>"], True)}</figure>
<div class="box" style="padding: 16px; display: flex; flex-direction: column; gap: 10px"><h2 style="font-size: 18px">Where it happens</h2>{mflow(("Changes",))}</div>
<div class="box" style="padding: 16px; display: flex; flex-direction: column; gap: 12px"><h2 style="font-size: 18px">Tom’s story</h2>
{"".join(f'<div class="row" style="gap: 12px; align-items: flex-start"><div style="width: 28px; height: 28px; flex-shrink: 0; border-radius: 14px; {"background: #1d4ed8; color: #ffffff" if s=="Changes" else "background: #e4e4df"}; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600">{i+1}</div><div><div style="font-weight: 600">{s}</div><p class="small muted">{t}</p></div></div>' for i, (s, t) in enumerate(story_steps))}</div>
<div class="box" style="padding: 16px; border: 2px solid #1d4ed8; display: flex; flex-direction: column; gap: 12px"><span class="label">Check yourself</span><h2 style="font-size: 17px">Tom adds his daughter as a driver mid-policy. What is this called?</h2>
{mmc("mq", ["A claim","An endorsement","A renewal"], "An endorsement")}<button class="btn pri">Check answer</button></div>
<div class="box" style="padding: 12px 14px; background: transparent; border-style: dashed"><p class="small"><b>Educational only.</b> Your own policy wording decides what’s covered.</p></div>
</div>
<div style="flex-grow: 1"></div>
""" + mfoot
boards["MTerm.dc.html"] = ("M2 · Term page (mobile)", H, page("Term mobile", H, mterm, w=MW))

H = 1100
mlearn = mhdr + f"""
<div style="padding: 12px 16px; background: #ffffff; border-bottom: 1px solid #cfcfca; display: flex; flex-direction: column; gap: 6px"><div class="row" style="justify-content: space-between"><a href="PathDetail.dc.html" class="small">← Cyber</a><span class="small">22 of 50 · 42%</span></div><div class="bar"><div style="width: 42%"></div></div></div>
<div style="padding: 20px 16px; display: flex; flex-direction: column; gap: 14px">
<h1 style="font-size: 28px; font-weight: 600">Business interruption</h1>
<p>Pays the income you lose while your business can’t run after a covered event.</p>
<figure class="box" style="margin: 0; padding: 14px; display: flex; flex-direction: column; gap: 8px; background: #fafaf8"><span class="label">See it</span>
<div class="row" style="gap: 4px">{seg(1, "#cfcfca", "#1f1f1c", "Wait")}{seg(5, "#1d4ed8", "#ffffff", "Lost income paid")}</div>
<div class="row small muted" style="justify-content: space-between"><span>Attack</span><span>Back online</span></div></figure>
<div class="box" style="padding: 14px; background: #f4f4f1"><span class="label">Maria’s story</span><p class="small muted">Store down 3 days after ransomware. Policy pays about $5,000 of lost income.</p></div>
<span class="label">Check yourself</span>
<h2 style="font-size: 17px">A bakery closes 2 days after a hack. What pays for lost sales?</h2>
{mmc("ml", ["Third-party liability","Business interruption","Data restoration"], "Business interruption")}
<a href="MLearn.dc.html" class="btn pri" style="width: 100%">Check answer &amp; next →</a>
</div>
<div style="flex-grow: 1"></div>
"""
boards["MLearn.dc.html"] = ("M3 · Learn card (mobile)", H, page("Learn mobile", H, mlearn, w=MW))

# write every board file (including ones not in rows_def)
for f, (title, h, html) in boards.items():
    with open(os.path.join(OUT, f), "w") as fh:
        fh.write(html)
