from pydantic import BaseModel
from typing import List
import json
import os
import openai

# This defines a model that makes sure the subtasks are a list of strings
class SubtasksModel(BaseModel):
    subtasks: List[str]  # holds all subtasks


class SubtasksPayload(BaseModel):
    subtasks: List[str]
    questions: List[str] = []


class FocusHintPayload(BaseModel):
    hint: str

# This wasn't working so I vibe coded this part for a quick fix
def _extract_subtasks_payload(content: str) -> SubtasksPayload:
    # Handle fenced JSON from providers that wrap outputs in markdown.
    clean = content.replace("```json", "").replace("```", "").strip()

    # Try strict parse first.
    try:
        parsed = json.loads(clean)
    except json.JSONDecodeError:
        # Fall back to first JSON object or array found in the text.
        first_obj = clean.find("{")
        first_arr = clean.find("[")
        if first_obj == -1 and first_arr == -1:
            raise RuntimeError("AI response did not contain valid JSON.")

        if first_obj != -1 and (first_arr == -1 or first_obj < first_arr):
            start = first_obj
            end = clean.rfind("}")
        else:
            start = first_arr
            end = clean.rfind("]")

        if end == -1 or end < start:
            raise RuntimeError("AI response did not contain complete JSON.")
        parsed = json.loads(clean[start : end + 1])

    # Accept both {"subtasks": [...], "questions": [...]} and bare JSON array outputs.
    if isinstance(parsed, dict):
        payload = {
            "subtasks": parsed.get("subtasks"),
            "questions": parsed.get("questions") or [],
        }
    else:
        payload = {"subtasks": parsed, "questions": []}

    return SubtasksPayload(**payload)


def _fallback_question_for_task(task_name: str) -> str:
    name = (task_name or "").strip()
    lower = name.lower()

    if "module" in lower or "chapter" in lower or "lesson" in lower:
        return f"For {name}, how many sections are there and which topics are included?"

    if "presentation" in lower or "slides" in lower or "deck" in lower:
        return f"For {name}, do you have guidelines for slide count and required content?"

    if "essay" in lower or "paper" in lower or "report" in lower:
        return f"For {name}, what are the required length, format, and sources?"

    if "exam" in lower or "quiz" in lower or "study" in lower:
        return f"For {name}, which topics are most important and what is your deadline?"

    if name:
        return f"For {name}, what concrete scope details should I use (deliverables, size, or deadline)?"
    return "What concrete scope details should I use (deliverables, size, or deadline)?"


def generate_subtasks(task_name: str, task_notes: str = "") -> dict:
    # Load the API settings from env and fail clearly if missing
    api_key = os.getenv("TOOLKIT_API_KEY")
    base_url = os.getenv("NAVIGATOR_BASE_URL")
    if not api_key:
        raise RuntimeError("Missing TOOLKIT_API_KEY in environment.")
    if not base_url:
        raise RuntimeError("Missing NAVIGATOR_BASE_URL in environment.")

    client = openai.OpenAI(api_key=api_key, base_url=base_url)

    # You need a prompt to guide the model
    prompt = f'Generate 4-6 actionable subtasks for this task: "{task_name}".'
    prompt += " Use the provided details as constraints for how specific or broad the plan should be."
    # If there are any additional notes consider those
    if task_notes:
        prompt += f' Additional details and notes to follow exactly when applicable: "{task_notes}".'

    # This is the chat completion call to your Navigator/OpenAI-compatible backend
    response = client.chat.completions.create(
        model="gpt-oss-120b",
        messages=[
            {
                "role": "system",
                # These are just instructions
                "content": "You are a productivity assistant for a University student. Break down tasks into small, actionable subtasks. Use strategies that help with time management and focus to make tasks more manageable. Treat the user's provided details as constraints for the decomposition. If the user says there are 5 modules, reflect 5 module-based subtasks; if they mention slides or a quiz, break the task into those deliverables. Return only valid JSON in the shape {\"subtasks\": [\"...\"], \"questions\": [\"...\"]}. Questions are optional and should contain 0-2 brief clarification questions only when missing details would change the plan."
            },
            {
                # The specific task from the user is what we want to break down
                "role": "user",
                "content": prompt
            }
        ],
        response_format={"type": "json_object"}
    )

    # Grab the answer and parse it safely into a list of strings
    output = response.choices[0].message.content or "{}"
    payload = _extract_subtasks_payload(output)
    cleaned_questions = [
        q.strip() for q in payload.questions
        if isinstance(q, str) and q.strip()
    ]
    if not cleaned_questions:
        cleaned_questions = [_fallback_question_for_task(task_name)]
    return {
        "subtasks": payload.subtasks,
        "questions": cleaned_questions[:2],
    }


def generate_focus_hint(task_name: str, task_notes: str = "") -> dict:
    api_key = os.getenv("TOOLKIT_API_KEY")
    base_url = os.getenv("NAVIGATOR_BASE_URL")
    if not api_key or not base_url:
        raise RuntimeError("Missing TOOLKIT_API_KEY or NAVIGATOR_BASE_URL in environment.")

    client = openai.OpenAI(api_key=api_key, base_url=base_url)
    prompt = (
        f'Write one very short conceptual focus hint for the task "{task_name}". '
        "Use the title and notes as context. Focus on the bigger picture or a useful connection to keep in mind. "
        "Return only JSON in the shape {\"hint\": \"...\"}. "
        "Make it 5-8 words, one short sentence, and include star emojis at the beginning and end."
    )
    if task_notes:
        prompt += f' Notes: "{task_notes}".'

    try:
        response = client.chat.completions.create(
            model="gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": "You are a concise study coach. Return only valid JSON in the shape {\"hint\": \"...\"}. The hint must be task-specific, very short, and conceptual. Focus on the bigger picture or one useful connection to keep in mind. Include star emojis at the beginning and end.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            response_format={"type": "json_object"},
        )

        output = response.choices[0].message.content or "{}"
        clean = output.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(clean)
        hint = parsed.get("hint") if isinstance(parsed, dict) else None
        if isinstance(hint, str) and hint.strip():
            return {"hint": hint.strip()}
    except Exception as exc:
        raise RuntimeError(f"Failed to generate focus hint: {exc}") from exc

    raise RuntimeError("AI did not return a valid focus hint.")