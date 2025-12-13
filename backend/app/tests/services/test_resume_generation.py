import json
import os
from types import SimpleNamespace
from typing import Iterable

import pytest

from app.services import resume_generation

TEMPLATE_NAME = "jakes_template.tex"


def test_get_template_path_success():
    path = resume_generation.get_template_path(TEMPLATE_NAME)
    assert path.exists()
    assert path.name == TEMPLATE_NAME


def test_get_template_path_missing():
    with pytest.raises(FileNotFoundError):
        resume_generation.get_template_path("missing_template.tex")


def test_build_messages_embeds_template_and_user_data():
    template_path = resume_generation.get_template_path(TEMPLATE_NAME)
    user_data = {"name": "Avery Candidate", "skills": ["Python", "APIs"]}
    messages = resume_generation.build_messages(template_path, user_data)

    assert len(messages) == 2
    assert messages[0]["role"] == "system"
    assert messages[1]["role"] == "user"

    assert template_path.read_text(encoding="utf-8")[:40] in user_content
    assert json.dumps(user_data, ensure_ascii=False, indent=2) in user_content
