import os
import shutil
import sys
import json
from datetime import datetime

def log(message, level="INFO"):
    print(f"[{level}] {message}")

def run_command(command):
    log(f"Running command: {command}")
    exit_code = os.system(command)
    if exit_code != 0:
        log(f"Command failed with exit code {exit_code}", "ERROR")
        sys.exit(1)

def update_package_json(source_path, dest_path):
    with open(source_path, 'r') as f:
        package_data = json.load(f)
    
    with open('./eb/package.json', 'r') as f:
        eb_package_data = json.load(f)
    
    # updating only scripts section of eb folddr
    package_data['scripts'] = eb_package_data['scripts']
    
    with open(dest_path, 'w') as f:
        json.dump(package_data, f, indent=2)

def main():
    current_time = datetime.now().strftime("%d-%m-%Y-%H-%M")
    log(f"Build process started at: {current_time}")

    cwd = os.getcwd()
    dist_dir = os.path.join(cwd, "dist")
    archive_dir = os.path.join(cwd, "zip", f"build-{current_time}")
    archive_file = archive_dir + ".zip"

    log(f"Current working directory: {cwd}")
    log(f"Distribution directory: {dist_dir}")
    log(f"Archive directory: {archive_dir}")
    log(f"Archive file: {archive_file}")

    log("Checking Node version:")
    run_command("node -v")

    log(f"Installing 'node_modules' in '{cwd}'...")
    run_command("npm install")

    log("Generating build...")
    run_command("npm run build")

    if not os.path.exists(dist_dir):
        log(f"Build failed: '{dist_dir}' does not exist", "ERROR")
        sys.exit(1)

    log(f"Updating package.json in '{dist_dir}'...")
    update_package_json('./package.json', os.path.join(dist_dir, 'package.json'))

    log(f"Copying 'package-lock.json' to '{dist_dir}'...")
    shutil.copy("./package-lock.json", dist_dir)

    os.chdir(dist_dir)
    log(f"Changed directory to: {os.getcwd()}")

    log(f"Installing 'node_modules' in '{dist_dir}'...")
    run_command("npm install")

    log(f"Generating archive in '{cwd}'...")
    shutil.make_archive(archive_dir, "zip", ".")

    log(f"Removing '{dist_dir}'...")
    shutil.rmtree(dist_dir)

    log(f"Re-creating '{dist_dir}'...")
    os.mkdir(dist_dir)

    log(f"Moving '{archive_file}' to '{dist_dir}'...")
    shutil.move(archive_file, dist_dir)

    log(f"Build process completed successfully.")
    log(f"Please find the archive in '{dist_dir}'. Rename it using the latest <GIT-TAG>, pattern: <GIT-TAG>.zip")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"An unexpected error occurred: {str(e)}", "ERROR")
        sys.exit(1)