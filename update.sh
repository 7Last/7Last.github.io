#!/bin/bash

# Update submodules and discard local changes
git submodule update --recursive --remote

# Function to list content of submodule recursively and store in JSON
list_content_to_json() {
    submodule_path="$1"
    output_json="$2"

    # List content of submodule recursively
    content=$(tree -J "$submodule_path" | jq '.[0]')
    # create json object with key content
    echo "$content" > "$output_json"
}

# Iterate through submodules
for submodule in $(git submodule | awk '{print $2}'); do
    # Extract submodule name
    submodule_name=$(basename "$submodule")

    # Create directory to store JSON
    output_folder="src/static"
    mkdir -p "$output_folder"

    # List content of submodule recursively and store in JSON
    list_content_to_json "$submodule" "$output_folder/$submodule.json"
    git add "$output_folder/$submodule.json"
done
