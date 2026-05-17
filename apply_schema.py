import os
from database.db import get_connection

def apply_schema():
    print("Applying database schema...")
    schema_path = os.path.join("database", "init_db.sql")
    
    if not os.path.exists(schema_path):
        print(f"Error: {schema_path} not found.")
        return

    with open(schema_path, "r") as f:
        sql = f.read()

    conn = None
    try:
        conn = get_connection()
        # We need to set autocommit to True to run TRUNCATE and CREATE TABLE
        conn.autocommit = True
        with conn.cursor() as cur:
            cur.execute(sql)
        print("Schema applied successfully! Tables 'users' and 'attendance' are updated.")
    except Exception as e:
        print(f"Error applying schema: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    apply_schema()
