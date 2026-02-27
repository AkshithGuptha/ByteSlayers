from __future__ import annotations

from typing import Any, List, Optional, Tuple

import numpy as np
from rapidocr_onnxruntime import RapidOCR


class OcrLine(tuple):
    """
    A single OCR line: (text, confidence).
    """


_ENGINE: Optional[RapidOCR] = None


def get_ocr_engine() -> RapidOCR:
    global _ENGINE
    if _ENGINE is None:
        _ENGINE = RapidOCR()
    return _ENGINE


def _safe_float(x: Any) -> Optional[float]:
    try:
        if x is None:
            return None
        return float(x)
    except Exception:
        return None


def ocr_image(img: np.ndarray) -> Tuple[str, Optional[float]]:
    """
    Runs OCR on an image (numpy array) and returns:
    - joined text (one line per detected text region)
    - average confidence (0..1), if available
    """

    engine = get_ocr_engine()
    result = engine(img)

    # RapidOCR commonly returns (ocr_result, elapse)
    if isinstance(result, tuple) and len(result) >= 1:
        ocr_result = result[0]
    else:
        ocr_result = result

    lines: List[str] = []
    scores: List[float] = []

    if isinstance(ocr_result, list):
        for item in ocr_result:
            # Typical format: [box, text, score]
            if isinstance(item, (list, tuple)) and len(item) >= 2:
                text = item[1]
                score = item[2] if len(item) >= 3 else None
                if isinstance(text, str) and text.strip():
                    lines.append(text.strip())
                s = _safe_float(score)
                if s is not None:
                    scores.append(s)

    joined = "\n".join(lines).strip()
    avg_conf = (sum(scores) / len(scores)) if scores else None
    return joined, avg_conf

