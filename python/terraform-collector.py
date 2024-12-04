import re
import os
import requests
import codecs
import subprocess

# Constants
NAMESPACE = "hashicorp"

HEADERS = {
    'User-Agent': 'Mozilla/5.0'
}

def decode_escapes(s):
    """
    Decodes escape sequences like \n and \", handling errors gracefully.
    """
    try:
        return codecs.decode(s, 'unicode_escape')
    except Exception as e:
        print(f"Error decoding escape sequences: {e}")
        return s  # Return the original string if decoding fails


def substitute_values(content, slug, substitutions):
    """
    Substitute attributes with specified values.
    """
    for attribute, value in substitutions.items():
        if attribute == "tags":
            pattern = re.compile(rf'^(\s*){attribute}\s*=\s*{{.*?}}', re.DOTALL | re.MULTILINE)
            replacement = rf'\1{attribute} = {value}'
        else:
            pattern = re.compile(rf'^(\s*){attribute}\s*=\s*".*?"', re.MULTILINE)
            replacement = rf'\1{attribute} = {value}'
        content = pattern.sub(replacement, content)
    return content

def extract_resources_and_data(content, resource_type):
    """
    Extract the block for a specific resource type from the Terraform content and
    retain blocks containing "data" or "locals" references.
    """
    locals_pattern = rf'^locals\s*{{[\s\S]*?^}}'
    data_pattern = rf'^data\s+\".*?\"\s+\".*?\"\s*{{[\s\S]*?^}}'
    resource_pattern = rf'^resource\s+"{resource_type}"\s+".*?"\s*{{[\s\S]*?^}}'

    resource_blocks = [match.group(0) for match in re.finditer(resource_pattern, content, re.MULTILINE)]
    data_blocks = set()
    locals_blocks = set()

    for resource_block in resource_blocks:
        if 'data.' in resource_block:
            data_blocks.update([match.group(0) for match in re.finditer(data_pattern, content, re.MULTILINE)])
        if 'local.' in resource_block:
            locals_blocks.update([match.group(0) for match in re.finditer(locals_pattern, content, re.MULTILINE)])

    combined_blocks = list(data_blocks) + list(locals_blocks) + resource_blocks
    return '\n\n'.join(combined_blocks)

def extract_resource_from_terraform_url(url):
    """
    Extracts the Terraform service name from the Terraform documentation URL.
    """
    match = re.search(r"/resources/(.*)", url)
    if match:
        return match.group(1)
    return None

def get_github_raw_url(provider, resource):
    """
    Formulates the raw GitHub URL for the Markdown documentation.
    """
    return f"https://raw.githubusercontent.com/{NAMESPACE}/terraform-provider-{provider}/main/website/docs/r/{resource}.html.markdown"

def fetch_markdown_content(url):
    """
    Fetches the raw Markdown content from the GitHub raw URL.
    """
    try:
        print(f"Fetching {url}...")
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            return response.text
        else:
            print(f"Failed to fetch {url}: HTTP {response.status_code}")
    except requests.RequestException as e:
        print(f"Error fetching URL {url}: {e}")
    return None

def extract_terraform_code_blocks(markdown_content):
    """
    Extracts Terraform code blocks from the Markdown content.
    """
    code_blocks = re.findall(r'```hcl(.*?)```', markdown_content, re.DOTALL)
    return code_blocks

def supports_tags(markdown_content):
    """
    Checks if 'tags' are mentioned in the attributes section of the Markdown content.
    """
    return "tags -" in markdown_content

def append_tags_if_supported(markdown_content, terraform_code):
    """
    Appends 'tags = var.tags' to the Terraform code if tags are supported but not present.
    """
    if supports_tags(markdown_content) and 'tags =' not in terraform_code:
        terraform_code = re.sub(r'}\s*$', '\n  tags = var.tags\n}', terraform_code, flags=re.MULTILINE)
    return terraform_code

def format_terraform_code(code: str, indentation='  '):
    """
    Indent Terraform code so that it is formatted correctly.
    """
    lines = code.split('\n')
    indent_level = 0
    formatted_lines = []

    for line in lines:
        stripped_line = line.strip()
        if stripped_line.startswith('}'):
            indent_level -= 1
        formatted_line = (indentation * indent_level) + stripped_line
        formatted_lines.append(formatted_line)
        if stripped_line.endswith('{'):
            indent_level += 1

    return '\n'.join(formatted_lines)

cloud_platforms = [
    {
        'name': 'azure',
        'provider': 'azurerm',
    },
    {
        'name': 'aws',
        'provider': 'aws',
    },
    {
        'name': 'google',
        'provider': 'google',
    }
]

for cloud in cloud_platforms:
    cloud_name = cloud['name']
    cloud_provider = cloud['provider']

    with open(f'../src/app/data/{cloud_name}.ts', 'r') as f:
        tsx_content = f.read()

    pattern = re.compile(r'id:\s*\'(.*?)\',.*?slug:\s*\'(.*?)\',.*?terraformUrl:\s*\'(.*?)\'', re.DOTALL)
    matches = pattern.findall(tsx_content)

    output_directory = f"../public/{cloud_name}/code/terraform"
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    for id, slug, url in matches:
        resource = extract_resource_from_terraform_url(url)
        if resource:
            github_raw_url = get_github_raw_url(cloud_provider, resource)
            markdown_content = fetch_markdown_content(github_raw_url)

            if markdown_content:
                code_blocks = extract_terraform_code_blocks(markdown_content)

                if code_blocks:
                    content = code_blocks[0]

                    # Append tags if supported
                    content = append_tags_if_supported(markdown_content, content)

                    # Decode escape sequences
                    content = decode_escapes(content)

                    substitutions = {
                        "name": f'"{slug}${{local.naming_suffix}}"',
                        "location": "var.location",
                        "tags": "var.tags",
                    }

                    # Substitute name and location values
                    content = substitute_values(content, slug, substitutions)

                    # Extract specific resource block
                    content = extract_resources_and_data(content, f"{cloud_provider}_{resource}")

                    if not content:
                        print(f"Specific resource block not found for {id}!")
                        continue

                    # Replace all instances of "example" and .example
                    content = content.replace('"example"', '"main"').replace('.example', '.main')

                    # Format the Terraform code
                    content = format_terraform_code(content)

                    if not content:
                        print(f"No content for {id}, skipping...")
                        continue

                    file_name = id.replace(' ', '-').lower() + '.tf'
                    full_path = os.path.join(output_directory, file_name)

                    # Check if file already exists and contents are the same
                    if os.path.exists(full_path):
                        with open(full_path, 'r') as f:
                            existing_content = f.read()
                        if existing_content == content:
                            print(f"No changes for {id}, skipping...")
                            continue

                    print(f"Saving to {full_path}")
                    with open(full_path, 'w') as f:
                        f.write(content)
                else:
                    print(f"No code blocks found in {github_raw_url}")
            else:
                print(f"Failed to fetch or parse content for {id}")

    print("Files saved successfully for cloud: {cloud_name}!")

    # Run terraform fmt on all written files
    try:
        print("Running terraform fmt...")
        subprocess.run(["terraform", "fmt", "."], cwd=output_directory, check=True)
        print("Terraform fmt completed successfully!")
    except subprocess.CalledProcessError:
        print("Error running terraform fmt!")
