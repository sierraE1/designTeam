#This is just a vibe coded test file so i can see if my tasks_service works
from datetime import date
from app.schemas import TaskCreate, TaskUpdate
from app.services.tasks_service import create_task, update_task, delete_task, get_today_tasks_service

# Example user_id
user_id = 1

# 1. Create a task
task = TaskCreate(title="Test Task", description="Check psycopg raw SQL works")
new_task = create_task(user_id, task)
print("Created task:", new_task)

# 2. Update the task
updated_task = update_task(user_id, new_task.id, TaskUpdate(title="Updated Task", description="Updated description"))
print("Updated task:", updated_task)

# 3. Get today's tasks
tasks_today = get_today_tasks_service(user_id)
print("Tasks due today:", tasks_today)

# 4. Delete the task
result = delete_task(user_id, new_task.id)
print("Deleted task:", result)