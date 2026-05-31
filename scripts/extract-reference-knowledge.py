#!/usr/bin/env python3
"""Extract concise BaZi reference knowledge cards from local PDF references.

The output intentionally stores only knowledge cards and source page references.
It does not persist full OCR text.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from PIL import Image
from pypdf import PdfReader


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = REPO_ROOT / "data" / "source" / "16-参考资料知识卡-reference-cards.json"
REFERENCE_DIR = REPO_ROOT / "data" / "参考文档"
DEFAULT_MODEL = "gpt-5.5"
RESPONSES_URL = "https://api.openai.com/v1/responses"
TEXT_MIN_CHARS = 80

SOURCES = [
    {
        "id": "cui-blind-notes-5000",
        "title": "崔老师盲派八字笔记",
        "fileName": "催老师催文举崔老师盲派八字笔记（5000元）.pdf",
        "extractionMethod": "text_layer_then_ai_vision_ocr",
    },
    {
        "id": "cui-five-elements-w",
        "title": "崔文举 盲派八字（五行篇）W",
        "fileName": "崔文举 盲派八字（五行篇）W.pdf",
        "extractionMethod": "ai_vision_ocr_required",
    },
    {
        "id": "cui-advanced-2025",
        "title": "崔老师八字精进班320页2025年",
        "fileName": "崔老师八字精进班320页2025年.pdf",
        "extractionMethod": "ai_vision_ocr_required",
    },
    {
        "id": "yangqingjuan-blind-advanced",
        "title": "杨清娟盲派体系八字《盲派八字高级班笔记》",
        "fileName": "杨清娟盲派体系八字《盲派八字高级班笔记》364页.pdf",
        "extractionMethod": "ai_vision_ocr_required",
    },
]

DOMAINS = {"personality", "career", "money", "health", "children", "marriage", "family", "study", "relocation", "legal"}
MATCH_KEYS = ("stems", "branches", "tenGods", "elements", "relations", "patterns", "stars", "pillars")
CHINESE_NUMBER = {
    "零": "0",
    "一": "1",
    "二": "2",
    "三": "3",
    "四": "4",
    "五": "5",
    "六": "6",
    "七": "7",
    "八": "8",
    "九": "9",
}


def main() -> None:
    args = parse_args()
    load_env_file(REPO_ROOT / ".env")
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    model = os.environ.get("OPENAI_MODEL", "").strip() or args.model or DEFAULT_MODEL
    output_path = Path(args.output).resolve()
    warnings: list[str] = []

    if not api_key and not args.source_registry_only:
      raise SystemExit("OPENAI_API_KEY is required for AI OCR extraction. Add it to .env or the environment, then rerun.")

    existing = read_existing(output_path)
    sources = build_sources(warnings)
    cards = existing.get("cards", []) if args.resume else []
    seen_ids = {card.get("id") for card in cards}

    if args.source_registry_only:
        write_output(output_path, sources, cards, warnings + ["source_registry_only run; no OCR extraction performed."], model)
        print(f"Wrote source registry to {output_path}")
        return

    selected = [source for source in sources if not args.source_id or source["id"] == args.source_id]
    for source in selected:
        pdf_path = REPO_ROOT / source["relativePath"]
        reader = open_pdf(pdf_path)
        page_indexes = page_range(reader, args.start_page, args.end_page, args.max_pages)
        source_cards = []
        for batch in iter_page_batches(reader, page_indexes, args.page_batch_size, source, warnings):
            if not batch["items"]:
                continue
            extracted = call_openai_for_cards(api_key, model, source, batch, args.request_timeout)
            for raw_card in extracted:
                card, error = normalize_card(raw_card, source, batch)
                if error:
                    warnings.append(error)
                    continue
                if card["id"] in seen_ids:
                    continue
                seen_ids.add(card["id"])
                cards.append(card)
                source_cards.append(card)
            time.sleep(args.delay)
        source["processingStatus"] = "processed_by_ai_ocr"
        source["status"] = "processed"
        print(f"{source['id']}: added {len(source_cards)} cards")

    write_output(output_path, sources, cards, warnings, model)
    print(f"Wrote {len(cards)} cards to {output_path}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Extract AI OCR knowledge cards from BaZi PDF references.")
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT), help="Output JSON path.")
    parser.add_argument("--model", default="", help=f"OpenAI model. Defaults to OPENAI_MODEL or {DEFAULT_MODEL}.")
    parser.add_argument("--source-id", default="", help="Process only one source id.")
    parser.add_argument("--start-page", type=int, default=1, help="1-based first page to process.")
    parser.add_argument("--end-page", type=int, default=0, help="1-based last page to process.")
    parser.add_argument("--max-pages", type=int, default=0, help="Maximum pages per selected source.")
    parser.add_argument("--page-batch-size", type=int, default=1, help="Pages per OpenAI request.")
    parser.add_argument("--delay", type=float, default=0.25, help="Delay between API requests.")
    parser.add_argument("--request-timeout", type=int, default=120, help="OpenAI request timeout seconds.")
    parser.add_argument("--resume", action="store_true", help="Keep existing cards and append new unique cards.")
    parser.add_argument("--source-registry-only", action="store_true", help="Write source metadata without calling OpenAI.")
    return parser.parse_args()


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text("utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def read_existing(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"cards": []}
    return json.loads(path.read_text("utf-8"))


def build_sources(warnings: list[str]) -> list[dict[str, Any]]:
    sources = []
    for source in SOURCES:
        pdf_path = REFERENCE_DIR / source["fileName"]
        record = {
            **source,
            "relativePath": str(pdf_path.relative_to(REPO_ROOT)),
            "pageCount": 0,
            "processingStatus": "pending_openai_vision_ocr",
            "status": "pending",
        }
        try:
            record["pageCount"] = len(open_pdf(pdf_path).pages)
        except Exception as error:  # noqa: BLE001
            warnings.append(f"{source['id']}: failed to inspect PDF: {error}")
        sources.append(record)
    return sources


def open_pdf(path: Path) -> PdfReader:
    reader = PdfReader(str(path))
    if reader.is_encrypted:
        try:
            reader.decrypt("")
        except Exception:
            pass
    return reader


def page_range(reader: PdfReader, start_page: int, end_page: int, max_pages: int) -> list[int]:
    start_index = max(0, start_page - 1)
    end_index = min(len(reader.pages), end_page) if end_page else len(reader.pages)
    indexes = list(range(start_index, end_index))
    return indexes[:max_pages] if max_pages else indexes


def iter_page_batches(reader: PdfReader, indexes: list[int], batch_size: int, source: dict[str, Any], warnings: list[str]):
    batch: list[dict[str, Any]] = []
    for index in indexes:
        item = extract_page_item(reader, index, source, warnings)
        if item:
            batch.append(item)
        if len(batch) >= max(1, batch_size):
            yield {"items": batch}
            batch = []
    if batch:
        yield {"items": batch}


def extract_page_item(reader: PdfReader, page_index: int, source: dict[str, Any], warnings: list[str]) -> dict[str, Any] | None:
    page = reader.pages[page_index]
    page_number = page_index + 1
    text = " ".join((page.extract_text() or "").split())
    if len(text) >= TEXT_MIN_CHARS:
        return {"pageStart": page_number, "pageEnd": page_number, "kind": "text", "text": text[:10000]}

    image_url = extract_page_image_data_url(page, page_number, source, warnings)
    if image_url:
        return {"pageStart": page_number, "pageEnd": page_number, "kind": "image", "imageUrl": image_url}

    warnings.append(f"{source['id']} p{page_number}: no usable text or image found")
    return None


def extract_page_image_data_url(page: Any, page_number: int, source: dict[str, Any], warnings: list[str]) -> str:
    images = list(getattr(page, "images", []) or [])
    if not images:
        return ""
    image = max(images, key=lambda item: len(getattr(item, "data", b"") or b""))
    try:
        with Image.open(io.BytesIO(image.data)) as original:
            converted = original.convert("RGB")
            converted.thumbnail((1800, 2400))
            buffer = io.BytesIO()
            converted.save(buffer, format="JPEG", quality=86, optimize=True)
    except Exception as error:  # noqa: BLE001
        warnings.append(f"{source['id']} p{page_number}: image conversion failed: {error}")
        return ""
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/jpeg;base64,{encoded}"


def call_openai_for_cards(api_key: str, model: str, source: dict[str, Any], batch: dict[str, Any], timeout: int) -> list[dict[str, Any]]:
    prompt = build_prompt(source, batch)
    content: list[dict[str, Any]] = [{"type": "input_text", "text": prompt}]
    for item in batch["items"]:
        if item["kind"] == "text":
            content.append({"type": "input_text", "text": f"PAGE {item['pageStart']} TEXT:\n{item['text']}"})
        else:
            content.append({"type": "input_image", "image_url": item["imageUrl"], "detail": "high"})

    payload = {
        "model": model,
        "input": [{"role": "user", "content": content}],
        "text": {
            "format": {
                "type": "json_schema",
                "name": "reference_knowledge_cards",
                "schema": response_schema(),
                "strict": True,
            }
        },
    }
    request = urllib.request.Request(
        RESPONSES_URL,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI HTTP {error.code}: {detail}") from error

    text = extract_response_text(data)
    parsed = json.loads(text)
    return parsed.get("cards", [])


def build_prompt(source: dict[str, Any], batch: dict[str, Any]) -> str:
    pages = ", ".join(str(item["pageStart"]) for item in batch["items"])
    return (
        "你是八字资料整理助手。请从给定页面提炼可用于本地命理软件的知识卡。\n"
        "只输出 JSON，不要输出解释。不要保存或复述完整 OCR 原文。\n"
        "每张卡必须是简短、可匹配、可展示的知识点，而不是长段摘抄。\n"
        "match 只能使用 stems, branches, tenGods, elements, relations, patterns, stars, pillars 这些数组字段。\n"
        "domains 只能从 personality, career, money, health, children, marriage, family, study, relocation, legal 中选择。\n"
        "若页面是广告、水印、目录、空页，返回空 cards。\n"
        f"资料来源：{source['title']}（{source['id']}），页面：{pages}。"
    )


def response_schema() -> dict[str, Any]:
    match_properties = {key: {"type": "array", "items": {"type": "string"}} for key in MATCH_KEYS}
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "cards": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "title": {"type": "string"},
                        "category": {"type": "string"},
                        "domains": {"type": "array", "items": {"type": "string"}},
                        "tags": {"type": "array", "items": {"type": "string"}},
                        "match": {"type": "object", "additionalProperties": False, "properties": match_properties, "required": list(MATCH_KEYS)},
                        "summary": {"type": "string"},
                        "interpretation": {"type": "string"},
                        "displayTitle": {"type": "string"},
                        "displayTemplate": {"type": "string"},
                        "confidence": {"type": "string", "enum": ["high", "medium", "low"]},
                    },
                    "required": [
                        "title",
                        "category",
                        "domains",
                        "tags",
                        "match",
                        "summary",
                        "interpretation",
                        "displayTitle",
                        "displayTemplate",
                        "confidence",
                    ],
                },
            }
        },
        "required": ["cards"],
    }


def extract_response_text(response: dict[str, Any]) -> str:
    if response.get("output_text"):
        return response["output_text"]
    parts = []
    for item in response.get("output", []):
        for content in item.get("content", []):
            if content.get("type") in {"output_text", "text"} and content.get("text"):
                parts.append(content["text"])
    if not parts:
        raise RuntimeError("OpenAI response did not contain output_text")
    return "\n".join(parts)


def normalize_card(raw: dict[str, Any], source: dict[str, Any], batch: dict[str, Any]) -> tuple[dict[str, Any] | None, str | None]:
    title = clean_text(raw.get("title", ""))
    if not title:
        return None, f"{source['id']}: dropped card without title"
    domains = [domain for domain in normalize_list(raw.get("domains")) if domain in DOMAINS]
    if not domains:
        return None, f"{source['id']} {title}: dropped card without valid domains"
    match = normalize_match(raw.get("match", {}))
    if not any(match.values()):
        return None, f"{source['id']} {title}: dropped card without usable match"
    source_refs = [{"sourceId": source["id"], "pageStart": item["pageStart"], "pageEnd": item["pageEnd"]} for item in batch["items"]]
    summary = clean_text(raw.get("summary", ""))
    interpretation = clean_text(raw.get("interpretation", ""))
    if not summary or not interpretation:
        return None, f"{source['id']} {title}: dropped card without summary or interpretation"
    return {
        "id": make_card_id(source["id"], source_refs[0]["pageStart"], title),
        "title": title,
        "category": clean_text(raw.get("category", "reference")),
        "domains": domains,
        "tags": normalize_list(raw.get("tags")),
        "match": match,
        "sourceRefs": source_refs,
        "summary": summary,
        "interpretation": interpretation,
        "display": {
            "title": clean_text(raw.get("displayTitle", title)),
            "template": clean_text(raw.get("displayTemplate", interpretation)),
        },
        "enabledForAnalysis": True,
        "confidence": raw.get("confidence") if raw.get("confidence") in {"high", "medium", "low"} else "medium",
        "status": "auto_enabled",
    }, None


def normalize_match(value: Any) -> dict[str, list[str]]:
    source = value if isinstance(value, dict) else {}
    return {key: normalize_list(source.get(key)) for key in MATCH_KEYS}


def normalize_list(value: Any) -> list[str]:
    if value is None:
        return []
    items = value if isinstance(value, list) else [value]
    return [clean_text(item) for item in items if clean_text(item)]


def clean_text(value: Any) -> str:
    return " ".join(str(value or "").split())


def make_card_id(source_id: str, page: int, title: str) -> str:
    slug = "".join(CHINESE_NUMBER.get(char, char) for char in title)
    slug = re.sub(r"[^0-9A-Za-z\u4e00-\u9fff]+", "-", slug).strip("-")
    digest = hashlib.sha1(title.encode("utf-8")).hexdigest()[:8]
    return f"{source_id}-p{page:03d}-{slug[:24] or digest}-{digest}"


def write_output(path: Path, sources: list[dict[str, Any]], cards: list[dict[str, Any]], warnings: list[str], model: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "_meta": {
            "file": path.name,
            "title": "参考资料知识卡库",
            "description": "从 data/参考文档 下的 PDF 提取出的独立知识卡；不保存完整 OCR 原文。",
            "version": "0.1.0",
            "status": "draft",
            "generatedBy": "scripts/extract-reference-knowledge.py",
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "model": model,
            "ocrPolicy": "只保存知识卡、页码引用和短摘要；不保存完整逐页 OCR 文本。",
            "analysisPolicy": "enabledForAnalysis 为 true 的知识卡会自动参与命盘分析，页面会标注其为 AI OCR 自动提取资料卡。",
            "extractionWarnings": warnings,
        },
        "sources": sources,
        "cards": sorted(cards, key=lambda card: card["id"]),
    }
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", "utf-8")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit("Interrupted")
