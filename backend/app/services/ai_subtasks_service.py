import os
import requests
from dotenv import load_dotenv

load_dotenv()  # reads .env
API_KEY = os.environ.get("TOOLKIT_API_KEY")
BASE_URL = os.environ.get("NAVIGATOR_BASE_URL")

def generate_subtasks(task_name: str, task_notes: str = "") -> list[str]:
    prompt = f'Generate 4-6 actionable subtasks for this task: "{task_name}".'
    if task_notes:
        prompt += f' Context: "{task_notes}"'
    
    response = requests.post(
        f"{BASE_URL}/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "gpt-oss-120b",
            "input": prompt
        }
    )
    
    data = response.json()
    return data.get("output", [])