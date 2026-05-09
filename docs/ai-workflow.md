# AI-Assisted Development Workflow

This document describes how AI tools were integrated into the development of this portfolio, including prompt engineering patterns, validation strategies, and best practices for maintaining code quality.

## Overview

AI assistance was used as a collaborative development tool, not a replacement for engineering judgment. The workflow emphasizes:

- **Minimal changes** - Targeted fixes over rewrites
- **Validation at every step** - Linting, type checking, and testing
- **Preserving maintainability** - Avoiding unnecessary abstraction
- **Human review** - All AI-generated code is reviewed before committing

## Development Philosophy

### What AI Assistance Is Good For

1. **Codebase exploration** - Quickly understanding unfamiliar code
2. **Bug diagnosis** - Tracing issues through complex call chains
3. **Boilerplate reduction** - Generating repetitive patterns
4. **Refactoring suggestions** - Identifying improvement opportunities
5. **Documentation** - Generating initial drafts for review

### What Requires Human Judgment

1. **Architecture decisions** - System design and trade-offs
2. **API design** - Public interfaces and contracts
3. **Security** - Authentication, authorization, input validation
4. **Performance** - Profiling and optimization strategies
5. **User experience** - Design and interaction patterns

## Prompt Engineering Patterns

### Pattern 1: Context-First Prompts

Always provide relevant context before requesting changes.

```
Before editing anything, inspect the full repository structure to understand:
- Framework and tooling
- Styling approach
- Routing/rendering approach
- Deployment/build strategy
```

This prevents AI from making assumptions that conflict with existing patterns.

### Pattern 2: Constraint-Driven Requests

Specify what NOT to do as clearly as what to do.

```
Fix the terminal cursor visibility issue:
- Keep the existing terminal aesthetic
- Do not rewrite the entire component
- Avoid adding new dependencies
```

Constraints prevent over-engineering and scope creep.

### Pattern 3: Incremental Changes

Request small, verifiable changes rather than large rewrites.

```
1. First, read the InteractiveTerminal component
2. Identify where the cursor is rendered
3. Update only the cursor animation class
4. Verify the change doesn't break existing functionality
```

### Pattern 4: Validation Requirements

Explicitly request verification steps.

```
After implementation:
- Run linting
- Run type checking
- Run production build
- Fix all introduced errors
```

## Output Validation Strategy

### Pre-Commit Checklist

Before committing any AI-generated code:

1. **Read the diff** - Understand every change
2. **Run linters** - `npm run lint`
3. **Run type checking** - TypeScript catches many issues
4. **Build the project** - `npm run build`
5. **Test manually** - Verify the feature works as expected
6. **Check for regressions** - Test related functionality

### Code Review Criteria

AI-generated code should meet the same standards as human-written code:

- [ ] Follows existing code patterns
- [ ] No unnecessary complexity
- [ ] No new dependencies without justification
- [ ] Proper error handling
- [ ] No hardcoded values that should be configurable
- [ ] Accessible and responsive (for UI changes)

## Debugging Workflow

### Step 1: Describe the Problem Precisely

```
The blinking cursor in the faux terminal is not noticeable enough.
Current behavior: Uses animate-pulse class
Expected behavior: Mimics a real terminal cursor with clear blink
```

### Step 2: Request Diagnosis Before Fix

```
Before fixing, explain:
- Where the cursor is rendered
- What CSS class controls the animation
- Why the current approach is insufficient
```

### Step 3: Targeted Fix

```
Update only the cursor styling:
- Change animation class from animate-pulse to terminal-cursor
- Use higher contrast color (dracula-green)
- Keep all other terminal behavior unchanged
```

### Step 4: Verify

Run the application and confirm the fix works without side effects.

## Refactoring Guidelines

### When to Refactor

- Fixing a bug that reveals structural issues
- Adding a feature that requires cleaner abstractions
- Removing technical debt as part of planned work

### When NOT to Refactor

- Unrelated code during a bug fix
- Working code that "could be better"
- Without explicit user request or clear justification

### Refactoring Process

1. **Isolate the change** - Don't mix refactoring with feature work
2. **Make the smallest change** - One abstraction at a time
3. **Preserve behavior** - Tests should pass before and after
4. **Document the why** - Commit message explains reasoning

## Maintaining Code Quality

### Avoiding Common AI Pitfalls

1. **Over-abstraction** - AI tends to create unnecessary layers
   - Counter: Request the simplest solution that works

2. **Dependency bloat** - AI may suggest new packages
   - Counter: Prefer native APIs and existing dependencies

3. **Verbose code** - AI may generate unnecessary comments/docs
   - Counter: Request minimal, self-documenting code

4. **Inconsistent style** - AI may not match project conventions
   - Counter: Run formatters and linters automatically

### Quality Checkpoints

| Checkpoint | Tool | When |
|------------|------|------|
| Syntax errors | TypeScript | Every save |
| Style issues | ESLint | Pre-commit |
| Build errors | Vite | Pre-push |
| Visual regressions | Manual review | Before PR |

## Example: Terminal Focus Fix

This example illustrates the workflow applied to a real bug fix.

### Problem Statement

```
After pressing Enter in the terminal, the user must click again before
entering another command. The terminal should retain focus automatically.
```

### Diagnosis

1. Read `InteractiveTerminal.tsx`
2. Identify `handleKeyDown` and `executeCommand` functions
3. Note that focus is lost after async command execution

### Solution Approach

```
Add focus restoration at these points:
1. After Enter key handling (immediate commands)
2. After async command execution completes
3. After clear command
4. After all early return paths
```

### Implementation

Targeted edits to add `inputRef.current?.focus()` at appropriate points.

### Verification

1. Test valid commands - focus retained
2. Test invalid commands - focus retained
3. Test empty commands - focus retained
4. Test async commands (typing animation) - focus retained after completion

## Conclusion

AI assistance is most effective when treated as a junior developer with perfect memory but no context. Provide clear constraints, validate outputs rigorously, and maintain human oversight of all architectural decisions. The goal is increased productivity without sacrificing code quality or maintainability.
