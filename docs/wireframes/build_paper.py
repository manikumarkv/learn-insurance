"""Builds the Paper Design mockups (PD*.dc.html) into ./source.

These use the real Paper Design components (window.PaperDesign) installed on the
canvas under ds/paperdesign/, so they only render on the live canvas, not as
plain HTML previews.

Run: python3 docs/wireframes/build_paper.py
"""
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "source")
W = 1280

CSS = """
:root{--font-sans:"Lato","Helvetica Neue",Arial,sans-serif;--space-1:4px;--space-2:8px;--space-3:12px;--space-4:16px;--space-6:24px;--space-8:32px;--radius-sm:3px;--radius-md:8px;--radius-full:9999px;--border-thin:1px;--border:2px;--border-thick:3px}
body{margin:0;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}
a{color:var(--ink);text-underline-offset:4px}
a:hover{text-decoration-thickness:2px}
h1,h2,h3,p{margin:0}
.t-headline{font-size:28px;line-height:36px;font-weight:700}
.t-title-lg{font-size:24px;line-height:32px;font-weight:700}
.t-title-md{font-size:20px;line-height:28px;font-weight:700}
.t-title-sm{font-size:16px;line-height:24px;font-weight:700}
.t-body-lg{font-size:20px;line-height:32px}
.t-body{font-size:18px;line-height:28px}
.t-body-sm{font-size:15px;line-height:22px;color:var(--ink-muted)}
.t-label{font-size:15px;line-height:20px;font-weight:700}
.t-label-sm{font-size:14px;line-height:18px;font-weight:700;letter-spacing:.02em}
"""

THEMES = {
    "light":    {"paper": "#f7f6f2", "sunken": "#eceae4", "ink": "#1b1a18", "muted": "#55534e", "faint": "#67655f", "onink": "#f7f6f2", "focus": "0 0 0 3px #f7f6f2, 0 0 0 5px #1b1a18", "name": "Soft light"},
    "dark":     {"paper": "#171716", "sunken": "#232321", "ink": "#ebe9e3", "muted": "#aeaba3", "faint": "#8f8c85", "onink": "#171716", "focus": "0 0 0 3px #171716, 0 0 0 5px #ebe9e3", "name": "Soft dark"},
    "light-hc": {"paper": "#ffffff", "sunken": "#e6e6e6", "ink": "#000000", "muted": "#333333", "faint": "#4d4d4d", "onink": "#ffffff", "focus": "0 0 0 3px #ffffff, 0 0 0 5px #000000", "name": "High contrast light"},
    "dark-hc":  {"paper": "#000000", "sunken": "#262626", "ink": "#ffffff", "muted": "#cccccc", "faint": "#b3b3b3", "onink": "#000000", "focus": "0 0 0 3px #000000, 0 0 0 5px #ffffff", "name": "High contrast dark"},
}

JS_THEMES = "{" + ",".join(
    f'"{k}":{{paper:"{v["paper"]}",sunken:"{v["sunken"]}",ink:"{v["ink"]}",muted:"{v["muted"]}",faint:"{v["faint"]}",onink:"{v["onink"]}",focus:"{v["focus"]}",name:"{v["name"]}"}}'
    for k, v in THEMES.items()) + "}"

ROOT_VARS = ("--paper: {{t.paper}}; --paper-sunken: {{t.sunken}}; --ink: {{t.ink}}; --ink-muted: {{t.muted}}; "
             "--ink-faint: {{t.faint}}; --on-ink: {{t.onink}}; --line: {{t.ink}}; --link: {{t.ink}}; --focus-ring: {{t.focus}}; "
             "background: var(--paper); color: var(--ink); font-family: var(--font-sans); font-size: 18px; line-height: 28px")


def x(comp, attrs="", children=""):
    a = f" {attrs}" if attrs else ""
    return f'<x-import component-from-global-scope="PaperDesign.{comp}"{a}>{children}</x-import>'


def icon(name, size=None):
    s = f' size="{{{{s{size}}}}}"' if size else ""
    return x("Icon", f'name="{name}"{s}')


def badge(text, tone="outline", ic=None):
    i = f' icon="{ic}"' if ic else ""
    return x("Badge", f'tone="{tone}"{i}', text)


def btn(text, variant="secondary", ic=None, icr=None, size=None, extra=""):
    a = f'variant="{variant}"'
    if ic: a += f' icon="{ic}"'
    if icr: a += f' icon-right="{icr}"'
    if size: a += f' size="{size}"'
    if extra: a += " " + extra
    return x("Button", a, text)


def page(title, w, h, body):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
<link rel="stylesheet" href="ds/paperdesign/components/bundle.css">
<script src="ds/paperdesign/components/bundle.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&amp;display=swap">
<style>{CSS}</style>
</helmet>
<div style="width: {w}px; height: {h}px; box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden; {ROOT_VARS}">
{body}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"theme":{{"editor":"enum","options":["light","dark","light-hc","dark-hc"],"default":"light","section":"Paper Design"}},"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
renderVals() {{
const themes = {JS_THEMES};
const t = themes[this.props.theme ?? 'light'] ?? themes.light;
return {{ t: t, s16: 16, s20: 20, s24: 24, yes: true }};
}}
}}
</script>
</body>
</html>
"""


def header(active=""):
    def nav(href, label, key):
        dec = "underline; text-decoration-thickness: 3px" if key == active else "none"
        return f'<a href="{href}" class="t-label" style="font-size: 17px; text-decoration: {dec}; text-underline-offset: 8px">{label}</a>'
    return f"""<header style="display: flex; align-items: center; gap: 32px; height: 76px; padding: 0 48px; border-bottom: var(--border) solid var(--ink); box-sizing: border-box; flex-shrink: 0">
<a href="PDHome.dc.html" style="display: flex; align-items: center; gap: 10px; text-decoration: none"><span style="width: 26px; height: 26px; border: var(--border-thick) solid var(--ink); border-radius: var(--radius-sm); box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px">L</span><span class="t-title-md">LearnInsurance</span></a>
<nav style="display: flex; gap: 28px; flex-grow: 1" aria-label="Main">{nav("PDHome.dc.html", "Terms A–Z", "terms")}{nav("PDHome.dc.html", "Insurance types", "types")}{nav("PDLearn.dc.html", "Learning paths", "paths")}</nav>
{btn("Search", "ghost", ic="search", size="sm")}
{btn("{{t.name}}", "ghost", icr="chevron-down", size="sm")}
{btn("Sign in", "secondary", ic="user", size="sm")}
</header>"""


FOOTER = f"""<footer style="display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 24px 48px; border-top: var(--border) solid var(--ink); flex-shrink: 0">
<div style="display: flex; align-items: flex-start; gap: 10px; max-width: 640px">{icon("info", 20)}<p class="t-body-sm"><b style="color: var(--ink)">Educational only.</b> Not insurance, legal or financial advice. Your own policy wording decides what is covered.</p></div>
<nav style="display: flex; gap: 20px" class="t-label" aria-label="Footer"><a href="PDHome.dc.html">About</a><a href="PDHome.dc.html">Privacy</a><a href="PDHome.dc.html">Terms of use</a><a href="PDHome.dc.html">Cookie settings</a></nav>
</footer>"""


def flow(on=()):
    stages = ["Quote", "Underwriting", "Bind", "Issue", "Changes", "Claim", "Renewal"]
    out = []
    for i, s in enumerate(stages):
        if s in on:
            out.append(f'<div style="display: flex; align-items: center; gap: 6px; height: 44px; padding: 0 14px; border: var(--border) solid var(--ink); border-radius: var(--radius-md); background: var(--ink); color: var(--on-ink); font-weight: 700; font-size: 15px">{icon("check", 16)}{s}</div>')
        else:
            out.append(f'<div style="display: flex; align-items: center; height: 44px; padding: 0 14px; border: var(--border) solid var(--ink); border-radius: var(--radius-md); font-size: 15px">{s}</div>')
        if i < len(stages) - 1:
            out.append(f'<span aria-hidden="true" style="display: flex">{icon("chevron-right", 20)}</span>')
    return '<div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap">' + "".join(out) + "</div>"


def card(inner, extra=""):
    return f'<section style="border: var(--border-thick) solid var(--ink); border-radius: var(--radius-md); padding: 24px; display: flex; flex-direction: column; gap: 14px; {extra}">{inner}</section>'


def options(name, opts, sel):
    out = []
    for o in opts:
        if o == sel:
            out.append(f'<label style="display: flex; align-items: center; gap: 12px; min-height: 52px; padding: 0 16px; border: var(--border-thick) solid var(--ink); border-radius: var(--radius-md); background: var(--ink); color: var(--on-ink); font-weight: 700"><input type="radio" name="{name}" checked="checked" style="width: 20px; height: 20px; accent-color: currentColor">{o}<span style="margin-left: auto" class="t-label-sm">Selected</span></label>')
        else:
            out.append(f'<label style="display: flex; align-items: center; gap: 12px; min-height: 52px; padding: 0 16px; border: var(--border) solid var(--ink); border-radius: var(--radius-md)"><input type="radio" name="{name}" style="width: 20px; height: 20px; accent-color: currentColor">{o}</label>')
    return '<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px">' + "".join(out) + "</div>"


boards = {}

# ---------------- Home ----------------
H = 1560
types = [("Life", 58), ("Health", 74), ("Auto", 45), ("Home & personal property", 39), ("Liability", 47), ("Commercial", 34), ("Specialty & cyber", 80), ("Financial lines", 48), ("Marine & aviation", 44)]
type_rows = "".join(f'<a href="PDHome.dc.html" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: var(--border-thin) solid var(--ink); text-decoration: none"><span class="t-body">{n}</span><span style="display: flex; align-items: center; gap: 8px" class="t-body-sm">{c} types {icon("chevron-right", 20)}</span></a>' for n, c in types)
paths = [("Insurance basics", "Start here · 30 terms"), ("Medical stop-loss", "24 terms"), ("Cyber insurance", "50 terms"), ("Surety bonds", "28 terms")]
path_rows = "".join(f'<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: var(--border-thin) solid var(--ink)"><div><div class="t-title-sm">{n}</div><div class="t-body-sm">{d}</div></div><a href="PDLearn.dc.html" style="text-decoration: none">{btn("Start", "secondary", size="sm")}</a></div>' for n, d in paths)
chips = "".join(f'<a href="PDTerm.dc.html" style="text-decoration: none">{badge(t)}</a>' for t in ["Insured", "Policy", "Premium", "Quote", "Deductible", "Claim", "Coverage", "Renewal"])
home = header() + f"""
<main style="flex-grow: 1; display: flex; flex-direction: column">
<section style="padding: 72px 48px 56px; display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; border-bottom: var(--border) solid var(--ink)">
<span class="t-label-sm" style="text-transform: uppercase">US insurance · 1,016 terms · 580 types</span>
<h1 style="font-size: 40px; line-height: 48px; font-weight: 700; max-width: 760px">Insurance words, in plain English</h1>
<p class="t-body-lg" style="max-width: 640px; color: var(--ink-muted)">For people reading their policy and anyone new to working in insurance.</p>
<form style="display: flex; gap: 12px; align-items: flex-end; width: 720px; text-align: left" role="search">
<div style="flex-grow: 1">{x("Input", 'label="Search any insurance term" placeholder="e.g. deductible, subrogation, ACV" hint="Abbreviations work too."')}</div>
<div style="padding-bottom: 30px">{btn("Search", "primary", ic="search")}</div>
</form>
<div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; align-items: center"><span class="t-body-sm">Most used:</span>{chips}</div>
</section>
<section style="padding: 40px 48px 0; display: flex; flex-direction: column; gap: 16px">
<h2 class="t-title-lg">How a policy works</h2>
{card(flow() + '<p class="t-body-sm">Every term page shows where it fits in this flow, with a short real-life story.</p>')}
</section>
<section style="padding: 32px 48px 48px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px">
{card('<div style="display: flex; justify-content: space-between; align-items: center"><h2 class="t-title-lg">Insurance types</h2><a href="PDHome.dc.html" class="t-label">See the full tree</a></div><div>' + type_rows + '</div>')}
{card('<div style="display: flex; justify-content: space-between; align-items: center"><h2 class="t-title-lg">Learning paths</h2><a href="PDLearn.dc.html" class="t-label">All paths</a></div><div>' + path_rows + '</div>')}
</section>
</main>
""" + FOOTER
boards["PDHome.dc.html"] = ("PD1 · Home (Paper Design)", W, H, page("Home", W, H, home))

# ---------------- Term ----------------
H = 2480
story = [("Bind", "Tom buys auto insurance for $100/month with $50,000 liability coverage.", False),
         ("Issue", "He gets his policy documents on the 1st.", False),
         ("Changes", "On the 20th, Tom moves and adds collision coverage. His insurer makes both changes with an <b>endorsement</b>.", True),
         ("Result", "His premium goes up to $120/month from the 20th.", False),
         ("Renewal", "At renewal, the policy continues with the new address and coverage.", False)]
story_html = "".join(
    f'<li style="display: flex; gap: 16px; align-items: flex-start"><span style="width: 36px; height: 36px; flex-shrink: 0; border: var(--border) solid var(--ink); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-weight: 700; {"background: var(--ink); color: var(--on-ink)" if hl else ""}">{i+1}</span><div><div class="t-title-sm">{s}{" · this is the endorsement" if hl else ""}</div><p class="t-body">{t}</p></div></li>'
    for i, (s, t, hl) in enumerate(story))
def pbox(label, lines, strong=False):
    b = "var(--border-thick)" if strong else "var(--border)"
    rows = "".join(f'<div style="padding: 8px 0; border-top: var(--border-thin) solid var(--ink)">{l}</div>' for l in lines)
    return f'<div style="flex: 1 1 0; border: {b} solid var(--ink); border-radius: var(--radius-md); padding: 14px"><div class="t-label-sm" style="text-transform: uppercase; margin-bottom: 6px">{label}</div>{rows}</div>'
glance = "".join(f'<div style="display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-top: var(--border-thin) solid var(--ink)"><span class="t-body-sm">{k}</span><span class="t-label" style="text-align: right">{v}</span></div>' for k, v in [("Usage", "Medium"), ("Difficulty", "Beginner"), ("Category", "Policy wording"), ("Insurance types", "All")])
related = "".join(f'<a href="PDTerm.dc.html" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-top: var(--border-thin) solid var(--ink); text-decoration: none"><span>{t}</span>{icon("chevron-right", 20)}</a>' for t in ["Rider", "Declarations page", "Premium", "Policy change request"])
faq = [("What is an endorsement in insurance?", "An official written change to your policy after it starts, like a new address or added coverage.", True), ("Does an endorsement change my premium?", "", False), ("What is the difference between an endorsement and a rider?", "", False)]
faq_html = "".join(f'<div style="border-top: var(--border-thin) solid var(--ink); padding: 14px 0; display: flex; flex-direction: column; gap: 6px"><div style="display: flex; justify-content: space-between; align-items: center"><span class="t-title-sm">{q}</span>{icon("minus" if o else "plus", 20)}</div>{(chr(60) + "p class=" + chr(34) + "t-body" + chr(34) + chr(62) + a + chr(60) + "/p" + chr(62)) if o else ""}</div>' for q, a, o in faq)
term = header("terms") + f"""
<main style="flex-grow: 1; padding: 28px 48px 48px; display: flex; flex-direction: column; gap: 24px">
<nav class="t-body-sm" aria-label="Breadcrumb"><a href="PDHome.dc.html">Terms</a> / <a href="PDHome.dc.html">Policy wording</a> / Endorsement</nav>
<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 24px">
<div style="display: flex; flex-direction: column; gap: 10px">
<h1 style="font-size: 40px; line-height: 48px; font-weight: 700">Endorsement</h1>
<p class="t-body-sm">Also known as: policy change, mid-term adjustment, rider (life &amp; health)</p>
<div style="display: flex; gap: 8px; flex-wrap: wrap">{badge("Medium usage")}{badge("Beginner", "muted")}{badge("Policy wording", "muted")}{badge("AI-generated · AI-reviewed", "outline", "info")}</div>
</div>
<div style="display: flex; gap: 8px">{btn("Save term", "secondary", ic="heart")}{btn("Check yourself", "secondary", icr="arrow-right")}</div>
</div>
<div style="display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 24px; align-items: start">
<div style="display: flex; flex-direction: column; gap: 24px; min-width: 0">
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px">
{card('<span class="t-label-sm" style="text-transform: uppercase">Quick answer</span><p class="t-body-lg">An endorsement is an official written change to an insurance policy after it starts, such as a new address, an added driver or extra coverage. It becomes part of the policy and can raise or lower the premium.</p>')}
{card('<span class="t-label-sm" style="text-transform: uppercase">See it</span><div style="display: flex; gap: 10px; align-items: center">' + pbox("Policy · Jan 1", ["$100 / month", "Old address", "Liability only"]) + '<div style="display: flex; flex-direction: column; align-items: center; gap: 6px">' + badge("Endorsement", "solid") + icon("arrow-right") + '<span class="t-body-sm">Jan 20</span></div>' + pbox("Policy · Jan 20", ["<b>$120 / month</b>", "<b>New address</b>", "Liability <b>+ collision</b>"], True) + '</div><p class="t-body-sm">Same policy, updated. No new policy is bought.</p>')}
</div>
{card('<h2 class="t-title-lg">In plain English</h2><p class="t-body-lg">Your policy is a contract. When something in your life changes, you don’t buy a new policy. The insurer adds an endorsement, a written update that changes part of the contract.</p><h3 class="t-title-sm">Example</h3><p class="t-body">Adding your teenage son as a driver on your car policy is done with an endorsement.</p>')}
{card('<h2 class="t-title-lg">Where it happens in the policy flow</h2>' + flow(("Changes",)) + '<div style="height: 0; border-top: var(--border-thin) solid var(--ink)"></div><h3 class="t-title-md">Tom’s story</h3><ol style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px">' + story_html + '</ol>')}
{card('<div style="display: flex; justify-content: space-between; align-items: center"><h2 class="t-title-lg">Check yourself</h2><span class="t-body-sm">Question 1 of 3 · from a pool of 6</span></div><p class="t-title-md">Halfway through his policy, Tom adds his daughter as a driver. What is this change called?</p>' + options("tq", ["A claim", "An endorsement", "A renewal", "A binder"], "An endorsement") + '<div style="display: flex; justify-content: space-between; align-items: center"><span class="t-body-sm">Correct answers count toward your learning path.</span>' + btn("Check answer", "primary", icr="arrow-right") + '</div>', "border-width: var(--border-thick)")}
{card('<h2 class="t-title-lg">Frequently asked questions</h2><div>' + faq_html + '</div>')}
<div style="display: flex; gap: 12px; align-items: flex-start; padding: 16px 20px; background: var(--paper-sunken); border-radius: var(--radius-md)">{icon("info")}<p class="t-body"><b>Educational only.</b> This is a general explanation, not advice. What’s covered depends on your own policy wording.</p></div>
<p class="t-body-sm">Last updated Sep 30, 2026 · Written by AI, reviewed by AI · Sources listed for review</p>
</div>
<aside style="display: flex; flex-direction: column; gap: 24px">
{card('<h2 class="t-title-md">At a glance</h2><div>' + glance + '</div>')}
{card('<h2 class="t-title-md">Related terms</h2><div>' + related + '</div>')}
{card('<h2 class="t-title-md">In these learning paths</h2><div style="display: flex; flex-direction: column; gap: 6px"><div style="display: flex; justify-content: space-between"><span>Insurance basics</span><span class="t-body-sm">9 of 30</span></div><div style="height: 12px; border: var(--border) solid var(--ink); border-radius: var(--radius-sm); overflow: hidden"><div style="width: 30%; height: 100%; background: var(--ink)"></div></div></div>')}
{card('<h2 class="t-title-md">Something wrong?</h2><p class="t-body-sm">Tell us and we’ll fix the explanation.</p><div>' + btn("Report an issue", "secondary", ic="alert", size="sm") + '</div>')}
</aside>
</div>
</main>
""" + FOOTER
boards["PDTerm.dc.html"] = ("PD2 · Term page (Paper Design)", W, H, page("Term: Endorsement", W, H, term))

# ---------------- Learn ----------------
H = 1300
hatch = "repeating-linear-gradient(45deg, var(--ink) 0 2px, transparent 2px 9px)"
learn = header("paths") + f"""
<div style="display: flex; align-items: center; gap: 24px; padding: 16px 48px; border-bottom: var(--border) solid var(--ink)">
<a href="PDHome.dc.html" class="t-label" style="display: flex; align-items: center; gap: 6px">{icon("arrow-left", 20)}Cyber insurance</a>
<div style="flex-grow: 1; height: 14px; border: var(--border) solid var(--ink); border-radius: var(--radius-sm); overflow: hidden" role="progressbar" aria-valuenow="42" aria-valuemin="0" aria-valuemax="100" aria-label="Path progress"><div style="width: 42%; height: 100%; background: var(--ink)"></div></div>
<span class="t-label">Term 22 of 50 · 21 correct · 42%</span>
</div>
<main style="flex-grow: 1; display: flex; justify-content: center; padding: 32px 48px">
<article style="width: 1080px; border: var(--border-thick) solid var(--ink); border-radius: var(--radius-md); padding: 32px; display: flex; flex-direction: column; gap: 24px; box-sizing: border-box">
<div style="display: flex; justify-content: space-between; align-items: center"><span class="t-label-sm" style="text-transform: uppercase">Module 2 · Coverages</span><div style="display: flex; gap: 8px">{badge("High usage", "solid")}{badge("Beginner", "muted")}</div></div>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px">
<div style="display: flex; flex-direction: column; gap: 16px">
<h1 style="font-size: 36px; line-height: 44px; font-weight: 700">Business interruption</h1>
<p class="t-body-lg">Pays the income you lose while your business can’t run because of a covered event, like a cyber attack.</p>
<div style="background: var(--paper-sunken); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 6px"><span class="t-label-sm" style="text-transform: uppercase">Maria’s story</span><p class="t-body">Maria’s online store is down for 3 days after ransomware. She normally earns $2,000 a day. After a 12-hour waiting period, her policy pays about $5,000 of lost income.</p></div>
<a href="PDTerm.dc.html" class="t-label" style="display: flex; align-items: center; gap: 6px">Read the full term page {icon("arrow-right", 20)}</a>
</div>
<figure style="margin: 0; border: var(--border) solid var(--ink); border-radius: var(--radius-md); padding: 20px; display: flex; flex-direction: column; gap: 14px">
<span class="t-label-sm" style="text-transform: uppercase">See it</span>
<div style="display: flex; justify-content: space-between" class="t-body-sm"><span>Mon 9am · attack</span><span>Thu 9am · back online</span></div>
<div style="display: flex; gap: 4px; height: 56px">
<div style="flex: 1 1 0; border: var(--border) solid var(--ink); border-radius: var(--radius-sm); background: {hatch}; display: flex; align-items: center; justify-content: center"><span class="t-label-sm" style="background: var(--paper); padding: 2px 6px">12 hr wait</span></div>
<div style="flex: 5 1 0; border: var(--border) solid var(--ink); border-radius: var(--radius-sm); background: var(--ink); color: var(--on-ink); display: flex; align-items: center; justify-content: center" class="t-label">Lost income paid by insurer</div>
</div>
<div style="display: flex; gap: 20px" class="t-body-sm"><span style="display: flex; align-items: center; gap: 6px"><span style="width: 16px; height: 16px; border: var(--border) solid var(--ink); background: {hatch}"></span>Waiting period: you pay</span><span style="display: flex; align-items: center; gap: 6px"><span style="width: 16px; height: 16px; border: var(--border) solid var(--ink); background: var(--ink)"></span>Insurer pays</span></div>
<div style="border-top: var(--border-thin) solid var(--ink)"></div>
<span class="t-label-sm" style="text-transform: uppercase">Where it happens</span>
{flow(("Claim",))}
</figure>
</div>
<div style="border-top: var(--border) solid var(--ink); padding-top: 24px; display: flex; flex-direction: column; gap: 14px">
<div style="display: flex; justify-content: space-between"><h2 class="t-title-lg">Check yourself</h2><span class="t-body-sm">Question 2 of 3</span></div>
<p class="t-title-md">A bakery’s card system is hacked and it closes for 2 days. Which part of its cyber policy pays for lost sales?</p>
{options("lq", ["Third-party liability", "Business interruption", "Data restoration", "Regulatory fines"], "Business interruption")}
</div>
<div style="display: flex; justify-content: space-between; align-items: center">
{btn("Previous", "ghost", ic="arrow-left")}
<div style="display: flex; gap: 8px">{btn("Skip", "secondary")}{btn("Check answer & next", "primary", icr="arrow-right")}</div>
</div>
</article>
</main>
""" + FOOTER
boards["PDLearn.dc.html"] = ("PD3 · Learn card (Paper Design)", W, H, page("Learn: Business interruption", W, H, learn))

for f, (title, w, h, html) in boards.items():
    with open(os.path.join(OUT, f), "w") as fh:
        fh.write(html)
print("ok", list(boards))
