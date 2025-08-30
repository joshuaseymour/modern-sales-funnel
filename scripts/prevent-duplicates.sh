#!/bin/bash

# Duplicate Prevention and Cleanup Script
# Run this script before commits to ensure no duplicates are introduced

PROJECT_ROOT="/Users/avolve/Desktop/Simple Sales System/modern-funnel"
DUPLICATE_LOG="$PROJECT_ROOT/duplicate-cleanup.log"

echo "🔍 Scanning for duplicate files..." | tee "$DUPLICATE_LOG"
echo "Date: $(date)" | tee -a "$DUPLICATE_LOG"
echo "==========================================" | tee -a "$DUPLICATE_LOG"

# Function to log and remove duplicate files
remove_duplicates() {
    local pattern="$1"
    local description="$2"
    
    echo "🔍 Checking for: $description" | tee -a "$DUPLICATE_LOG"
    
    find "$PROJECT_ROOT" -maxdepth 2 -name "$pattern" -type f | while read -r file; do
        if [[ -f "$file" ]]; then
            echo "❌ DUPLICATE FOUND: $file" | tee -a "$DUPLICATE_LOG"
            rm "$file"
            echo "✅ REMOVED: $file" | tee -a "$DUPLICATE_LOG"
        fi
    done
}

# Remove common duplicate patterns
remove_duplicates "* 2" "Files with ' 2' suffix"
remove_duplicates "* 2.*" "Files with ' 2' before extension"
remove_duplicates "*_2" "Files with '_2' suffix"
remove_duplicates "*_2.*" "Files with '_2' before extension"
remove_duplicates "*.backup" "Backup files"
remove_duplicates "*.bak" "Bak files"
remove_duplicates "*.old" "Old files"
remove_duplicates "*.orig" "Original files"
remove_duplicates "*copy*" "Files with 'copy' in name"
remove_duplicates "*Copy*" "Files with 'Copy' in name"
remove_duplicates "duplicate*" "Files starting with 'duplicate'"
remove_duplicates "Duplicate*" "Files starting with 'Duplicate'"

# Check for specific duplicate configurations
echo "🔍 Checking for configuration duplicates..." | tee -a "$DUPLICATE_LOG"

# Multiple .gitignore files
gitignore_count=$(find "$PROJECT_ROOT" -maxdepth 1 -name ".gitignore*" -type f | wc -l)
if [[ $gitignore_count -gt 1 ]]; then
    echo "⚠️  WARNING: Multiple .gitignore files found" | tee -a "$DUPLICATE_LOG"
    find "$PROJECT_ROOT" -maxdepth 1 -name ".gitignore*" -type f | tee -a "$DUPLICATE_LOG"
fi

# Multiple tsconfig files (excluding legitimate ones)
tsconfig_duplicates=$(find "$PROJECT_ROOT" -maxdepth 1 -name "tsconfig*" -type f | grep -v "tsconfig.json" | grep -v "tsconfig.tsbuildinfo")
if [[ -n "$tsconfig_duplicates" ]]; then
    echo "⚠️  WARNING: Duplicate tsconfig files found" | tee -a "$DUPLICATE_LOG"
    echo "$tsconfig_duplicates" | tee -a "$DUPLICATE_LOG"
fi

# Check for redundant documentation
echo "🔍 Checking for redundant documentation..." | tee -a "$DUPLICATE_LOG"

# Look for multiple files with similar names that might be duplicates
find "$PROJECT_ROOT" -maxdepth 1 -name "*supabase*.md" -type f | while read -r file; do
    if [[ "$file" != *"SUPABASE_SETUP_GUIDE.md"* ]]; then
        echo "❌ REDUNDANT SUPABASE DOC: $file" | tee -a "$DUPLICATE_LOG"
        rm "$file"
        echo "✅ REMOVED: $file" | tee -a "$DUPLICATE_LOG"
    fi
done

# Validate agent configurations
echo "🔍 Validating agent configurations..." | tee -a "$DUPLICATE_LOG"
agent_count=$(find "$PROJECT_ROOT/.claude/agents" -name "*.md" -type f | wc -l)
echo "📊 Total agents: $agent_count" | tee -a "$DUPLICATE_LOG"

# Check for agents that might be redundant for a sales funnel
irrelevant_agents=("podcast" "academic" "episode" "guest-outreach")
for agent_type in "${irrelevant_agents[@]}"; do
    irrelevant_count=$(find "$PROJECT_ROOT/.claude/agents" -name "*$agent_type*" -type f | wc -l)
    if [[ $irrelevant_count -gt 0 ]]; then
        echo "⚠️  WARNING: Found $irrelevant_count potentially irrelevant '$agent_type' agents" | tee -a "$DUPLICATE_LOG"
    fi
done

echo "==========================================" | tee -a "$DUPLICATE_LOG"
echo "✅ Duplicate cleanup completed!" | tee -a "$DUPLICATE_LOG"
echo "📋 Log saved to: $DUPLICATE_LOG"

# Create a git hook to run this automatically
if [[ ! -f "$PROJECT_ROOT/.git/hooks/pre-commit" ]]; then
    echo "📝 Creating git pre-commit hook..."
    cat > "$PROJECT_ROOT/.git/hooks/pre-commit" << 'EOF'
#!/bin/bash
# Prevent duplicate files from being committed

echo "🔍 Running duplicate prevention check..."
bash "$(git rev-parse --show-toplevel)/scripts/prevent-duplicates.sh"

# Check if any problematic files are staged
if git diff --cached --name-only | grep -E '\s2(\.|$)|_2(\.|$)|\scopy|\sCopy|\.backup$|\.bak$|\.old$|\.orig$'; then
    echo "❌ ERROR: Attempt to commit duplicate files detected!"
    echo "Please run the duplicate prevention script and try again."
    exit 1
fi

echo "✅ No duplicate files detected."
EOF
    chmod +x "$PROJECT_ROOT/.git/hooks/pre-commit"
    echo "✅ Git pre-commit hook installed!"
fi