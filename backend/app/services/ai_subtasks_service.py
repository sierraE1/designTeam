from pydantic import BaseModel
from typing import List
import json
import os
import openai

# This defines a model that makes sure the subtasks are a list of strings
class SubtasksModel(BaseModel):
    subtasks: List[str]  # holds all subtasks

# This wasn't working so I vibe coded this part for a quick fix
def _extract_subtasks(content: str) -> list[str]:
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

    # Accept both {"subtasks": [...]} and bare JSON array outputs.
    if isinstance(parsed, dict):
        subtasks = parsed.get("subtasks")
    else:
        subtasks = parsed

    return SubtasksModel(subtasks=subtasks).subtasks


def generate_subtasks(task_name: str, task_notes: str = "") -> list[str]:
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
    # If there are any additional notes consider those
    if task_notes:
        prompt += f' Here are some additional notes to consider: "{task_notes}".'

    # This is the chat completion call to your Navigator/OpenAI-compatible backend
    response = client.chat.completions.create(
        model="gpt-oss-120b",
        messages=[
            {
                "role": "system",
                # These are just instructions
                "content": "You are a productivity assistant. Break down tasks into small, actionable subtasks. Return only valid JSON in the shape {\"subtasks\": [\"...\"]}."
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
    return _extract_subtasks(output)