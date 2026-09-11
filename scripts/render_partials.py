"""Render the generated fragments the Quarto pages include.

Two outputs:

  _variables.yml   -- inline numbers, used in prose as {{< var findings_total >}}
  _partials/*.html -- generated blocks (stat strip, basin roster, stream cards)

Everything here is derived from the processed data. No count, basin name, or
stream label is written by hand in a .qmd file.
"""

from __future__ import annotations

from html import escape
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
PARTIALS = ROOT / "_partials"


def _n(value) -> str:
    return f"{value:,}"


_WORDS = {
    1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six",
    7: "seven", 8: "eight", 9: "nine", 10: "ten", 11: "eleven", 12: "twelve",
}


def _word(value: int) -> str:
    """Spell out a small count, for prose where a digit reads badly.

    Falls back to the digits above twelve, so this stays correct however many
    basins become active.
    """
    return _WORDS.get(value, f"{value:,}")


def write_variables(stats: dict, manifest: dict, basins: list[dict], streams: list[dict]) -> None:
    active = [b for b in basins if b["include_in_analysis"]]
    planned = [b for b in basins if not b["include_in_analysis"]]

    def name_list(items, key="short_name"):
        names = [i[key] for i in items]
        if len(names) <= 1:
            return "".join(names)
        return ", ".join(names[:-1]) + " and " + names[-1]

    variables = {
        # counts
        "findings_total": _n(stats["findings_total"]),
        "documents_total": _n(stats["documents_total"]),
        "literature_total": _n(stats["literature_total"]),
        "active_basins": _n(stats["active_basins"]),
        "active_basins_word": _word(stats["active_basins"]),
        "tools_checked": _n(stats.get("tools_checked", 0)),
        "tools_checked_word": _word(stats.get("tools_checked", 0)),
        "literature_with_doi": _n(stats.get("literature_with_doi", 0)),
        "planned_basins": _n(stats["planned_basins"]),
        "sections_total": _n(stats["sections_total"]),
        "comparison_questions_total": _n(stats["comparison_questions_total"]),
        "comparison_questions_all_basins": _n(stats["comparison_questions_all_basins"]),
        "comparison_questions_multi_basin": _n(stats["comparison_questions_multi_basin"]),
        "quotes_verified": _n(stats["quotes_verified"]),
        "absence_findings": _n(stats["absence_findings"]),
        "positive_findings": _n(stats["findings_by_type"].get("positive", 0)),
        "ambiguous_findings": _n(stats["findings_by_type"].get("ambiguous", 0)),
        "active_streams": _n(stats["active_streams"]),
        # names -- so prose never hard-codes the current three
        "basin_list": name_list(active),
        "planned_basin_list": name_list(planned),
        "active_stream_list": " and ".join(
            s["name"] for s in streams if s["status"] == "active"
        ),
        # chapter counts
        "isw_findings": _n(stats["findings_by_chapter"].get("1. ISW", 0)),
        "mlrp_findings": _n(stats["findings_by_chapter"].get("2. MLRP", 0)),
        "community_findings": _n(stats["findings_by_chapter"].get("3. Community Considerations", 0)),
        "build_date": manifest["build_date"],
        # placeholders the user will replace
        "report_url": "REPORT_DOWNLOAD_URL",
    }

    with open(ROOT / "_variables.yml", "w") as fh:
        yaml.safe_dump(variables, fh, sort_keys=True, allow_unicode=True, default_flow_style=False)
    print(f"  > _variables.yml  ({len(variables)} variables)")


def write_stats_strip(stats: dict) -> None:
    cards = [
        (stats["findings_total"], "Coded findings", "Across three thematic chapters"),
        (stats["documents_total"], "Source documents", "Plans, rules, evaluations, reports and comments"),
        (stats["literature_total"], "Papers reviewed", "Assessed for the method each demonstrates"),
        (stats["active_basins"], "Subbasins analyzed", "Each with its own document set"),
    ]
    html = ['<div class="gw-stats">']
    for value, label, hint in cards:
        html.append(
            '<div class="gw-stat">'
            f'<span class="gw-stat__num">{value:,}</span>'
            f'<span class="gw-stat__label">{escape(label)}</span>'
            f'<span class="gw-stat__hint">{escape(hint)}</span>'
            "</div>"
        )
    html.append("</div>")
    (PARTIALS / "stats.html").write_text("\n".join(html) + "\n")
    print("  > _partials/stats.html")


def _profile_rows(basin: dict) -> str:
    profile = basin.get("profile") or {}
    order = [
        ("isw_model", "ISW model"),
        ("accounting_platform", "Groundwater accounting"),
        ("mlrp_structure", "Land repurposing"),
    ]
    rows = []
    for key, label in order:
        entry = profile.get(key)
        if not entry:
            continue
        rows.append(f"<dt>{escape(label)}</dt>")
        value = escape(entry.get("value", ""))
        detail = entry.get("detail")
        ref = entry.get("source_ref")
        dd = f"<dd>{value}"
        if detail:
            dd += f'<br><span class="gw-note">{escape(detail)}</span>'
        if ref:
            dd += f'<br><span class="gw-source-ref">{escape(ref)}</span>'
        dd += "</dd>"
        rows.append(dd)
    return "".join(rows)


def write_basins(basins: list[dict]) -> None:
    """Basin roster. Planned basins render as 'analysis in progress' — never
    as zero findings and never with a findings link."""
    html = ['<div class="gw-basins">']
    for basin in sorted(basins, key=lambda b: b["order"]):
        planned = not basin["include_in_analysis"]
        cls = "gw-basin gw-basin--planned" if planned else "gw-basin"
        html.append(f'<div class="{cls}">')
        if planned:
            html.append('<span class="gw-basin__status">Analysis in progress</span>')
        html.append(f'<h3>{escape(basin["name"])}</h3>')
        if basin.get("region"):
            html.append(f'<p class="gw-basin__region">{escape(basin["region"])}</p>')

        if planned:
            html.append(
                '<p class="gw-note">Registered as a near-term addition. No evidence '
                "from this subbasin has been reviewed, so it contributes nothing to "
                "the counts, comparisons, or conclusions on this site.</p>"
            )
        else:
            rows = _profile_rows(basin)
            if rows:
                html.append(f"<dl>{rows}</dl>")
            if basin.get("scope_note"):
                html.append(f'<p class="gw-note" style="margin-top:.8rem">{escape(basin["scope_note"])}</p>')
            count = basin.get("findings_count")
            html.append(
                f'<a class="gw-basin__link" href="{basin["findings_url"]}">'
                f"{count:,} findings from this subbasin &rarr;</a>"
            )
        html.append("</div>")
    html.append("</div>")
    (PARTIALS / "basins.html").write_text("\n".join(html) + "\n")
    print("  > _partials/basins.html")


def write_streams(streams: list[dict]) -> None:
    """Evidence-stream cards. A planned stream is explicitly labelled as not
    reviewed, using the disclosure text from the registry."""
    html = ['<div class="gw-basins">']
    for stream in sorted(streams, key=lambda s: s["order"]):
        planned = stream["status"] != "active"
        cls = "gw-basin gw-basin--planned" if planned else "gw-basin"
        html.append(f'<div class="{cls}">')
        html.append(
            '<span class="gw-basin__status">Not yet reviewed</span>' if planned
            else '<span class="gw-basin__status" style="border-style:solid;'
                 'color:var(--mlrp-text);border-color:var(--mlrp-light)">Active</span>'
        )
        html.append(f'<h3>{escape(stream["name"])}</h3>')
        html.append(f'<p style="font-size:.93rem">{escape(stream["description"])}</p>')
        if planned:
            html.append(
                f'<p class="gw-note"><strong>Status.</strong> {escape(stream.get("public_disclosure") or "")}</p>'
            )
        else:
            html.append(
                f'<p class="gw-note"><strong>{stream["record_count"]:,} records.</strong> '
                f'{escape(stream.get("citation_note") or "")}</p>'
            )
        html.append("</div>")
    html.append("</div>")
    (PARTIALS / "evidence_streams.html").write_text("\n".join(html) + "\n")
    print("  > _partials/evidence_streams.html")


def write_tools(tools: list[dict]) -> None:
    """The community-facing tools the analysis checked the document sets
    against. Names and URLs come from the consolidation document; whether a
    tool appears in a basin's documents is a coded finding, not asserted here."""
    if not tools:
        return
    html = ['<ul class="gw-tools">']
    for tool in tools:
        html.append(
            '<li class="gw-tools__item">'
            f'<a href="{escape(tool["url"], quote=True)}" rel="noopener">{escape(tool["name"])}</a>'
            "</li>"
        )
    html.append("</ul>")
    (PARTIALS / "tools.html").write_text("\n".join(html) + "\n")
    print(f"  > _partials/tools.html ({len(tools)} tools)")


def render_all(stats: dict, manifest: dict, basins: list[dict], streams: list[dict],
               tools: list[dict] | None = None) -> None:
    PARTIALS.mkdir(exist_ok=True)
    write_variables(stats, manifest, basins, streams)
    write_stats_strip(stats)
    write_basins(basins)
    write_streams(streams)
    write_tools(tools or [])
